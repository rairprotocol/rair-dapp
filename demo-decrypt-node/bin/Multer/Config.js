const multer = require('multer');
const path = require('path');
const fs = require('fs');
const log = require('../utils/logger')(module);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = '';

    if (file.fieldname === 'video') {
      uploadPath = path.join(__dirname, '../Videos/');
    }

    if (file.fieldname === 'csv') {
      uploadPath = path.join(__dirname, '../csv/');
    }

    if (!fs.existsSync(uploadPath)) {
      fs.mkdir(uploadPath, (err) => {
        if (err) {
          log.error('Error in folder creation');
          return cb(new Error('Error in folder creation'));
        }
      })
    }

      cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = file.mimetype.slice(file.mimetype.indexOf('/') + 1);
    cb(null, `${ uniqueSuffix }`);
  }
});

const upload = multer({ storage: storage });
module.exports = upload;
