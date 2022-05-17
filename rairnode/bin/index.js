const {
  appSecretManager,
  vaultAppRoleTokenManager
} = require('./vault');

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
const session = require('express-session');
const redisStorage = require('connect-redis')(session);
const redis = require('redis');
const log = require('./utils/logger')(module);
const seedDB = require('./seeds');
require('dotenv').config();
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const config = require('./config');
const gcp = require('./integrations/gcp');
const {
  getMongoConnectionStringURI
} = require('./shared_backend_code_generated/mongo/mongoUtils');

const mongoConfig = require('./shared_backend_code_generated/config/mongoConfig');

async function main() {
  const mediaDirectories = ['./bin/Videos', './bin/Videos/Thumbnails'];

  // Create Redis client
  const client = redis.createClient({
    url: `redis://${ config.redis.connection.host }:${ config.redis.connection.port }`,
    legacyMode: true
  });

  client.connect().catch(log.error);

  for (const folder of mediaDirectories) {
    if (!fs.existsSync(folder)) {
      log.info(folder, 'doesn\'t exist, creating it now!');
      fs.mkdirSync(folder);
    }
  }

  const _mongoose = await mongoose.connect(getMongoConnectionStringURI({appSecretManager}), {
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
  let origin = `https://${ process.env.SERVICE_HOST }`;

  app.use(cors({ origin }));

  const hls = await StartHLS();

  // XSS sanitizer
  const window = new JSDOM('').window;
  const textPurify = createDOMPurify(window);

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
      LockedTokens: _mongoose.model('LockedTokens', require('./models/lockedTokens'), 'LockedTokens'),
      Versioning: _mongoose.model('Versioning', require('./models/versioning'), 'Versioning'),
      Blockchain: _mongoose.model('Blockchain', require('./models/blockchain'), 'Blockchain'),
      Category: _mongoose.model('Category', require('./models/category'), 'Category'),
      SyncRestriction: _mongoose.model('SyncRestriction', require('./models/syncRestriction'), 'SyncRestriction'),
      Transaction: _mongoose.model('Transaction', require('./models/transaction'), 'Transaction'),
      TokenMetadata: _mongoose.model('TokenMetadata', require('./models/tokenMetadata'), 'TokenMetadata'),
      MetadataLink: _mongoose.model('MetadataLink', require('./models/metadataLink'), 'MetadataLink'),
    },
    config,
    gcp: gcp(config),
    textPurify,
    redis: {
      client
    }
  };

  // connect redisService
  context.redis.redisService = require('./services/redis')(context);

  await seedDB(context);

  app.use(morgan('dev'));
  app.use(bodyParser.raw());
  app.use(bodyParser.json());
  app.use(
    session({
      store: new redisStorage({
        client,
        ttl: (config.session.ttl * 60 * 60) // default 12 hours
      }),
      secret: config.session.secret,
      saveUninitialized: true,
      resave: false,
      name: 'id',
      cookie: {
        path: '/',
        httpOnly: true,
        // secure: true,
        // maxAge:  (12 * 60 * 60 * 1000)  // 12 hours
      }
    })
  );

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

  // wrapping in a try catch block temporarily to prevent
  // outages during development
  try {
    // Login with vault app role creds first
    await vaultAppRoleTokenManager.initialLogin();

    await appSecretManager.getAppSecrets({
      vaultToken: vaultAppRoleTokenManager.getToken(),
      listOfSecretsToFetch: [
        mongoConfig.VAULT_MONGO_USER_PASS_SECRET_KEY
      ]
    });
  } catch(err) {
    console.log('Error initializing vault integration on app boot')
  }

  // fire up the rest of the app
  await main();

})().catch(e => {
  log.error(e);
  process.exit();
});
