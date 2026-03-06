const express = require('express');
const router = express.Router();
const { OFFERS } = require('../data/mockData');

// Get all offers
router.get('/', (req, res) => {
    const { category, search } = req.query;
    let filtered = OFFERS;

    if (category && category !== 'All') {
        filtered = filtered.filter((o) => o.category === category);
    }

    if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
            (o) =>
                o.title.toLowerCase().includes(q) ||
                o.description.toLowerCase().includes(q)
        );
    }

    res.json(filtered);
});

// Get single offer
router.get('/:id', (req, res) => {
    const offer = OFFERS.find((o) => o.id === req.params.id);
    if (offer) {
        res.json(offer);
    } else {
        res.status(404).json({ message: 'Offer not found' });
    }
});

module.exports = router;
