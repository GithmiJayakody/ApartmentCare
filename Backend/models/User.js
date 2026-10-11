const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },

        password: {
            type: String,
            required: true,
            select: false
        },

        role: {
            type: String,
            enum: [
                "resident",
                "technician",
                "manager"
            ],
            required: true
        },

        unitNumber: {
            type: String,
            required: function () { return this.role === "resident" && !this.apartmentNumber; },
            trim: true
        },

        // Preserve compatibility with previously saved resident accounts.
        apartmentNumber: {
            type: String,
            default: null,
            trim: true
        },

        available: { type: Boolean, default: true },

        // Required by the existing technician registration form.
        speciality: {
            type: String,
            required: function () { return this.role === "technician"; },
            default: null,
            trim: true
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);
