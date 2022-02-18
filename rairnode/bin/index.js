const port = process.env.PORT;

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const StartHLS = require('./hls-starter.js');
const fs = require('fs');
const cors = require('cors');
const mongoose = require('mongoose');
const Socket = require('socket.io');
const morgan = require('morgan');
const _ = require('lodash');
const log = require('./utils/logger')(module);
const seedDB = require('./seeds');
require('dotenv').config();

const config = require('./config');
const gcp = require('./integrations/gcp');

async function main() {
  const mediaDirectories = ['./bin/Videos', './bin/Videos/Thumbnails'];

  for (const folder of mediaDirectories) {
    if (!fs.existsSync(folder)) {
      log.info(folder, 'doesn\'t exist, creating it now!');
      fs.mkdirSync(folder);
    }
  }

  const _mongoose = await mongoose.connect(process.env.PRODUCTION === 'true' ? process.env.MONGO_URI : process.env.MONGO_URI_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then((c) => {
      if (process.env.PRODUCTION === 'true') {
        log.info('DB Connected!');
      } else {
        log.info('Development DB Connected!');
      }
      return c;
    })
    .catch((e) => {
      log.error('DB Not Connected!');
      log.error(`Reason: ${ e.message }`);
    });

  mongoose.set('useFindAndModify', false);

  const app = express();

  /* CORS */
  app.use(cors());

  const hls = await StartHLS();

  const context = {
    hls,
    db: {
      Contract: _mongoose.model('Contract', require('./models/contract'), 'Contract'),
      File: _mongoose.model('File', require('./models/file'), 'File'),
      User: _mongoose.model('User', require('./models/user'), 'User'),
      Product: _mongoose.model('Product', require('./models/product'), 'Product'),
      OfferPool: _mongoose.model('OfferPool', require('./models/offerPool'), 'OfferPool'),
      Offer: _mongoose.model('Offer', require('./models/offer'), 'Offer'),
      MintedToken: _mongoose.model('MintedToken', require('./models/mintedToken'), 'MintedToken'),
      LockedTokens: _mongoose.model('LockedTokens', require('./models/lockedTokes'), 'LockedTokens'),
      Versioning: _mongoose.model('Versioning', require('./models/versioning'), 'Versioning'),
      Blockchain: _mongoose.model('Blockchain', require('./models/blockchain'), 'Blockchain'),
      Category: _mongoose.model('Category', require('./models/category'), 'Category')
    },
    config,
    gcp: gcp(config)
  };

  await seedDB(context);

  app.use(morgan('dev'));
  app.use(bodyParser.raw());
  app.use(bodyParser.json());
  app.use('/thumbnails', express.static(path.join(__dirname, 'Videos/Thumbnails')));
  app.use('/stream', require('./routes/stream')(context));
  app.use('/api', require('./routes')(context));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use((err, req, res, next) => {
    log.error(err);
    res.status(500).json({ success: false, error: true, message: err.message });
  });

  const server = app.listen(port, () => {
    log.info(`Decrypt node service listening at http://localhost:${ port }`);
  });

  const io = Socket(server);
  const sockets = {};

  io.on('connection', socket => {
    log.info(`Client connected: ${ socket.id }`);
    socket.on('init', sessionId => {

      log.info(`Opened connection: ${ sessionId }`);

      sockets[sessionId] = socket.id;
      app.set('sockets', sockets);
    });

    socket.on('end', sessionId => {
      delete sockets[sessionId];

      socket.disconnect(0);
      app.set('sockets', sockets);

      log.info(`Close connection ${ sessionId }`);
    });
  });

  app.set('io', io);
}

(async () => {
  await main();
})().catch(e => {
  log.error(e);
  process.exit();
});
