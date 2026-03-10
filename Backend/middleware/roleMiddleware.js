// Role-based authorization middleware factory
// Usage: authorize("college_admin", "super_admin")
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Role '${req.user.role}' is not authorized to access this resource`,
            });
        }

        next();
    };
};
