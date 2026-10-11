const mongoose = require("mongoose");

const maintenanceRequestSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        priority: {
            type: String,
            enum: ["High", "Medium", "Low"],
            required: true,
            default: "Medium"
        },
        status: {
            type: String,
            enum: ["Pending", "In Progress", "Completed"],
            required: true,
            default: "Pending"
        },
        resident: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        unitNumber: {
            type: String,
            required: true,
            trim: true
        },
        category: {
            type: String,
            required: true,
            trim: true,
            default: "General"
        },
        assignedTechnician: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        completedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("MaintenanceRequest", maintenanceRequestSchema);
