// uploadMiddleware.js
const uuidv4 = require('uuid')
const multer = require('multer');
const path = require('path')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },

  // By default, multer removes file extensions so let's add them back
  filename: function (req, file, cb) {
    const originalname = file.originalname;
    const extension = path.extname(originalname);
    const uniqueSuffix = uuidv4.v4(); 
    cb(null, 'uploads-' + uniqueSuffix + extension);
  }
});
const imageFilter = function (req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = 'Only image files are allowed!';
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};
module.exports = { storage, imageFilter }