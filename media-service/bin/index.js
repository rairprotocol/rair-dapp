require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Socket = require('socket.io');
const morgan = require('morgan');
const fs = require('fs');
const log = require('./utils/logger')(module);
const apiRoutes = require('./routes');
const errorHandler = require('./utils/errors/mainErrorHandler');
const config = require('./config');

const { port, serviceHost } = config;

const { appSecretManager, vaultAppRoleTokenManager } = require('./vault');

async function main() {
  const mediaDirectories = ['./bin/Videos', './bin/Videos/Thumbnails'];

  mediaDirectories.forEach((folder) => {
    if (!fs.existsSync(folder)) {
      log.info(folder, 'doesn\'t exist, creating it now!');
      fs.mkdirSync(folder);
    }
  });

  const app = express();
  /* CORS */
  const origin = `https://${serviceHost}`;
  const allowedHeaders = ['abcd'];
  const credentials = true;
  const methods = ['GET', 'POST'];
  app.use(cors(origin, /* allowedHeaders, credentials, methods */));

  app.use(morgan('dev'));
  app.use(bodyParser.raw());
  app.use(bodyParser.json());

  app.use('/ms/api', apiRoutes());
  app.use(errorHandler);

  const server = app.listen(port, () => {
    log.info(`Media service listening at http://media-service:${port}`);
  });
  app.get('/', (req, res) => {
    res.send('OK');
  });
  app.get('/health-check', (req, res) => {
    res.send('Health check passed');
  });
  app.get('/bad-health', (req, res) => {
    res.send('Health check did not pass');
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
    listOfSecretsToFetch: [],
  });

  // fire up the rest of the app
  await main();
})()
  .catch((e) => {
    log.error(e);
    process.exit();
  });
