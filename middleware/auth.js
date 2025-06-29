const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

exports.auth = async (req, res, next) => {
    try {
        // Extract token from cookies or Authorization header
        const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

        // If no token, reject request
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. Token missing.",
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // e.g., { id, email }
            next();
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token.",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Authentication error. Please try again.",
        });
    }
};
