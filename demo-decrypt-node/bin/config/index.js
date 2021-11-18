const {
  REDIS_HOST,
  REDIS_PORT
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
  redis: {
    connection: { host: REDIS_HOST, port: REDIS_PORT }
  }
}
