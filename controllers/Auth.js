const User = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
require("dotenv").config()

exports.signup = async (req, res) => {

    try {
        // get data
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
        } = req.body

        // validation
        if (
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !confirmPassword
        ) {
            return res.status(403).send({
                success: false,
                message: "All fields are required"
            })
        }

        //compare password
        if (password !== confirmPassword) {
            return res.status(401).json({
                success: false,
                message: "Password and Confirm Password do not match. Please try again."
            })
        }

        //check if user already exist indB
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(402).json({
                success: false,
                message: "User already exists. Please sign in to continue.",
            });
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);


        //ceate and enter user in db
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        })

        return res.status(200).json({
            success: true,
            user,
            message: "User registered successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again.",
        });
    }
}

exports.login = async (req, res) => {
    try {
        // Get email and password from request body
        const { email, password } = req.body;

        // Check if email or password is missing
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: `All fields required`,
            });
        }


        // Find user with provided email
        const user = await User.findOne({ email })

        // Generate JWT token and Compare Password
        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { email: user.email, id: user._id, },
                process.env.JWT_SECRET,
                {
                    expiresIn: "24h",
                }
            );

            user.token = token;
            user.password = undefined; 

            // Set cookie for token and return success response
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: `User Login Success`,
            });
        } else {
            return res.status(401).json({
                success: false,
                message: `Password is incorrect`,
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: `Login Failure Please Try Again`,
        });
    }
}