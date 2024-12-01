const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const redisClient = require('../config/redis');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const logger = require('../config/logger');

const TOKEN_EXPIRATION = 60 * 60; // 1 hour

// User Registration
exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = new User({ username, email, password });
        await user.save();
        logger.info(`User registered: ${username}`);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        logger.error('Error during registration', err);
        res.status(400).json({ error: 'Registration failed' });
    }
};

// User Login
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
        redisClient.setex(`sess:${token}`, TOKEN_EXPIRATION, JSON.stringify({ userId: user._id }));
        logger.info(`User logged in: ${username}`);
        res.json({ token });
    } catch (err) {
        logger.error('Error during login', err);
        res.status(500).json({ error: 'Login failed' });
    }
};

// Logout
exports.logout = (req, res) => {
    const token = req.headers['authorization'];
    redisClient.del(`sess:${token}`, (err) => {
        if (err) {
            logger.error('Error during logout', err);
            return res.status(500).json({ error: 'Logout failed' });
        }
        logger.info('User logged out');
        res.status(200).json({ message: 'Logout successful' });
    });
};

// Password Reset
exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        redisClient.setex(`pwd-reset:${resetToken}`, 3600, user._id.toString());

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASSWORD },
        });

        await transporter.sendMail({
            to: email,
            subject: 'Password Reset',
            text: `Reset your password using this link: ${resetLink}`,
        });

        logger.info(`Password reset requested for: ${email}`);
        res.status(200).json({ message: 'Password reset link sent' });
    } catch (err) {
        logger.error('Error during password reset request', err);
        res.status(500).json({ error: 'Password reset failed' });
    }
};
