const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dcgpkfmsn',
  api_key: process.env.CLOUDINARY_API_KEY || '573541266587715',
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;
