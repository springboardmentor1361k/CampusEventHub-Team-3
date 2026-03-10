const Event = require("../models/Event");

// ✅ CREATE EVENT (college_admin only)
exports.createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            college,
            startDate,
            endDate,
            venue,
            maxAttendees,
            status,
        } = req.body;

        // Validate required fields
        if (!title || !description || !category || !college || !startDate || !endDate || !venue) {
            return res.status(400).json({
                message: "All required fields must be provided: title, description, category, college, startDate, endDate, venue",
            });
        }

        // Validate dates
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ message: "Invalid date format" });
        }

        if (end < start) {
            return res.status(400).json({ message: "End date must be on or after start date" });
        }

        const event = await Event.create({
            title,
            description,
            category,
            college,
            startDate: start,
            endDate: end,
            venue,
            maxAttendees,
            status: status || "published",
            organizer: req.user.id,
        });

        const populatedEvent = await Event.findById(event._id).populate(
            "organizer",
            "name email college"
        );

        res.status(201).json({
            message: "Event created successfully",
            event: populatedEvent,
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({ message: messages.join(", ") });
        }
        res.status(500).json({ message: error.message });
    }
};

// ✅ GET ALL EVENTS (public, with filters & pagination)
exports.getEvents = async (req, res) => {
    try {
        const {
            category,
            college,
            startDate,
            endDate,
            status,
            search,
            page = 1,
            limit = 10,
            sortBy = "startDate",
            order = "asc",
        } = req.query;

        const filter = {};

        // Category filter
        if (category) {
            filter.category = category;
        }

        // College filter
        if (college) {
            filter.college = { $regex: college, $options: "i" };
        }

        // Date range filter
        if (startDate || endDate) {
            filter.startDate = {};
            if (startDate) {
                filter.startDate.$gte = new Date(startDate);
            }
            if (endDate) {
                filter.startDate.$lte = new Date(endDate);
            }
        }

        // Status filter (default to published for public view)
        if (status) {
            filter.status = status;
        } else {
            filter.status = "published";
        }

        // Text search on title and description
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        // Pagination
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;

        // Sort
        const sortOrder = order === "desc" ? -1 : 1;
        const sortOptions = { [sortBy]: sortOrder };

        const [events, total] = await Promise.all([
            Event.find(filter)
                .populate("organizer", "name email college")
                .sort(sortOptions)
                .skip(skip)
                .limit(limitNum),
            Event.countDocuments(filter),
        ]);

        res.json({
            events,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum),
                totalEvents: total,
                limit: limitNum,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ GET SINGLE EVENT BY ID (public)
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate(
            "organizer",
            "name email college"
        );

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json({ event });
    } catch (error) {
        if (error.kind === "ObjectId") {
            return res.status(400).json({ message: "Invalid event ID" });
        }
        res.status(500).json({ message: error.message });
    }
};

// ✅ UPDATE EVENT (college_admin, own events only)
exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Check ownership: only the organizer can update
        if (event.organizer.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only update events you created",
            });
        }

        // Validate dates if being updated
        if (req.body.startDate || req.body.endDate) {
            const start = new Date(req.body.startDate || event.startDate);
            const end = new Date(req.body.endDate || event.endDate);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return res.status(400).json({ message: "Invalid date format" });
            }

            if (end < start) {
                return res.status(400).json({
                    message: "End date must be on or after start date",
                });
            }
        }

        const allowedUpdates = [
            "title",
            "description",
            "category",
            "college",
            "startDate",
            "endDate",
            "venue",
            "maxAttendees",
            "status",
        ];

        // Only apply allowed fields
        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                event[field] = req.body[field];
            }
        });

        const updatedEvent = await event.save();
        const populatedEvent = await Event.findById(updatedEvent._id).populate(
            "organizer",
            "name email college"
        );

        res.json({
            message: "Event updated successfully",
            event: populatedEvent,
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({ message: messages.join(", ") });
        }
        if (error.kind === "ObjectId") {
            return res.status(400).json({ message: "Invalid event ID" });
        }
        res.status(500).json({ message: error.message });
    }
};

// ✅ DELETE EVENT (college_admin, own events only)
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Check ownership: only the organizer can delete
        if (event.organizer.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only delete events you created",
            });
        }

        await Event.findByIdAndDelete(req.params.id);

        res.json({ message: "Event deleted successfully" });
    } catch (error) {
        if (error.kind === "ObjectId") {
            return res.status(400).json({ message: "Invalid event ID" });
        }
        res.status(500).json({ message: error.message });
    }
};
