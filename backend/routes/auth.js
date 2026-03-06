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
        const { password, ...userWithoutPassword } = user;
        return res.json({ success: true, user: userWithoutPassword });
    } else {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Register Route
router.post('/register', (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const newUser = {
        id: 'u' + Date.now(),
        name,
        email,
        password,
        role,
    };

    // Note: In a real app we'd push to USERS or DB.
    // Here we just return success.
    return res.json({ success: true, user: newUser });
});

router.get('/users', (req, res) => {
    // Return users without passwords
    const safeUsers = USERS.map(({ password, ...rest }) => rest);
    res.json(safeUsers || []);
});

module.exports = router;
