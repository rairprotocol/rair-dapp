const {
  GCP_PROJECT_ID,
  GCP_IMAGE_BUCKET_NAME,
  GCP_VIDEO_BUCKET_NAME,
  GCP_CREDENTIALS,
  GCP_GATEWAY,
  PINATA_GATEWAY,
  IPFS_GATEWAY,
  IPFS_SERVICE
} = process.env;

module.exports = {
  blockchain: {
    networks: {
      '0x61': 'Binance Testnet',
      '0x38': 'Binance Mainnet',
      '0x1': 'Ethereum Mainnet',
      '0x5': 'Ethereum Goerli',
      '0x89': 'Matic Mainnet',
      '0x13881': 'Matic Mumbai'
    }
  },
  gcp: {
    projectId: GCP_PROJECT_ID,
    imageBucketName: GCP_IMAGE_BUCKET_NAME,
    videoBucketName: GCP_VIDEO_BUCKET_NAME,
    credentials: GCP_CREDENTIALS,
    gateway: GCP_GATEWAY
  },
  pinata: {
    gateway: PINATA_GATEWAY
  },
  ipfs: {
    gateway: IPFS_GATEWAY
  },
  ipfsService: IPFS_SERVICE || 'pinata'
};
