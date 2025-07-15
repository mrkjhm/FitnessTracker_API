const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage engine for multer using Cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'fitness-avatars',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [{ width: 300, height: 300, crop: 'limit' }]
    }
});

// Create multer upload instance
const multerUpload = multer({ storage });

module.exports = { cloudinary, multerUpload };
