const express = require('express');
const router = express.Router();
const { STORES } = require('../data/mockData');

// Get all stores
router.get('/', (req, res) => {
    res.json(STORES || []);
});

// Get store by ID
router.get('/:id', (req, res) => {
    const store = STORES.find((s) => s.id === req.params.id);
    if (store) {
        res.json(store);
    } else {
        res.status(404).json({ message: 'Store not found' });
    }
});

// Get store by owner ID
router.get('/owner/:ownerId', (req, res) => {
    const userStores = STORES.filter((s) => s.ownerId === req.params.ownerId);
    res.json(userStores || []);
});

// Create new store
router.post('/', (req, res) => {
    const { storeName, ownerId, location, category } = req.body;
    const newStore = {
        id: 's' + Date.now(),
        storeName,
        ownerId,
        location,
        category,
        approved: false // requires admin approval
    };
    STORES.push(newStore);
    res.status(201).json({ success: true, store: newStore });
});

// Approve store
router.put('/:id/approve', (req, res) => {
    const store = STORES.find(s => s.id === req.params.id);
    if (store) {
        store.approved = true;
        res.json({ success: true, store });
    } else {
        res.status(404).json({ success: false, message: 'Store not found' });
    }
});

// Reject/Delete store
router.put('/:id/reject', (req, res) => {
    const index = STORES.findIndex(s => s.id === req.params.id);
    if (index !== -1) {
        STORES.splice(index, 1);
        res.json({ success: true, message: 'Store rejected' });
    } else {
        res.status(404).json({ success: false, message: 'Store not found' });
    }
});

module.exports = router;
