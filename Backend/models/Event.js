const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["workshop", "seminar", "cultural", "sports", "technical", "other"],
        message: "{VALUE} is not a valid category",
      },
    },
    college: {
      type: String,
      required: [true, "College name is required"],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
      validate: {
        validator: function (value) {
          return value >= this.startDate;
        },
        message: "End date must be on or after start date",
      },
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    maxAttendees: {
      type: Number,
      min: [1, "Max attendees must be at least 1"],
    },
    status: {
      type: String,
      enum: ["draft", "published", "cancelled", "completed"],
      default: "published",
    },
  },
  { timestamps: true }
);

// Indexes for fast filtered queries
eventSchema.index({ category: 1 });
eventSchema.index({ college: 1 });
eventSchema.index({ startDate: 1 });
eventSchema.index({ status: 1 });

module.exports = mongoose.model("Event", eventSchema);
