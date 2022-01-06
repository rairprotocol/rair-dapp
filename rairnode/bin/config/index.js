const {
  GCP_PROJECT_ID,
  GCP_BUCKET_NAME,
  GCP_CREDENTIALS
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
    bucketName: GCP_BUCKET_NAME,
    credentials: GCP_CREDENTIALS
  }
};
