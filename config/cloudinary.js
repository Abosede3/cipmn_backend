// config/cloudinary.js

const cloudinary = require('cloudinary').v2;

const dotenv = require('dotenv');
dotenv.config();

console.log('Cloudinary config:', process.env.CLOUDINARY_CLOUD_NAME);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;