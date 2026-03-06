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

// Create new offer
router.post('/', (req, res) => {
    const { title, description, discount, originalPrice, storeId, expiryDate, category, isOnline, image } = req.body;
    const newOffer = {
        id: 'o' + Date.now(),
        title,
        description,
        discount,
        originalPrice,
        storeId,
        expiryDate,
        category,
        isOnline: !!isOnline,
        image: image || null
    };
    OFFERS.push(newOffer);
    res.status(201).json({ success: true, offer: newOffer });
});

// Update offer
router.put('/:id', (req, res) => {
    const index = OFFERS.findIndex((o) => o.id === req.params.id);
    if (index !== -1) {
        OFFERS[index] = { ...OFFERS[index], ...req.body };
        res.json({ success: true, offer: OFFERS[index] });
    } else {
        res.status(404).json({ success: false, message: 'Offer not found' });
    }
});

// Delete offer
router.delete('/:id', (req, res) => {
    const index = OFFERS.findIndex((o) => o.id === req.params.id);
    if (index !== -1) {
        OFFERS.splice(index, 1);
        res.json({ success: true, message: 'Offer deleted' });
    } else {
        res.status(404).json({ success: false, message: 'Offer not found' });
    }
});

module.exports = router;
