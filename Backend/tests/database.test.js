const { test } = require("node:test");
const assert = require("node:assert/strict");
const { validateDatabaseUri, connectionFailure } = require("../config/database");
const uri = "mongodb+srv://test:encoded%40password@cluster0.example.mongodb.net/ApartmentCare";

test("Atlas configuration accepts encoded credentials and rejects malformed or insecure options", () => {
    assert.doesNotThrow(() => validateDatabaseUri(uri));
    for (const value of [undefined, "http://example.test", uri.replace("encoded%40password", "<password>"), uri.replace("encoded%40password", "%ZZ"), uri.replace("/ApartmentCare", "/"), uri + "?tls=false", uri.replace(".mongodb.net", ".invalid")]) {
        assert.throws(() => validateDatabaseUri(value), { name: "ConfigurationError" });
    }
});

test("nested Atlas TLS causes are reported without exposing driver messages", () => {
    const error = { name: "MongooseServerSelectionError", message: uri, reason: { servers: new Map([["host", { error: { message: uri, cause: { code: "ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR", message: uri } } }]]) } };
    const result = connectionFailure(error);
    assert.match(result, /TLS handshake before authentication/);
    assert.match(result, /public IP/);
    assert.ok(!result.includes(uri));
});

test("diagnostics distinguish authentication, DNS, certificate and port errors", () => {
    assert.match(connectionFailure({ name: "MongoServerError", code: 18 }), /authentication failed/);
    assert.match(connectionFailure({ code: "ENOTFOUND", syscall: "querySrv" }), /DNS lookup failed/);
    assert.match(connectionFailure({ code: "CERT_HAS_EXPIRED" }), /certificate verification failed/);
    assert.match(connectionFailure({ code: "EADDRINUSE" }), /port is already in use/);
});

test("schemas enforce email format and reject null request enums/category", () => {
    const User = require("../models/User");
    const Request = require("../models/MaintenanceRequest");
    const invalidUser = new User({ fullName: "Validation", email: "invalid", password: "hash", role: "manager" });
    assert.ok(invalidUser.validateSync().errors.email);
    const validRequest = { title: "Validation", description: "Schema validation", resident: new (require("mongoose").Types.ObjectId)(), unitNumber: "TEST-A204" };
    assert.equal(new Request(validRequest).validateSync(), undefined);
    for (const field of ["priority", "status", "category"]) {
        assert.ok(new Request({ ...validRequest, [field]: null }).validateSync().errors[field]);
    }
});
