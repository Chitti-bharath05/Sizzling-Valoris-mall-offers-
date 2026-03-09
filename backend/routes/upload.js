const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinaryConfig');
const { protect } = require('../middleware/authMiddleware');

// POST /api/upload
// Upload single image
router.post('/', protect, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        console.log(`File uploaded successfully: ${req.file.path}`);
        
        res.json({
            success: true,
            imageUrl: req.file.path, // Cloudinary URL
            publicId: req.file.filename
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
    }
});

module.exports = router;
