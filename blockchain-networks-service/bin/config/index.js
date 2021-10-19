const {
  TEST_BSCSCAN_GATEWAY,
  TEST_POLYGONSCAN_GATEWAY,
  TEST_ETHERSCAN_GATEWAY,
  POLYGONSCAN_GATEWAY,
  ETHERSCAN_GATEWAY
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
    },
    authenticityHost: {
      '0x61': TEST_BSCSCAN_GATEWAY,
      '0x5': TEST_ETHERSCAN_GATEWAY,
      '0x89': POLYGONSCAN_GATEWAY,
      '0x13881': TEST_POLYGONSCAN_GATEWAY
    }
  }
};
