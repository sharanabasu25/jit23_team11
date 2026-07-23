const multer = require('multer');
const path = require('path');

// Configure disk storage details
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    // Generate unique filename using timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure file filter to only accept image mime-types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const mimeType = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimeType && extname) {
    return cb(null, true);
  }
  cb(new Error('Only image files (.jpeg, .jpg, .png) are permitted.'));
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limit size to 5MB
  },
  fileFilter
});

module.exports = upload;
