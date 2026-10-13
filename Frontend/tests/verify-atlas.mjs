// Live acceptance check: uses the existing Atlas URI and the real development
// services. Deletes only accounts/requests belonging to this unique test run.
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { chromium, expect } from "@playwright/test";

const requireBackend = createRequire(new URL("../../Backend/package.json", import.meta.url));
requireBackend("dotenv").config({ path: fileURLToPath(new URL("../../Backend/.env", import.meta.url)), quiet: true });
const mongoose = requireBackend("mongoose");
const bcrypt = requireBackend("bcryptjs");
const jwt = requireBackend("jsonwebtoken");
const { connectDatabase } = requireBackend("./config/database");
const User = requireBackend("./models/User");
const Request = requireBackend("./models/MaintenanceRequest");
const stamp = crypto.randomUUID();
const password = crypto.randomBytes(24).toString("base64url");
const emails = Object.fromEntries(["resident", "technician", "manager"].map((role) => [role, `livora.verify.${stamp}.${role}@example.test`]));
const title = `Atlas verification ${stamp}`;
const results = [];
let browser;
let stage = "Connect to the existing Atlas database";
const pass = (label) => { results.push(label); console.log(`PASS: ${label}`); };

async function call(method, path, body, token, expected = 200) {
    const response = await fetch(`http://localhost:5000${path}`, {
        method, signal: AbortSignal.timeout(15000),
        headers: { "Content-Type": "application/json", Origin: "http://localhost:5173", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    assert.equal(response.status, expected, `${method} ${path} returned an unexpected HTTP status`);
    assert.equal(response.headers.get("access-control-allow-origin"), "http://localhost:5173");
    const result = await response.json();
    assert.equal(result.success, expected < 400);
    return result;
}

async function login(page, role) {
    await page.goto(`http://localhost:5173/login?role=${role}`);
    await page.locator('input[type="email"]').fill(emails[role]);
    await page.locator('input[type="password"]').fill(password);
    await page.getByRole("button", { name: "Sign In →" }).click();
    await expect(page).toHaveURL(`http://localhost:5173/${role}-dashboard`);
    await expect(page.locator('[role="status"]')).toHaveCount(0);
}

try {
    assert.ok(process.env.MONGO_URI?.startsWith("mongodb+srv://"), "Live verification requires the configured Atlas URI");
    await connectDatabase();
    pass("Existing Atlas URI, credentials, database and ping");
    stage = "Backend health and CORS";
    await call("GET", "/");
    assert.equal((await call("GET", "/api/health")).database, "Connected");
    const preflight = await fetch("http://localhost:5000/api/requests", { method: "OPTIONS", headers: {
        Origin: "http://localhost:5173", "Access-Control-Request-Method": "POST", "Access-Control-Request-Headers": "authorization,content-type",
    } });
    assert.equal(preflight.status, 204);
    assert.equal(preflight.headers.get("access-control-allow-origin"), "http://localhost:5173");
    assert.match(preflight.headers.get("access-control-allow-headers"), /authorization/i);
    pass("GET /, GET /api/health and browser CORS preflight");
    browser = await chromium.launch({ channel: "chrome", headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    page.setDefaultTimeout(20000);
    const errors = [];
    page.on("pageerror", () => errors.push("Browser runtime error"));
    page.on("console", (message) => { if (message.type() === "error") errors.push("Browser console error"); });
    const savedUsers = {};
    const tokens = {};
    for (const role of ["resident", "technician", "manager"]) {
        stage = `Browser registration and Atlas persistence: ${role}`;
        const label = role[0].toUpperCase() + role.slice(1);
        await page.goto("http://localhost:5173/register");
        await page.getByRole("button", { name: new RegExp(`^.*${label}.*Manage`) }).click();
        await page.getByPlaceholder("Enter your full name").fill(`Atlas Verify ${label} ${stamp}`);
        await page.getByPlaceholder("Enter your email", { exact: true }).fill(emails[role]);
        await page.getByPlaceholder("Create a password").fill(password);
        await page.getByPlaceholder("Confirm your password").fill(password);
        if (role === "resident") await page.getByPlaceholder("Example: A-204").fill("VERIFY-A204");
        if (role === "technician") await page.locator(".register-input-group select").selectOption("Plumbing");
        await page.getByRole("button", { name: "Create Account →" }).click();
        await expect(page).toHaveURL(`http://localhost:5173/login?role=${role}`);
        savedUsers[role] = await User.findOne({ email: emails[role] }).select("+password");
        assert.ok(savedUsers[role]);
        assert.ok(await bcrypt.compare(password, savedUsers[role].password));
        assert.equal(savedUsers[role].role, role);
        pass(`${label} registration from React persisted in Atlas with a hashed password`);
        stage = `API login and JWT: ${role}`;
        const auth = await call("POST", "/api/auth/login", { email: emails[role], password, role });
        assert.equal(jwt.verify(auth.token, process.env.JWT_SECRET).id, String(savedUsers[role]._id));
        assert.equal(auth.user.password, undefined);
        tokens[role] = auth.token;
        await call("GET", "/api/auth/me", undefined, auth.token);
        pass(`${label} login reads Atlas and returns a working JWT`);
    }
    stage = "JWT and role access enforcement";
    await call("GET", "/api/requests", undefined, undefined, 401);
    await call("GET", "/api/auth/me", undefined, "invalid", 401);
    const expired = jwt.sign({ id: String(savedUsers.resident._id) }, process.env.JWT_SECRET, { expiresIn: -1 });
    await call("GET", "/api/auth/me", undefined, expired, 401);
    await call("GET", "/api/auth/users", undefined, tokens.resident, 403);
    pass("Missing, invalid and expired JWTs rejected; manager-only route protected");
    stage = "Resident browser login and request creation";
    await login(page, "resident");
    await expect(page.locator(".profile-info")).toContainText("VERIFY-A204");
    await page.getByRole("button", { name: "＋ Create New Request", exact: true }).click();
    let dialog = page.getByRole("dialog");
    await dialog.getByLabel("Title", { exact: true }).fill(title);
    await dialog.getByLabel("Description").fill("Live Atlas integration acceptance check");
    await dialog.getByLabel("Category").selectOption("Plumbing");
    await dialog.getByLabel("Priority").selectOption("High");
    await dialog.getByRole("button", { name: "Save request" }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.locator(".requests-table")).toContainText(title);
    const savedRequest = await Request.findOne({ resident: savedUsers.resident._id, title });
    assert.ok(savedRequest);
    assert.equal(savedRequest.unitNumber, "VERIFY-A204");
    assert.equal(savedRequest.status, "Pending");
    assert.equal((await call("GET", `/api/requests/${savedRequest._id}`, undefined, tokens.resident)).request.title, title);
    await page.reload();
    await expect(page.locator(".requests-table")).toContainText(title);
    pass("React request creation, Atlas document, API retrieval and resident display after reload");
    stage = "Manager browser data and technician assignment";
    await login(page, "manager");
    await page.locator(".manager-nav-item").filter({ hasText: "Residents" }).click();
    await expect(page.locator(".integration-panel")).toContainText(emails.resident);
    await page.locator(".manager-nav-item").filter({ hasText: "Technicians" }).click();
    await expect(page.locator(".integration-panel")).toContainText(emails.technician);
    const managerRow = page.locator(".manager-table tbody tr").filter({ hasText: title });
    await managerRow.locator(".manager-view-btn").click();
    dialog = page.getByRole("dialog");
    await dialog.getByLabel("Assigned technician").selectOption(String(savedUsers.technician._id));
    await dialog.getByRole("button", { name: "Save request" }).click();
    await expect(dialog).toHaveCount(0);
    assert.equal(String((await Request.findById(savedRequest._id)).assignedTechnician), String(savedUsers.technician._id));
    pass("Manager displays Atlas residents/technicians and persists assignment");
    stage = "Technician browser status updates";
    await login(page, "technician");
    const techRow = page.locator(".jobs-table tbody tr").filter({ hasText: title });
    await expect(techRow).toBeVisible();
    for (const status of ["In Progress", "Completed"]) {
        await techRow.locator(".view-job-btn").click();
        dialog = page.getByRole("dialog");
        await dialog.getByLabel("Status").selectOption(status);
        await dialog.getByRole("button", { name: "Save request" }).click();
        await expect(dialog).toHaveCount(0);
        assert.equal((await Request.findById(savedRequest._id)).status, status);
    }
    await page.getByRole("button", { name: "Set Unavailable" }).click();
    await expect(page.getByRole("button", { name: "Set Available" })).toBeVisible();
    assert.equal((await User.findById(savedUsers.technician._id)).available, false);
    pass("Technician reads assigned Atlas data and persists status/availability");
    stage = "Final resident display and browser errors";
    await login(page, "resident");
    await expect(page.locator(".requests-table .request-row").filter({ hasText: title })).toContainText("Completed");
    await expect(page.locator(".completed-card strong")).toHaveText("1");
    assert.ok((await Request.findById(savedRequest._id)).completedAt);
    assert.equal(errors.length, 0);
    pass("Completed Atlas request appears in resident dashboard; no browser runtime/console errors");
} catch (error) {
    // No error messages, traces, tokens, passwords or URIs are printed.
    console.error(`FAIL: ${stage} (${error.name}).`);
    process.exitCode = 1;
} finally {
    await browser?.close();
    try { if (mongoose.connection.readyState === 1) {
        const ownUsers = await User.find({ email: { $in: Object.values(emails) } }).select("_id");
        const ids = ownUsers.map((user) => user._id);
        await Request.deleteMany({ resident: { $in: ids } });
        await User.deleteMany({ _id: { $in: ids }, email: { $in: Object.values(emails) } });
        console.log("Live verification data cleaned up; existing application records preserved.");
    } } catch {
        console.error("Verification record cleanup failed. Inspect only this run's livora.verify email accounts before removing them.");
        process.exitCode = 1;
    }
    await mongoose.disconnect();
    console.log(`Live checks passed: ${results.length}.`);
}
