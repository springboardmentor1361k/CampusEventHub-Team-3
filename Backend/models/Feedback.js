const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
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
        rating: {
            type: Number,
            required: [true, "Rating is required"],
            min: [1, "Rating must be between 1 and 5"],
            max: [5, "Rating must be between 1 and 5"],
        },
        comments: {
            type: String,
            trim: true,
            maxlength: [1000, "Comments cannot exceed 1000 characters"],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
