const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

// SIGNUP
exports.signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword } = req.body;

        // Basic validation
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (password !== confirmPassword) {
            return res.status(401).json({
                success: false,
                message: "Password and Confirm Password do not match",
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists. Please login.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
        });
    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({
            success: false,
            message: "User registration failed. Please try again.",
        });
    }
};

// LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found. Please sign up.",
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password",
            });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
            httpOnly: true,
        };

        // Return filtered user data
        const userData = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        };

        res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            user: userData,
            message: "Login successful",
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            success: false,
            message: "Login failed. Please try again.",
        });
    }
};

// GET PROFILE
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user,
            message: "User profile retrieved successfully",
        });
    } catch (error) {
        console.error("Profile Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve profile. Please try again.",
        });
    }
};

// LOGOUT
exports.logout = async (req, res) => {
    try {
        res.clearCookie("token").status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Logout failed. Please try again.",
        });
    }
};
