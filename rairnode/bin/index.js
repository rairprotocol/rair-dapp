require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const Socket = require('socket.io');
const morgan = require('morgan');
const session = require('express-session');
const RedisStorage = require('connect-redis')(session);
const redis = require('redis');
const seedDB = require('./seeds');
const log = require('./utils/logger')(module);
const StartHLS = require('./hls-starter');
const models = require('./models');
const redisService = require('./services/redis');
const streamRoute = require('./routes/stream');
const apiV1Routes = require('./routes');
const mainErrorHandler = require('./utils/errors/mainErrorHandler');
const { textPurify } = require('./utils/helpers');

const { appSecretManager, vaultAppRoleTokenManager } = require('./vault');

const config = require('./config');
const gcp = require('./integrations/gcp');

const { mongoConnectionManager } = require('./mongooseConnect');

const mongoConfig = require('./shared_backend_code_generated/config/mongoConfig');

async function main() {
  const mediaDirectories = ['./bin/Videos', './bin/Videos/Thumbnails', './bin/banners'];

  // Create Redis client
  const client = redis.createClient({
    url: `redis://${config.redis.connection.host}:${config.redis.connection.port}`,
    legacyMode: true,
  });

  client.connect().catch(log.error);

  mediaDirectories.forEach((folder) => {
    if (!fs.existsSync(folder)) {
      log.info(folder, "doesn't exist, creating it now!");
      fs.mkdirSync(folder);
    }
  });

  await mongoConnectionManager.getMongooseConnection({});

  const app = express();

  /* CORS */
  const origin = `https://${process.env.SERVICE_HOST}`;

  app.use(cors({ origin }));

  const hls = await StartHLS();

  const context = {
    hls,
    db: models,
    config,
    gcp: gcp(config),
    textPurify,
    redis: {
      client,
    },
  };

  // connect redisService
  context.redis.redisService = redisService(context);

  await seedDB(context);

  app.use(morgan('dev'));
  app.use(bodyParser.raw());
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(cookieParser());
  app.set('trust proxy', 1);
  app.use(
    session({
      store: new RedisStorage({
        client,
        // config.session.ttl was removed from here and used
        //    for maxAge, because when maxAge used it will have no effect.
      }),
      secret: config.session.secret,
      saveUninitialized: true,
      resave: true,
      proxy: config.production,
      rolling: true,
      cookie: {
        sameSite: config.production ? 'none' : 'lax',
        path: '/',
        httpOnly: config.production,
        secure: config.production,
        maxAge: (`${config.session.ttl}` * 60 * 60 * 1000), // TTL * hour
      },
    }),
  );
  app.use(
    '/thumbnails',
    express.static(path.join(__dirname, 'Videos/Thumbnails')),
  );
  app.use('/stream', streamRoute(context));
  app.use('/api', (req, res, next) => {
    req.redisService = context.redis.redisService;
    return next();
  }, apiV1Routes(context));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(mainErrorHandler);

  const server = app.listen(config.port, () => {
    log.info(`Rairnode server listening at http://localhost:${config.port}`);
  });

  const io = Socket(server);
  const sockets = {};

  io.on('connection', (socket) => {
    log.info(`Client connected: ${socket.id}`);
    socket.on('init', (sessionId) => {
      log.info(`Opened connection: ${sessionId}`);

      sockets[sessionId] = socket.id;
      app.set('sockets', sockets);
    });

    socket.on('end', (sessionId) => {
      delete sockets[sessionId];

      socket.disconnect(0);
      app.set('sockets', sockets);

      log.info(`Close connection ${sessionId}`);
    });
  });

  app.set('io', io);
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

  // fire up the rest of the app
  await main();
})().catch((e) => {
  log.error(e);
  process.exit();
});
