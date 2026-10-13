const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

const requireAuth = async (req, res, next) => {
    const match = /^Bearer\s+(\S+)$/i.exec(req.headers.authorization || "");
    if (!match) return res.status(401).json({ success: false, message: "No authentication token provided." });
    let decoded;
    try {
        decoded = jwt.verify(match[1], process.env.JWT_SECRET, { algorithms: ["HS256"] });
    } catch {
        return res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
    if (!decoded || !mongoose.isObjectIdOrHexString(decoded.id)) {
        return res.status(401).json({ success: false, message: "Invalid authentication token." });
    }
    // Database failures reach the server error handler instead of appearing as bad tokens.
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: "User no longer exists. Please sign in again." });
    req.user = user;
    next();
};
const requireRole = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ success: false, message: "Access denied. Insufficient permissions." });
    }
    next();
};
module.exports = { requireAuth, requireRole };
