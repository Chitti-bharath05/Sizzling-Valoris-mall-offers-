const express = require('express');
const router = express.Router();
const { ORDERS } = require('../data/mockData');

// Get all orders for a specific user
router.get('/user/:userId', (req, res) => {
    const userOrders = ORDERS.filter(o => o.userId === req.params.userId);
    res.json(userOrders);
});

// Create new order
router.post('/', (req, res) => {
    const { userId, items, totalAmount } = req.body;

    if (!userId || !items || !totalAmount) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const newOrder = {
        id: 'ord' + Date.now(),
        userId,
        items,
        totalAmount,
        paymentStatus: 'completed',
        orderDate: new Date().toISOString().split('T')[0],
    };

    ORDERS.push(newOrder);
    res.status(201).json({ success: true, order: newOrder });
});

module.exports = router;
