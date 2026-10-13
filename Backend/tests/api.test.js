const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");
process.env.JWT_SECRET = crypto.randomBytes(48).toString("hex");
const { app } = require("../server");
const User = require("../models/User");
const MaintenanceRequest = require("../models/MaintenanceRequest");
let mongo, server, base;
before(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri("ApartmentCareApiTests"));
    await User.init();
    server = await new Promise((resolve) => { const listener = app.listen(0, "127.0.0.1", () => resolve(listener)); });
    base = `http://127.0.0.1:${server.address().port}/api`;
});
after(async () => {
    if (server) await new Promise((resolve) => server.close(resolve));
    await mongoose.disconnect();
    if (mongo) await mongo.stop();
});

async function call(method, path, body, token, expected = 200) {
    const response = await fetch(base + path, { method, headers: {
        "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    const result = await response.json();
    assert.equal(response.status, expected, `${method} ${path}: ${result.message}`);
    assert.equal(result.success, expected < 400);
    return result;
}
const password = "Test-only-password-123!";
const account = (role, suffix = "") => ({ fullName: `Test ${role} ${suffix}`.trim(), email: `${role}${suffix}@example.test`, password, confirmPassword: password, role,
    ...(role === "resident" ? { unitNumber: "TEST-A204" } : {}), ...(role === "technician" ? { speciality: "Plumbing" } : {}) });

test("authentication, database persistence and authorized request lifecycle", async (t) => {
    await t.test("health reports the connected database", () => call("GET", "/health"));
    const resident = await call("POST", "/auth/register", account("resident"), null, 201);
    const technician = await call("POST", "/auth/register", account("technician"), null, 201);
    await call("POST", "/auth/register", account("manager"), null, 201);
    await call("POST", "/auth/register", account("resident", "other"), null, 201);
    await call("POST", "/auth/register", account("technician", "other"), null, 201);
    await t.test("resident unit and hashed password are stored; password is hidden by default", async () => {
        const saved = await User.findById(resident.user.id).select("+password");
        assert.equal(saved.unitNumber, "TEST-A204");
        assert.notEqual(saved.password, password);
        assert.equal(await bcrypt.compare(password, saved.password), true);
        assert.equal((await User.findById(saved._id)).password, undefined);
        assert.equal(resident.user.password, undefined);
        assert.equal(technician.user.speciality, "Plumbing");
    });
    for (const [name, body] of [
        ["missing confirmation", { ...account("resident", "bad1"), confirmPassword: undefined }],
        ["mismatched confirmation", { ...account("resident", "bad2"), confirmPassword: "wrong" }],
        ["invalid email", { ...account("manager"), email: "invalid" }],
        ["short password", { ...account("manager"), password: "123", confirmPassword: "123" }],
        ["invalid role", { ...account("manager"), role: "admin" }],
        ["missing role", { ...account("manager"), role: undefined }],
        ["wrong field types", { ...account("manager"), email: {} }],
        ["blank full name", { ...account("manager"), fullName: "   " }],
        ["missing unit", { ...account("resident"), unitNumber: undefined }],
        ["missing speciality", { ...account("technician"), speciality: undefined }],
        ["bcrypt truncation", { ...account("manager"), password: "a".repeat(73), confirmPassword: "a".repeat(73) }],
    ]) await t.test(`rejects ${name}`, () => call("POST", "/auth/register", body, null, 400));
    await t.test("duplicate normalized email returns 409", () => call("POST", "/auth/register", { ...account("resident"), email: " RESIDENT@EXAMPLE.TEST " }, null, 409));
    const login = (role, suffix = "") => call("POST", "/auth/login", { email: `${role}${suffix}@example.test`, password, role });
    const residentLogin = await login("resident");
    const technicianLogin = await login("technician");
    const managerLogin = await login("manager");
    const otherResident = await login("resident", "other");
    const otherTechnician = await login("technician", "other");
    const rt = residentLogin.token, tt = technicianLogin.token, mt = managerLogin.token;
    await t.test("JWT is valid and current user is returned without password", async () => {
        assert.equal(jwt.verify(rt, process.env.JWT_SECRET).id, resident.user.id);
        assert.equal(residentLogin.role, "resident");
        const me = await call("GET", "/auth/me", undefined, rt);
        assert.equal(me.user.unitNumber, "TEST-A204");
        assert.equal(me.user.password, undefined);
    });
    await t.test("wrong password rejected", () => call("POST", "/auth/login", { email: account("resident").email, password: "wrong", role: "resident" }, null, 401));
    await t.test("wrong selected role rejected", () => call("POST", "/auth/login", { email: account("resident").email, password, role: "manager" }, null, 403));
    await t.test("malformed login rejected", () => call("POST", "/auth/login", { email: [], password: {}, role: {} }, null, 400));
    await t.test("unauthenticated requests rejected", () => call("GET", "/requests", undefined, null, 401));
    await t.test("invalid JWT rejected", () => call("GET", "/auth/me", undefined, "invalid", 401));
    await t.test("expired JWT rejected", () => call("GET", "/auth/me", undefined, jwt.sign({ id: resident.user.id }, process.env.JWT_SECRET, { expiresIn: -1 }), 401));
    await t.test("invalid token subject rejected", () => call("GET", "/auth/me", undefined, jwt.sign({ id: "invalid" }, process.env.JWT_SECRET), 401));
    const created = await call("POST", "/requests", { title: "Test leak", description: "Test water leak", category: "Plumbing", priority: "High", resident: technician.user.id, status: "Completed" }, rt, 201);
    const id = created.request._id;
    await t.test("maintenance request persisted with authenticated owner and unit", async () => {
        const saved = await MaintenanceRequest.findById(id);
        assert.equal(String(saved.resident), resident.user.id);
        assert.equal(saved.unitNumber, "TEST-A204");
        assert.equal(saved.status, "Pending");
    });
    await t.test("invalid request input rejected", () => call("POST", "/requests", { title: [], description: "test" }, rt, 400));
    await t.test("technicians cannot create resident requests", () => call("POST", "/requests", { title: "test", description: "test" }, tt, 403));
    await t.test("other resident cannot see or update request", async () => {
        assert.equal((await call("GET", "/requests", undefined, otherResident.token)).count, 0);
        await call("GET", `/requests/${id}`, undefined, otherResident.token, 403);
        await call("PUT", `/requests/${id}`, { title: "Intrusion" }, otherResident.token, 403);
    });
    await t.test("unassigned technicians cannot see or change request", async () => {
        assert.equal((await call("GET", "/requests", undefined, tt)).count, 0);
        await call("GET", `/requests/${id}`, undefined, tt, 403);
        await call("PUT", `/requests/${id}`, { status: "Completed" }, tt, 403);
    });
    await t.test("residents cannot change ownership or status", async () => {
        await call("PUT", `/requests/${id}`, { resident: technician.user.id }, rt, 400);
        await call("PUT", `/requests/${id}`, { status: "Completed" }, rt, 400);
        await call("PUT", `/requests/${id}`, { title: "Updated leak" }, rt);
    });
    await t.test("only managers can list residents and technicians", async () => {
        await call("GET", "/auth/users", undefined, rt, 403);
        const { users } = await call("GET", "/auth/users", undefined, mt);
        assert.equal(users.length, 5);
        assert.ok(users.every((user) => !user.password));
    });
    await t.test("assignment validates technician role", async () => {
        await call("PUT", `/requests/${id}`, { assignedTechnician: resident.user.id }, mt, 400);
        await call("PUT", `/requests/${id}`, { assignedTechnician: "invalid" }, mt, 400);
        await call("PUT", `/requests/${id}`, { assignedTechnician: technician.user.id }, mt);
    });
    await t.test("assigned technician sees populated request and can update status", async () => {
        const { requests } = await call("GET", "/requests", undefined, tt);
        assert.equal(requests.length, 1);
        assert.equal(requests[0].resident.fullName, resident.user.fullName);
        await call("GET", `/requests/${id}`, undefined, otherTechnician.token, 403);
        await call("PUT", `/requests/${id}`, { status: "Completed" }, otherTechnician.token, 403);
        await call("PUT", `/requests/${id}`, { assignedTechnician: technician.user.id }, tt, 400);
        await call("PUT", `/requests/${id}`, { status: "Assigned" }, tt, 400);
        await call("PUT", `/requests/${id}`, { status: "In Progress" }, tt);
        const result = await call("PUT", `/requests/${id}`, { status: "Completed" }, tt);
        assert.ok(result.request.completedAt);
    });
    await t.test("availability persists without profile privilege escalation", async () => {
        await call("PATCH", "/auth/me", { available: false, role: "manager" }, tt, 400);
        await call("PATCH", "/auth/me", { available: false }, rt, 403);
        assert.equal((await call("PATCH", "/auth/me", { available: false }, tt)).user.available, false);
    });
    await t.test("malformed IDs and missing documents return JSON", async () => {
        await call("GET", "/requests/invalid", undefined, mt, 400);
        await call("PUT", "/requests/invalid", { status: "Completed" }, mt, 400);
        await call("DELETE", "/requests/invalid", undefined, mt, 400);
        await call("GET", `/requests/${new mongoose.Types.ObjectId()}`, undefined, mt, 404);
        await call("GET", "/missing", undefined, null, 404);
    });
    await t.test("invalid JSON produces a useful response", async () => {
        const response = await fetch(base + "/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" });
        assert.equal(response.status, 400);
        assert.equal((await response.json()).message, "Invalid JSON request body.");
    });
    await t.test("CORS allows the configured frontend origin", async () => {
        const response = await fetch(base + "/health", { headers: { Origin: "http://localhost:5173" } });
        assert.equal(response.headers.get("access-control-allow-origin"), "http://localhost:5173");
        const denied = await fetch(base + "/health", { headers: { Origin: "https://untrusted.example" } });
        assert.equal(denied.headers.get("access-control-allow-origin"), null);
    });
    await t.test("only manager can delete; database document is removed", async () => {
        await call("DELETE", `/requests/${id}`, undefined, rt, 403);
        await call("DELETE", `/requests/${id}`, undefined, mt);
        assert.equal(await MaintenanceRequest.findById(id), null);
        await call("GET", `/requests/${id}`, undefined, mt, 404);
    });
    await t.test("database outage returns 503 health and JSON errors without crashing", async () => {
        mongoose.set("bufferCommands", false);
        await mongoose.disconnect();
        const health = await call("GET", "/health", undefined, null, 503);
        assert.equal(health.database, "Disconnected");
        await call("POST", "/auth/login", { email: account("resident").email, password, role: "resident" }, null, 503);
        await call("GET", "/health", undefined, null, 503);
    });
});
