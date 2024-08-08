const {
  PORT,
  PRODUCTION,
  GCP_PROJECT_ID,
  GCP_IMAGE_BUCKET_NAME,
  GCP_VIDEO_BUCKET_NAME,
  GCP_CREDENTIALS,
  GCP_GATEWAY,
  PINATA_GATEWAY,
  IPFS_GATEWAY,
  IPFS_SERVICE,
  REDIS_HOST,
  REDIS_PORT,
  SESSION_SECRET,
  SESSION_TTL,
  SENTRY_DSN,
  LOG_LEVEL,
  ADMIN_NETWORK,
  ADMIN_CONTRACT,
  SUPER_ADMIN_VAULT_STORE,
  ZOOMSECRET,
  ZOOMCLIENTID,
  ALCHEMY_API_KEY,
} = process.env;
const { Network } = require('alchemy-sdk');

module.exports = {
  production: !!(PRODUCTION && PRODUCTION === 'true'),
  port: PORT || 5000,
  logLevel: LOG_LEVEL || 'info',
  admin: {
    network: ADMIN_NETWORK,
    contract: ADMIN_CONTRACT,
  },
  zoom: {
    zoomSecret: ZOOMSECRET,
    zoomClientID: ZOOMCLIENTID,
  },
  superAdmin: {
    storageKey: SUPER_ADMIN_VAULT_STORE || null,
  },
  gcp: {
    projectId: GCP_PROJECT_ID,
    imageBucketName: GCP_IMAGE_BUCKET_NAME,
    videoBucketName: GCP_VIDEO_BUCKET_NAME,
    credentials: GCP_CREDENTIALS,
    gateway: GCP_GATEWAY,
  },
  pinata: {
    gateway: PINATA_GATEWAY,
  },
  ipfs: {
    gateway: IPFS_GATEWAY,
  },
  ipfsService: IPFS_SERVICE || 'pinata',
  redis: {
    connection: { host: REDIS_HOST, port: REDIS_PORT },
  },
  session: {
    secret: SESSION_SECRET,
    ttl: SESSION_TTL || 10,
  },
  sentry: {
    dsn: SENTRY_DSN || '',
    serverName: 'rairnode',
    logLevels: ['error'],
  },
  alchemy: {
    apiKey: ALCHEMY_API_KEY,
    networkMapping: {
      '0x1': Network.ETH_MAINNET,
      '0xaa36a7': Network.ETH_SEPOLIA,
      '0x89': Network.MATIC_MAINNET,
      '0x13881': Network.MATIC_MUMBAI,
      '0x250': Network.ASTAR_MAINNET,
      '0x2105': Network.BASE_MAINNET,
    },
  },
  ipfsGateways: {
    filebase: 'https://rair.myfilebase.com/ipfs/',
    pinata: 'https://ipfs.io/ipfs/',
    ipfs: 'https://ipfs.io/ipfs/',
  },
};
