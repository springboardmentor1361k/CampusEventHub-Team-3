const mongoose = require("mongoose");

const adminLogSchema = new mongoose.Schema(
    {
        action: {
            type: String,
            required: true,
            trim: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("AdminLog", adminLogSchema);
