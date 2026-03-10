const express = require("express");
const router = express.Router();
const {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
} = require("../controllers/eventController");
const { registerForEvent } = require("../controllers/registrationController");
const { submitFeedback } = require("../controllers/feedbackController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// Public routes
router.get("/", getEvents);
router.get("/:id", getEventById);

// Protected student routes
router.post("/:id/register", protect, authorize("student"), registerForEvent);
router.post("/:id/feedback", protect, submitFeedback);

// Protected routes (college_admin only)
router.post("/", protect, authorize("college_admin", "super_admin"), createEvent);
router.put("/:id", protect, authorize("college_admin", "super_admin"), updateEvent);
router.delete("/:id", protect, authorize("college_admin", "super_admin"), deleteEvent);

module.exports = router;
