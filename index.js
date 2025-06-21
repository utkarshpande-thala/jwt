const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const Joi = require('joi');
require('dotenv').config();
const jwt = require('jsonwebtoken');

// Import the User model
const userModel = require('./models/user'); // Adjust path as needed

const app = express();

// Middleware setup
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(helmet());
app.use(cors());

// Validation schema
const userSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    age: Joi.number().integer().min(0).max(120).required()
});

// Routes
app.get('/', (req, res) => {
    res.render("index");
});

// User registration
app.post('/registation', async (req, res) => {
    const { error } = userSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: 'Invalid input', details: error.details });
    }

    let { username, email, password, age } = req.body;

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash the password

        let createdUser = await userModel.create({
            username,
            email,
            password: hashedPassword, // Store hashed password
            age
        });

        // Generate JWT token
        const token = jwt.sign(
            { userId: createdUser._id, email: createdUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Token expires in 1 day
        );

        // Store the token as an HTTP-Only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.status(201).json({
            message: "User created successfully!",
            user: {
                username: createdUser.username,
                email: createdUser.email,
                age: createdUser.age
            }
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Error creating user', details: error.message });
    }
});

// User login
app.post("/login", async function (req, res) {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Compare entered password with hashed password in DB
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
            return res.status(401).json({ error: "Invalid password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Token expires in 1 day
        );

        // Store the token as an HTTP-Only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.status(200).json({
            message: "Login successful!",
            user: {
                username: user.username,
                email: user.email,
                age: user.age
            },
            token
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: "Error during login", details: error.message });
    }
});

// Logout route
app.get("/logout", function (req, res) {
    res.clearCookie('token');
    res.redirect("/");
});

// Middleware for JWT verification
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        req.user = decoded; // Attach user payload to request object
        next();
    } catch (error) {
        res.status(403).json({ error: "Forbidden: Invalid token" });
    }
};

// Protected route
app.get('/dashboard', verifyToken, (req, res) => {
    res.json({
        message: "Welcome to your dashboard!",
        user: req.user // Contains the decoded JWT payload
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
