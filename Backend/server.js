const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("node:path");
require("dotenv").config({ path: path.join(__dirname, ".env"), quiet: true });
const { connectDatabase, connectionFailure, validateDatabaseUri } = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const requestRoutes = require("./routes/requestRoutes");

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
    cors({
        origin: (process.env.FRONTEND_URL || "http://localhost:5173").split(",").map((origin) => origin.trim()),
        credentials: true
    })
);

app.use(express.json({ limit: "100kb" }));

// =====================================================
// HOME ROUTE
// =====================================================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "ApartmentCare Backend API is running"
    });
});

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", (req, res) => {
    const connected = mongoose.connection.readyState === 1;
    res.status(connected ? 200 : 503).json({
        success: connected,
        message: connected ? "Server is healthy" : "Database unavailable",
        database:
            mongoose.connection.readyState === 1
                ? "Connected"
                : "Disconnected"
    });
});

// =====================================================
// AUTH ROUTES
// =====================================================

// Fail API calls promptly during outages while retaining Mongoose's startup
// buffering for collection and index initialization before the connection opens.
app.use(["/api/auth", "/api/requests"], (req, res, next) => {
    if (mongoose.connection.readyState !== 1) return res.status(503).json({ success: false, message: "Database unavailable. Please try again later." });
    next();
});
app.use("/api/auth", authRoutes);

// =====================================================
// MAINTENANCE REQUEST ROUTES
// =====================================================

app.use("/api/requests", requestRoutes);

// =====================================================
// 404 ROUTE
// =====================================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found"
    });
});

// =====================================================
// SERVER + MONGODB ATLAS
// =====================================================

const PORT = process.env.PORT || 5000;

// Express 5 forwards rejected route promises here. Keep driver details and secrets private.
app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    let status = 500;
    let message = "Server error. Please try again.";
    if (error.type === "entity.parse.failed") { status = 400; message = "Invalid JSON request body."; }
    else if (error.type === "entity.too.large") { status = 413; message = "Request body is too large."; }
    else if (error.code === 11000) { status = 409; message = "An account with this email already exists."; }
    else if (error.name === "ValidationError" || error.name === "CastError") { status = 400; message = "Invalid data. Check the required fields and allowed values."; }
    else if (/Mongo|Mongoose/.test(error.name)) { status = 503; message = "Database unavailable. Please try again later."; }
    if (status >= 500) console.error(`Request failed (${error.name || "Error"}).`);
    res.status(status).json({ success: false, message });
});

function validateEnvironment() {
    const invalid = (message) => { const error = new Error(message); error.name = "ConfigurationError"; throw error; };
    validateDatabaseUri(process.env.MONGO_URI);
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || /YOUR_SECRET|CHANGE_ME/i.test(process.env.JWT_SECRET)) {
        invalid("JWT_SECRET must contain at least 32 characters in Backend/.env.");
    }
    if (!Number.isInteger(Number(PORT)) || Number(PORT) < 1 || Number(PORT) > 65535) invalid("PORT must be a valid port number.");
}

const startServer = async () => {
    try {
        validateEnvironment();
        console.log("Connecting to MongoDB...");

        await connectDatabase();
        await require("./models/User").init();
        await require("./models/MaintenanceRequest").init();

        console.log("MongoDB connected successfully");

        return await new Promise((resolve, reject) => {
            const server = app.listen(PORT, () => {
                console.log(`ApartmentCare backend running on http://localhost:${PORT}`);
                resolve(server);
            });
            server.on("error", reject);
        });

    } catch (error) {
        console.error(
            "Backend startup failed:"
        );

        // Configuration errors are safe; MongoDB errors can contain a full URI.
        console.error(error.name === "ConfigurationError" ? error.message : connectionFailure(error));
        await mongoose.disconnect();
        throw error;
    }
};

if (require.main === module) {
    startServer().catch(() => { process.exitCode = 1; });
}
module.exports = { app, startServer };
