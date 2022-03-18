const multer = require('multer');
const path = require('path');
const fs = require('fs');
const log = require('../utils/logger')(module);
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('1234567890', 10)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = '';
    const uniqueSuffix = `${Date.now()}-${nanoid()}`;

    if (file.fieldname === 'video') {
      uploadPath = path.join(__dirname, '../Videos/', uniqueSuffix);
    }

    if (file.fieldname === 'csv') {
      uploadPath = path.join(__dirname, '../csv/');
    }

    if (file.fieldname === 'file' || file.fieldname === 'files') {
      uploadPath = path.join(__dirname, '../file/');
    }

    if (!fs.existsSync(uploadPath)) {
      try {
        fs.mkdirSync(uploadPath);
      } catch (err) {
        log.error(err);
        log.error(err.stack);
        log.error('Error in folder creation');
        return cb(new Error('Error in folder creation'));
      }
    }

    file.destinationFolder = uniqueSuffix;
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const [type, extension] = file.mimetype.split('/');
    if (extension === 'csv') {
      const uniqueSuffix = `${Date.now()}-${nanoid()}`;
      cb(null, `${ uniqueSuffix }`);
    } else if (['image'].includes(type)) {
      const uniqueSuffix = `${Date.now()}-${nanoid()}`;
      cb(null, `${ uniqueSuffix }.${ extension }`);
    } else if (['video', 'audio'].includes(type)) {
      file.type = type;
      file.extension = extension;
      cb(null, `rawfile.${ extension }`);
    }
  }
});

const upload = multer({ storage: storage });
module.exports = upload;
