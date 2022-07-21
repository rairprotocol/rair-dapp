const {
  PRODUCTION,
  TEST_BSCSCAN_GATEWAY,
  TEST_POLYGONSCAN_GATEWAY,
  TEST_ETHERSCAN_GATEWAY,
  BSCSCAN_GATEWAY,
  POLYGONSCAN_GATEWAY,
  ETHERSCAN_GATEWAY,
  BINANCE_TESTNET_FACTORY_ADDRESS,
  BINANCE_TESTNET_MINTER_ADDRESS,
  BINANCE_MAINNET_FACTORY_ADDRESS,
  BINANCE_MAINNET_MINTER_ADDRESS,
  GOERLI_FACTORY_ADDRESS,
  GOERLI_MINTER_ADDRESS,
  MATIC_MUMBAI_FACTORY_ADDRESS,
  MATIC_MUMBAI_MINTER_ADDRESS,
  MATIC_MAINNET_FACTORY_ADDRESS,
  MATIC_MAINNET_MINTER_ADDRESS,
  ETHEREUM_MAINNET_FACTORY_ADDRESS,
  ETHEREUM_MAINNET_MINTER_ADDRESS,
  BINANCE_TESTNET_DIAMOND_FACTORY_ADDRESS,
  BINANCE_TESTNET_DIAMOND_MARKETPLACE_ADDRESS,
  BINANCE_MAINNET_DIAMOND_FACTORY_ADDRESS,
  BINANCE_MAINNET_DIAMOND_MARKETPLACE_ADDRESS,
  ETHEREUM_DIAMOND_FACTORY_ADDRESS,
  ETHEREUM_DIAMOND_MARKETPLACE_ADDRESS,
  GOERLI_DIAMOND_FACTORY_ADDRESS,
  GOERLI_DIAMOND_MARKETPLACE_ADDRESS,
  MATIC_MAINNET_DIAMOND_FACTORY_ADDRESS,
  MATIC_MAINNET_DIAMOND_MARKETPLACE_ADDRESS,
  MATIC_MUMBAI_DIAMOND_FACTORY_ADDRESS,
  MATIC_MUMBAI_DIAMOND_MARKETPLACE_ADDRESS,
  MORALIS_SERVER_TEST,
  MORALIS_SERVER_MAIN,
  MORALIS_API_KEY_TEST,
  MORALIS_API_KEY_MAIN,
  MORALIS_MASTER_KEY_TEST,
  MORALIS_MASTER_KEY_MAIN,
  SENTRY_DSN,
  LOG_LEVEL
} = process.env;

module.exports = {
  production: !!(PRODUCTION && PRODUCTION === 'true'),
  logLevel: LOG_LEVEL || 'info',
  blockchain: {
    networks: {
      '0x13881': {
        authenticityHost: TEST_POLYGONSCAN_GATEWAY,
        factoryAddress: MATIC_MUMBAI_FACTORY_ADDRESS,
        minterAddress: MATIC_MUMBAI_MINTER_ADDRESS,
        diamondFactoryAddress: MATIC_MUMBAI_DIAMOND_FACTORY_ADDRESS,
        diamondMarketplaceAddress: MATIC_MUMBAI_DIAMOND_MARKETPLACE_ADDRESS,
        chainId: 80001,
        symbol: 'tMATIC',
        watchFunction: 'watchPolygonAddress',
        watchCollection: 'watchedPolygonAddress',
        network: '0x13881',
        name: 'Matic Mumbai Testnet',
        testnet: true
      },
      '0x38': {
        authenticityHost: BSCSCAN_GATEWAY,
        factoryAddress: BINANCE_MAINNET_FACTORY_ADDRESS,
        minterAddress: BINANCE_MAINNET_MINTER_ADDRESS,
        diamondFactoryAddress: BINANCE_MAINNET_DIAMOND_FACTORY_ADDRESS,
        diamondMarketplaceAddress: BINANCE_MAINNET_DIAMOND_MARKETPLACE_ADDRESS,
        chainId: 56,
        symbol: 'BNB',
        watchFunction: 'watchBscAddress',
        watchCollection: 'watchedBscAddress',
        network: '0x38',
        name: 'Binance Mainnet',
        testnet: false
      },
      '0x61': {
        authenticityHost: TEST_BSCSCAN_GATEWAY,
        factoryAddress: BINANCE_TESTNET_FACTORY_ADDRESS,
        minterAddress: BINANCE_TESTNET_MINTER_ADDRESS,
        diamondFactoryAddress: BINANCE_TESTNET_DIAMOND_FACTORY_ADDRESS,
        diamondMarketplaceAddress: BINANCE_TESTNET_DIAMOND_MARKETPLACE_ADDRESS,
        chainId: 97,
        symbol: 'TBNB',
        watchFunction: 'watchBscAddress',
        watchCollection: 'watchedBscAddress',
        network: '0x61',
        name: 'Binance Testnet',
        testnet: true
      },
      '0x1': {
        authenticityHost: ETHERSCAN_GATEWAY,
        factoryAddress: ETHEREUM_MAINNET_FACTORY_ADDRESS,
        minterAddress: ETHEREUM_MAINNET_MINTER_ADDRESS,
        diamondFactoryAddress: ETHEREUM_DIAMOND_FACTORY_ADDRESS,
        diamondMarketplaceAddress: ETHEREUM_DIAMOND_MARKETPLACE_ADDRESS,
        chainId: 1,
        symbol: 'ETH',
        watchFunction: 'watchEthAddress',
        watchCollection: 'watchedEthAddress',
        network: '0x1',
        name: 'Ethereum Mainnet',
        testnet: false
      },
      '0x5': {
        authenticityHost: TEST_ETHERSCAN_GATEWAY,
        factoryAddress: GOERLI_FACTORY_ADDRESS,
        minterAddress: GOERLI_MINTER_ADDRESS,
        diamondFactoryAddress: GOERLI_DIAMOND_FACTORY_ADDRESS,
        diamondMarketplaceAddress: GOERLI_DIAMOND_MARKETPLACE_ADDRESS,
        chainId: 5,
        symbol: 'ETH',
        watchFunction: 'watchEthAddress',
        watchCollection: 'watchedEthAddress',
        network: '0x5',
        name: 'Goerli Testnet',
        testnet: true
      },
      '0x89': {
        authenticityHost: POLYGONSCAN_GATEWAY,
        factoryAddress: MATIC_MAINNET_FACTORY_ADDRESS,
        minterAddress: MATIC_MAINNET_MINTER_ADDRESS,
        diamondFactoryAddress: MATIC_MAINNET_DIAMOND_FACTORY_ADDRESS,
        diamondMarketplaceAddress: MATIC_MAINNET_DIAMOND_MARKETPLACE_ADDRESS,
        chainId: 137,
        symbol: 'MATIC',
        watchFunction: 'watchPolygonAddress',
        watchCollection: 'watchedPolygonAddress',
        network: '0x89',
        name: 'Matic Mainnet',
        testnet: false
      }
    },
    moralis: {
      mainnet: {
        serverUrl: MORALIS_SERVER_MAIN,
        appId: MORALIS_API_KEY_MAIN,
        masterKey: MORALIS_MASTER_KEY_MAIN
      },
      testnet: {
        serverUrl: MORALIS_SERVER_TEST,
        appId: MORALIS_API_KEY_TEST,
        masterKey: MORALIS_MASTER_KEY_TEST
      }
    }
  },
  sentry: {
    dsn: SENTRY_DSN || '',
    serverName: 'blockchain-service',
    logLevels: ['error'],
  },
};

