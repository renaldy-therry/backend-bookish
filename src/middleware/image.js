const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'bookish',
    format: async (req, file) => 'png',
  },
});

const parser = multer({ storage: storage });

exports.uploadFile = parser.single('file');
