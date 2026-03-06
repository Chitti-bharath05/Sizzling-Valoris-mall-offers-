const express = require('express');
const router = express.Router();
const { OFFERS } = require('../data/mockData');

// Get all offers
router.get('/', (req, res) => {
    const { category, search } = req.query;
    let filteredOffers = OFFERS || [];

    if (category && category !== 'All') {
        filteredOffers = filteredOffers.filter((o) => o.category === category);
    }

    if (search) {
        const q = search.toLowerCase();
        filteredOffers = filteredOffers.filter(
            (o) =>
                o.title.toLowerCase().includes(q) ||
                o.description.toLowerCase().includes(q)
        );
    }

    res.json(filteredOffers);
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
