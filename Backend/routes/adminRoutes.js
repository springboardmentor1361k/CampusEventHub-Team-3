const express = require("express");
const router = express.Router();
const { getEventRegistrations, updateRegistrationStatus } = require("../controllers/registrationController");
const { getEventFeedback } = require("../controllers/feedbackController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// All admin routes require college_admin or super_admin
router.use(protect, authorize("college_admin", "super_admin"));

router.get("/events/:id/registrations", getEventRegistrations);
router.get("/events/:id/feedback", getEventFeedback);
router.put("/registrations/:id/status", updateRegistrationStatus);

module.exports = router;
