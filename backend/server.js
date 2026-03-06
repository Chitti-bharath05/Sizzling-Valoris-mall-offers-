const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Mall & Online Offers Aggregator API' });
});

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'up', timestamp: new Date() });
});

// Demo Data Endpoint (Mock)
app.get('/api/offers', (req, res) => {
    res.json([
        { id: '1', title: 'Grand Opening Sale', discount: '50%', store: 'Fashion Hub' },
        { id: '2', title: 'Tech Weekend', discount: '20%', store: 'Gadget World' }
    ]);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
