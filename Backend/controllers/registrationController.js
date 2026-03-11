const Registration = require("../models/Registration");
const Event = require("../models/Event");
const AdminLog = require("../models/AdminLog");

// Register a student for an event
const registerForEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user.id;

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Check if user is a student
        if (req.user.role !== "student") {
            return res.status(403).json({ message: "Only students can register for events" });
        }

        // Check if already registered
        const existingRegistration = await Registration.findOne({ event_id: eventId, user_id: userId });
        if (existingRegistration) {
            return res.status(400).json({ message: "You are already registered for this event" });
        }

        const registration = new Registration({
            event_id: eventId,
            user_id: userId,
        });
        await registration.save();

        res.status(201).json(registration);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all registrations for an event (admin only)
const getEventRegistrations = async (req, res) => {
    try {
        const eventId = req.params.id;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Verify admin owns this event's college or is super admin
        if (req.user.role === "college_admin" && req.user.college !== event.college) {
            return res.status(403).json({ message: "Not authorized to view these registrations" });
        }

        const registrations = await Registration.find({ event_id: eventId }).populate("user_id", "name email");
        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update registration status (admin only)
const updateRegistrationStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'approved' or 'rejected'
        const validStatuses = ["approved", "rejected", "pending"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const registration = await Registration.findById(req.params.id).populate({ path: "event_id", select: "college" });
        if (!registration) {
            return res.status(404).json({ message: "Registration not found" });
        }

        // Verify authorization
        if (req.user.role === "college_admin" && req.user.college !== registration.event_id.college) {
            return res.status(403).json({ message: "Not authorized to modify this registration" });
        }

        registration.status = status;
        await registration.save();

        // Log action
        await AdminLog.create({
            action: `Updated registration ${registration._id} to ${status}`,
            user_id: req.user.id,
        });

        res.status(200).json(registration);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    registerForEvent,
    getEventRegistrations,
    updateRegistrationStatus,
};
