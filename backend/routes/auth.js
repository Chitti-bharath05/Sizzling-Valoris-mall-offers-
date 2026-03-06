const express = require('express');
const router = express.Router();
const { USERS } = require('../data/mockData');

// Login Route
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (user) {
        return res.json({ success: true, user });
    }

    return res.status(401).json({ success: false, message: 'Invalid email or password' });
});

// Register Route
router.post('/register', (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const exists = USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const newUser = {
        id: 'u' + Date.now(),
        name,
        email,
        password,
        role,
    };

    // In a real app, we would push to DB. For now, it's just in-memory for this process.
    // Note: USERS is a constant here, so it won't persist across restarts.
    return res.json({ success: true, user: newUser });
});

module.exports = router;
