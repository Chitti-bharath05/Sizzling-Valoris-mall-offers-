const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Store = require('../models/Store');
const Offer = require('../models/Offer');
const Order = require('../models/Order');
const { USERS, STORES, OFFERS, CATEGORIES } = require('../data/mockData');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedDatabase = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        console.log('Clearing existing data...');
        await User.deleteMany();
        await Store.deleteMany();
        await Offer.deleteMany();
        await Order.deleteMany();

        console.log('Inserting Users...');
        // Need to map original string IDs to MongoDB ObjectIds for relations
        const userMap = {};
        for (const u of USERS) {
            const newUser = await User.create({
                name: u.name,
                email: u.email,
                password: u.password,
                role: u.role
            });
            userMap[u.id] = newUser._id;
        }

        console.log('Inserting Stores...');
        const storeMap = {};
        for (const s of STORES) {
            const newStore = await Store.create({
                storeName: s.storeName,
                ownerId: userMap[s.ownerId],
                location: s.location,
                approved: s.approved,
                category: s.category
            });
            storeMap[s.id] = newStore._id;
        }

        console.log('Inserting Offers...');
        const offerMap = {};
        for (const o of OFFERS) {
            const newOffer = await Offer.create({
                title: o.title,
                description: o.description,
                discount: o.discount,
                storeId: storeMap[o.storeId],
                expiryDate: new Date(o.expiryDate),
                image: o.image,
                category: o.category,
                originalPrice: o.originalPrice,
                isOnline: o.isOnline
            });
            offerMap[o.id] = newOffer._id;
        }

        console.log('Database seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
