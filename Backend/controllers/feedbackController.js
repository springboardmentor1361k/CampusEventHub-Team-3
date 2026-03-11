const Feedback = require("../models/Feedback");
const Event = require("../models/Event");

// Submit feedback for an event
const submitFeedback = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user.id;
        const { rating, comments } = req.body;

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Optional: Could enforce that user must be a registered student, but for now allow any authenticated user
        const feedback = new Feedback({
            event_id: eventId,
            user_id: userId,
            rating,
            comments,
        });
        await feedback.save();

        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get feedback for an event
const getEventFeedback = async (req, res) => {
    try {
        const eventId = req.params.id;

        // We can populate user data so frontend can show who left the comment
        const feedbacks = await Feedback.find({ event_id: eventId })
            .populate("user_id", "name role")
            .sort({ createdAt: -1 });

        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    submitFeedback,
    getEventFeedback,
};
