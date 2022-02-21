const port = process.env.PORT || 5001;

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const log = require('./utils/logger')(module);
const morgan = require('morgan');
const _ = require('lodash');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const config = require('./config');

const connectionString = process.env.PRODUCTION === 'true' ? process.env.MONGO_URI : process.env.MONGO_URI_LOCAL;

async function main() {
  const _mongoose = await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
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

  const client = await MongoClient.connect(connectionString, { useNewUrlParser: true });
  const _db = client.db(client.s.options.dbName);

  const context = {
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
      Task: _mongoose.model('Task', require('./models/task'), 'Task'),
      SyncRestriction: _mongoose.model('SyncRestriction', require('./models/syncRestriction'), 'SyncRestriction')
    },
    mongo: _db,
    config
  };

  // run scheduled tasks flow
  context.agenda = await require('./tasks')(context);

  _.forEach(fs.readdirSync(path.join(__dirname, './tasks')), (file) => {
    if (file !== 'index.js' && path.extname(file) === '.js') {
      const pathToTask = `./tasks/${file}`;
      require(pathToTask)(context);
    }
  });

  app.use(morgan('dev'));
  app.use(bodyParser.raw());
  app.use(bodyParser.json());
  app.use('/api/v1', require('./routes/api/v1')(context));
  app.use((err, req, res, next) => {
    log.error(err);
    res.status(500).json({ success: false, error: true, message: err.message });
  });

  app.listen(port, () => {
    log.info(`Blockchain networks service listening at http://localhost:${ port }`);
  });
}

(async () => {
  await main();
})().catch(e => {
  log.error(e);
  process.exit();
});
