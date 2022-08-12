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
const { getMongoConnectionStringURI } = require('./shared_backend_code_generated/mongo/mongoUtils');
const mongoConfig = require('./shared_backend_code_generated/config/mongoConfig');
const {
  appSecretManager,
  vaultAppRoleTokenManager
} = require('./vault');

const config = require('./config');

async function main() {
  const connectionString = await getMongoConnectionStringURI({appSecretManager});

  console.log('mongo connection string index', connectionString);

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
      LockedTokens: _mongoose.model('LockedTokens', require('./models/lockedTokens'), 'LockedTokens'),
      Versioning: _mongoose.model('Versioning', require('./models/versioning'), 'Versioning'),
      Task: _mongoose.model('Task', require('./models/task'), 'Task'),
      SyncRestriction: _mongoose.model('SyncRestriction', require('./models/syncRestriction'), 'SyncRestriction'),
      Transaction: _mongoose.model('Transaction', require('./models/transaction.js'), 'Transaction'),
      PastAddress: _mongoose.model('PastAddress', require('./models/pastAddress.js'), 'PastAddress'),
      ResaleTokenOffer: _mongoose.model('ResaleTokenOffer', require('./models/resaleTokenOffer.js'), 'ResaleTokenOffer'),
      CustomRoyaltiesSet: _mongoose.model('CustomRoyaltiesSet', require('./models/customRoyaltiesSet.js'), 'CustomRoyaltiesSet')
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

  // Login with vault app role creds first
  await vaultAppRoleTokenManager.initialLogin();

  // Get app secrets from Vault
  await appSecretManager.getAppSecrets({
    vaultToken: vaultAppRoleTokenManager.getToken(),
    listOfSecretsToFetch: [
      mongoConfig.VAULT_MONGO_x509_SECRET_KEY
    ]
  });

  await main();
})().catch(e => {
  log.error(e);
  process.exit();
});
