const multer = require('multer');
const path = require('path');
const fs = require('fs');
const log = require('../utils/logger')(module);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = '';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

    if (file.fieldname === 'video') {
      uploadPath = path.join(__dirname, '../Videos/', uniqueSuffix);
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

    file.destinationFolder = uniqueSuffix;
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const [type, extension] = file.mimetype.split('/');
    if (extension === 'csv') {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `${ uniqueSuffix }`);
    } else if (['video','audio'].includes(type)) {
      file.type = type;
      file.extension = extension;
      cb(null, `rawfile.${extension}`);
    }
  }
});

const upload = multer({ storage: storage });
module.exports = upload;
