const multer = require('multer');
const path = require('path');

// Local filesystem storage (for development)
const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

// Configure upload middleware
const upload = multer({
  storage: localStorage, // Using local storage by default
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Cloudinary storage (uncomment when ready to use)
/*
const { cloudinary } = require('../utils/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    return {
      folder: 'blog-uploads',
      allowed_formats: ['jpg', 'jpeg', 'png'],
      transformation: [{ width: 1200, crop: 'scale' }],
      public_id: file.fieldname + '-' + Date.now()
    };
  }
});

// Switch to cloudinary storage when in production
if (process.env.NODE_ENV === 'production') {
  upload.storage = cloudinaryStorage;
}
*/

module.exports = upload;