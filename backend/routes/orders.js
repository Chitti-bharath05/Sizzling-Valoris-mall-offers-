const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Offer = require('../models/Offer');
const { protect } = require('../middleware/authMiddleware');

// Get all orders for a specific user (Protected)
router.get('/user/:userId', protect, async (req, res) => {
    try {
        // Note: For extra security, one might check if req.user._id matches req.params.userId
        const userOrders = await Order.find({ userId: req.params.userId }).populate('items.offerId');
        res.json(userOrders);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Create new order (Protected)
router.post('/', protect, async (req, res) => {
    try {
        const { userId, items, totalAmount } = req.body;

        if (!userId || !items || !totalAmount) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const newOrder = await Order.create({
            userId,
            items,
            totalAmount,
            status: 'completed' // Replacing paymentStatus to match schema
        });

        res.status(201).json({ success: true, order: newOrder });
    } catch (error) {
         res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
