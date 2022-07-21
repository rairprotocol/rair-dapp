const {
  PRODUCTION,
  GCP_PROJECT_ID,
  GCP_IMAGE_BUCKET_NAME,
  GCP_VIDEO_BUCKET_NAME,
  GCP_CREDENTIALS,
  GCP_GATEWAY,
  PINATA_GATEWAY,
  PINATA_KEY,
  PINATA_SECRET,
  IPFS_GATEWAY,
  IPFS_API,
  IPFS_SERVICE,
  MEDIA_SERVICE_PORT,
  SERVICE_HOST,
  BASE_RAIRNODE_URL,
  SENTRY_DSN,
  LOG_LEVEL,
} = process.env;

module.exports = {
  production: !!(PRODUCTION && PRODUCTION === 'true'),
  logLevel: LOG_LEVEL || 'info',
  port: MEDIA_SERVICE_PORT || 5002,
  serviceHost: SERVICE_HOST,
  rairnode: {
    baseUri: BASE_RAIRNODE_URL,
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
    key: PINATA_KEY,
    secret: PINATA_SECRET,
  },
  ipfs: {
    gateway: IPFS_GATEWAY,
    api: IPFS_API,
  },
  ipfsService: IPFS_SERVICE || 'pinata',
  sentry: {
    dsn: SENTRY_DSN || '',
    serverName: 'media-service',
    logLevels: ['error'],
  },
};
