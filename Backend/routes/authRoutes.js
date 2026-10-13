const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const router = express.Router();
const roles = ["resident", "technician", "manager"];
const text = (value) => typeof value === "string" ? value.trim() : "";
const emailValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

function publicUser(user) {
    return {
        id: user._id,
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        available: user.available,
        ...(user.unitNumber || user.apartmentNumber ? { unitNumber: user.unitNumber || user.apartmentNumber } : {}),
        ...(user.speciality ? { speciality: user.speciality } : {}),
    };
}

router.post("/register", async (req, res) => {
    const body = req.body || {};
    const fullName = text(body.fullName);
    const email = text(body.email).toLowerCase();
    const role = text(body.role).toLowerCase();
    const unitNumber = text(body.unitNumber);
    const speciality = text(body.speciality);
    const { password, confirmPassword } = body;
    let message;
    if (!fullName || !email || typeof password !== "string" || !password) message = "Full name, email and password are required.";
    else if (!emailValid(email)) message = "Please enter a valid email address.";
    else if (password.length < 6 || Buffer.byteLength(password, "utf8") > 72) message = "Password must be at least 6 characters and no more than 72 UTF-8 bytes.";
    else if (typeof confirmPassword !== "string" || password !== confirmPassword) message = "Password confirmation is required and must match.";
    else if (!roles.includes(role)) message = "Choose Resident, Technician or Manager.";
    else if (role === "resident" && !unitNumber) message = "Apartment / Unit number is required for residents.";
    else if (role === "technician" && !speciality) message = "Speciality is required for technicians.";
    if (message) return res.status(400).json({ success: false, message });
    if (await User.exists({ email })) return res.status(409).json({ success: false, message: "An account with this email already exists." });
    const user = await User.create({
        fullName, email, role, password: await bcrypt.hash(password, 10),
        ...(role === "resident" ? { unitNumber } : {}),
        ...(role === "technician" ? { speciality } : {}),
    });
    res.status(201).json({ success: true, message: "Account created successfully.", user: publicUser(user) });
});

router.post("/login", async (req, res) => {
    const body = req.body || {};
    const email = text(body.email).toLowerCase();
    const role = text(body.role).toLowerCase();
    if (!emailValid(email) || typeof body.password !== "string" || !body.password || !roles.includes(role)) {
        return res.status(400).json({ success: false, message: "Valid email, password and role are required." });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !await bcrypt.compare(body.password, user.password)) {
        return res.status(401).json({ success: false, message: "Invalid email or password." });
    }
    if (role !== user.role) return res.status(403).json({ success: false, message: `This account is registered as ${user.role}.` });
    const token = jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { algorithm: "HS256", expiresIn: "7d" });
    res.json({ success: true, message: "Login successful.", token, role: user.role, user: publicUser(user) });
});

router.get("/me", requireAuth, (req, res) => res.json({ success: true, user: publicUser(req.user) }));

router.patch("/me", requireAuth, requireRole("technician"), async (req, res) => {
    if (typeof req.body?.available !== "boolean" || Object.keys(req.body).some((key) => key !== "available")) {
        return res.status(400).json({ success: false, message: "A boolean availability value is required." });
    }
    const user = await User.findByIdAndUpdate(req.user._id, { $set: { available: req.body.available } }, { new: true, runValidators: true });
    res.json({ success: true, user: publicUser(user) });
});

router.get("/users", requireAuth, requireRole("manager"), async (req, res) => {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, users: users.map(publicUser) });
});
module.exports = router;
