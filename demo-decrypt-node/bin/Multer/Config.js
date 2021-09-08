const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'video') {
      cb(null, (path.join(__dirname, '../Videos/')));
    }

    if (file.fieldname === 'csv') {
      cb(null, (path.join(__dirname, '../csv/')));
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = file.mimetype.slice(file.mimetype.indexOf('/') + 1);
    cb(null, `${ uniqueSuffix }`);
  }
});

const upload = multer({ storage: storage });
module.exports = upload;
