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

module.exports = router;
