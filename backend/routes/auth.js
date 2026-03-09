const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Offer = require('../models/Offer');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validation');
const sendEmail = require('../utils/emailService');

const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecret_placeholder_key', {
        expiresIn: '15m', // Short-lived
    });
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecret_placeholder_key', {
        expiresIn: '30d', // Long-lived
    });
};

// Login Route
router.post('/login', validateRequest('login'), async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Login attempt for: ${email}`);

        const user = await User.findOne({ email: email.toLowerCase() });

        if (user && (await user.matchPassword(password))) {
            const accessToken = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);

            // Store refresh token in DB
            user.refreshToken = refreshToken;
            await user.save();

            console.log(`Login successful for: ${email}`);
            return res.json({
                success: true,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: accessToken,
                    refreshToken: refreshToken
                }
            });
        } else {
            console.log(`Login failed for: ${email}`);
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('API Error in POST /api/auth/login:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Register Route
router.post('/register', validateRequest('register'), async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        console.log(`Registration attempt for: ${email}`);

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const accessToken = jwt.sign({ temp: 'auth' }, process.env.JWT_SECRET || 'supersecret_placeholder_key'); // Placeholder for creation

        const newUser = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            role
        });

        const finalAccessToken = generateAccessToken(newUser._id);
        const refreshToken = generateRefreshToken(newUser._id);

        newUser.refreshToken = refreshToken;
        await newUser.save();

        console.log(`Registration successful for: ${email}`);
        return res.status(201).json({
            success: true,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                token: finalAccessToken,
                refreshToken: refreshToken
            }
        });
    } catch (error) {
        console.error('API Error in POST /api/auth/register:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Refresh Token Route
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ success: false, message: 'Refresh token required' });
        }

        const user = await User.findOne({ refreshToken });
        if (!user) {
            return res.status(403).json({ success: false, message: 'Invalid refresh token' });
        }

        // Verify token
        jwt.verify(refreshToken, process.env.JWT_SECRET || 'supersecret_placeholder_key', (err, decoded) => {
            if (err) return res.status(403).json({ success: false, message: 'Token expired or invalid' });
            
            const newAccessToken = generateAccessToken(user._id);
            res.json({ success: true, token: newAccessToken });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Logout Route
router.post('/logout', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
        res.json({ success: true, message: 'Logged out' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Toggle Favorite
router.post('/favorites/toggle/:offerId', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const offerId = req.params.offerId;

        const isFavorite = user.favorites.includes(offerId);
        if (isFavorite) {
            user.favorites = user.favorites.filter(id => id.toString() !== offerId);
        } else {
            user.favorites.push(offerId);
        }

        await user.save();
        res.json({ success: true, favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get My Favorites
router.get('/favorites', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'favorites',
            populate: { path: 'storeId', select: 'storeName location' }
        });
        res.json({ success: true, favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
router.post('/forgotpassword', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email.toLowerCase() });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found with that email' });
        }

        // Get reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash and set resetToken field
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Set expire
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();

        console.log('\n*********************************');
        console.log('       PASSWORD RESET TOKEN      ');
        console.log(`EMAIL: ${user.email}`);
        console.log(`CODE:  ${resetToken}`);
        console.log('*********************************\n');

        // Create reset URL (In a real app, this would use the frontend URL)
        // For Expo/Mobile, we might just send the code for manual entry
        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please use the following code to reset your password:\n\n${resetToken}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Token',
                message,
            });

            res.status(200).json({ success: true, message: 'Email sent' });
        } catch (err) {
            console.error(err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();

            return res.status(500).json({ success: false, message: 'Email could not be sent' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
router.put('/resetpassword/:resettoken', async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resettoken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
