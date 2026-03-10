const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
    {
        event_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

// Prevent a user from registering for the same event multiple times
registrationSchema.index({ event_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model("Registration", registrationSchema);
