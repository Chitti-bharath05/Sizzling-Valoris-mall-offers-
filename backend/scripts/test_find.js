const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Offer = require('../models/Offer');
const Store = require('../models/Store');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function testFind() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected, fetching offers...');
        const offers = await Offer.find({}).populate('storeId', 'storeName location');
        console.log('Found offers length:', offers.length);
        console.log(offers[0]);
    } catch (e) {
        console.error('ERROR:', e);
    } finally {
        process.exit();
    }
}
testFind();
