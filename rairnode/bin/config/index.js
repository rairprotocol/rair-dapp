const {
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
  SESSION_TTL
} = process.env;

const binanceTestnetData = {
  name: 'Binance Testnet',
  blockchainId: '0x61',
  testnet: true,
  rpc: process.env.BINANCE_TESTNET_RPC,
};
const binanceMainnetData = {
  name: 'Binance Mainnet',
  blockchainId: '0x38',
  testnet: false,
  rpc: process.env.BINANCE_MAINNET_RPC,
};
const ethereumMainnetData = {
  name: 'Ethereum Mainnet',
  blockchainId: '0x1',
  testnet: false,
  rpc: process.env.ETHEREUM_MAINNET_RPC,
};
const ethereumGoerliData = {
  name: 'Ethereum Goerli',
  blockchainId: '0x5',
  testnet: true,
  rpc: process.env.ETHEREUM_TESTNET_GOERLI_RPC,
};
const polygonMainnetData = {
  name: 'Polygon Mainnet',
  blockchainId: '0x89',
  testnet: false,
  rpc: process.env.MATIC_MAINNET_RPC,
};
const polygonTestnetData = {
  name: 'Polygon Testnet',
  blockchainId: '0x13881',
  testnet: true,
  rpc: process.env.MATIC_TESTNET_RPC,
};

module.exports = {
  blockchain: {
    networks: {
      '0x13881': polygonTestnetData,
      mumbai: polygonTestnetData,

      '0x89': polygonMainnetData,
      matic: polygonMainnetData,

      '0x38': binanceMainnetData,
      'binance-mainnet': binanceMainnetData,

      '0x61': binanceTestnetData,
      'binance-testnet': binanceTestnetData,

      '0x1': ethereumMainnetData,
      ethereum: ethereumMainnetData,

      '0x5': ethereumGoerliData,
      goerli: ethereumGoerliData,
    },
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
    connection: { host: REDIS_HOST, port: REDIS_PORT }
  },
  session: {
    secret: SESSION_SECRET,
    ttl: SESSION_TTL || 12,
  },
};
