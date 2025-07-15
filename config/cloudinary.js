const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'fitness-avatars',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        // Cloudinary will resize the uploaded image so that it does not exceed 300x300 pixels.
        transformation: [{ width: 300, height: 300, crop: 'limit' }],
    }
})

const multerUpload = multer({ storage });

module.exports = { cloudinary, multerUpload };