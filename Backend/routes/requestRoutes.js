const express = require("express");
const mongoose = require("mongoose");
const MaintenanceRequest = require("../models/MaintenanceRequest");
const User = require("../models/User");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const router = express.Router();
const populate = (query) => query.populate("resident", "fullName email unitNumber apartmentNumber")
    .populate("assignedTechnician", "fullName email speciality");
const sameId = (a, b) => Boolean(a && b && String(a._id || a) === String(b._id || b));
const canAccess = (user, request) => user.role === "manager"
    || (user.role === "resident" && sameId(request.resident, user._id))
    || (user.role === "technician" && sameId(request.assignedTechnician, user._id));

router.use(requireAuth);
router.param("id", (req, res, next, id) => {
    if (!mongoose.isObjectIdOrHexString(id)) return res.status(400).json({ success: false, message: "Invalid request ID." });
    next();
});

router.post("/", requireRole("resident"), async (req, res) => {
    const { title, description, priority, category } = req.body || {};
    const unitNumber = req.user.unitNumber || req.user.apartmentNumber;
    if (!unitNumber) return res.status(400).json({ success: false, message: "Your account needs an apartment / unit number before creating a request." });
    if (typeof title !== "string" || !title.trim() || typeof description !== "string" || !description.trim()
        || (category !== undefined && (typeof category !== "string" || !category.trim()))
        || (priority !== undefined && !["High", "Medium", "Low"].includes(priority))) {
        return res.status(400).json({ success: false, message: "A title, description and valid priority/category are required." });
    }
    const request = await MaintenanceRequest.create({ title, description, priority, category, resident: req.user._id, unitNumber });
    res.status(201).json({ success: true, message: "Maintenance request created successfully.", request });
});

router.get("/", async (req, res) => {
    const query = req.user.role === "resident" ? { resident: req.user._id }
        : req.user.role === "technician" ? { assignedTechnician: req.user._id } : {};
    const requests = await populate(MaintenanceRequest.find(query)).sort({ createdAt: -1 });
    res.json({ success: true, count: requests.length, requests });
});

router.get("/:id", async (req, res) => {
    const request = await populate(MaintenanceRequest.findById(req.params.id));
    if (!request) return res.status(404).json({ success: false, message: "Maintenance request not found." });
    if (!canAccess(req.user, request)) return res.status(403).json({ success: false, message: "Not authorized to view this request." });
    res.json({ success: true, request });
});

router.put("/:id", async (req, res) => {
    const request = await MaintenanceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: "Maintenance request not found." });
    if (!canAccess(req.user, request)) return res.status(403).json({ success: false, message: "Not authorized to update this request." });
    const allowed = req.user.role === "resident" ? ["title", "description", "priority", "category"]
        : req.user.role === "technician" ? ["status"] : ["title", "description", "priority", "category", "status", "assignedTechnician"];
    const body = req.body || {};
    const keys = Object.keys(body);
    if (!keys.length || keys.some((key) => !allowed.includes(key))) {
        return res.status(400).json({ success: false, message: "Update contains missing or unauthorized fields." });
    }
    for (const key of keys) {
        if (key !== "assignedTechnician" && (typeof body[key] !== "string" || !body[key].trim())) {
            return res.status(400).json({ success: false, message: `Invalid ${key}.` });
        }
    }
    if ("assignedTechnician" in body && body.assignedTechnician !== null) {
        if (!mongoose.isObjectIdOrHexString(body.assignedTechnician)
            || !await User.exists({ _id: body.assignedTechnician, role: "technician" })) {
            return res.status(400).json({ success: false, message: "Select an existing technician." });
        }
    }
    const updates = { ...body };
    if (body.status) updates.completedAt = body.status === "Completed" ? request.completedAt || new Date() : null;
    const updatedRequest = await populate(MaintenanceRequest.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true, runValidators: true }));
    res.json({ success: true, message: "Maintenance request updated successfully.", request: updatedRequest });
});

router.delete("/:id", requireRole("manager"), async (req, res) => {
    const request = await MaintenanceRequest.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: "Maintenance request not found." });
    res.json({ success: true, message: "Maintenance request deleted successfully." });
});
module.exports = router;
