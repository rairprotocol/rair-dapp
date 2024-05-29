const port = process.env.PORT || 5001;
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const morgan = require('morgan');
const _ = require('lodash');
const { MongoClient } = require('mongodb');
const log = require('./utils/logger')(module);
require('dotenv').config();
const { getMongoConnectionStringURI } = require('./shared_backend_code_generated/mongo/mongoUtils');
const mongoConfig = require('./shared_backend_code_generated/config/mongoConfig');
const {
  appSecretManager,
  vaultAppRoleTokenManager,
} = require('./vault');

const tasks = require('./tasks');
const routes = require('./routes/api/v1');

const config = require('./config');
const { redisClient } = require('./services/redis');

async function main() {
  const connectionString = await getMongoConnectionStringURI({ appSecretManager });
  // log.info(`Mongo Connection: ${connectionString}`);

  await mongoose.connect(
    connectionString,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
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
      log.error(`Reason: ${e.message}`);
    });

  const app = express();

  const client = await MongoClient.connect(connectionString, { useNewUrlParser: true });
  const _db = client.db(client.s.options.dbName);

  await redisClient.connect().catch(log.error);

  const context = {
    mongo: _db,
    config,
    redis: {
      redisService: redisClient,
    },
  };

  // run scheduled tasks flow
  context.agenda = await tasks(context);

  _.forEach(fs.readdirSync(path.join(__dirname, './tasks')), (file) => {
    if (file !== 'index.js' && path.extname(file) === '.js') {
      const pathToTask = `./tasks/${file}`;
      // eslint-disable-next-line import/no-dynamic-require, global-require
      require(pathToTask)(context);
    }
  });

  app.use(morgan('dev'));
  app.use(bodyParser.raw());
  app.use(bodyParser.json());
  app.use('/api/v1', routes(context));
  app.use((err, req, res, next) => {
    log.error(err);
    res.status(500).json({ success: false, error: true, message: err.message });
  });

  app.listen(port, () => {
    log.info(`Blockchain networks service listening on port ${port}`);
  });
}

(async () => {
  // Login with vault app role creds first
  await vaultAppRoleTokenManager.initialLogin();

  // Get app secrets from Vault
  await appSecretManager.getAppSecrets({
    vaultToken: vaultAppRoleTokenManager.getToken(),
    listOfSecretsToFetch: [
      mongoConfig.VAULT_MONGO_x509_SECRET_KEY,
    ],
  });

  await main();
})().catch((e) => {
  log.error(e);
  process.exit();
});
