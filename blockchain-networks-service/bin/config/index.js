const {
  PRODUCTION,
  // Ethereum Mainnet
  ETHERSCAN_GATEWAY,
  ETHEREUM_MAINNET_FACTORY_ADDRESS,
  ETHEREUM_MAINNET_MINTER_ADDRESS,
  ETHEREUM_DIAMOND_FACTORY_ADDRESS,
  ETHEREUM_DIAMOND_MARKETPLACE_ADDRESS,

  // Ethereum Sepolia
  TEST_ETHERSCAN_GATEWAY,
  SEPOLIA_FACTORY_ADDRESS,
  SEPOLIA_MINTER_ADDRESS,
  SEPOLIA_DIAMOND_FACTORY_ADDRESS,
  SEPOLIA_DIAMOND_MARKETPLACE_ADDRESS,

  // Polygon Mainnet
  POLYGONSCAN_GATEWAY,
  MATIC_MAINNET_FACTORY_ADDRESS,
  MATIC_MAINNET_MINTER_ADDRESS,
  MATIC_MAINNET_DIAMOND_FACTORY_ADDRESS,
  MATIC_MAINNET_DIAMOND_MARKETPLACE_ADDRESS,

  // Polygon Mumbai
  TEST_POLYGONSCAN_GATEWAY,
  MATIC_MUMBAI_FACTORY_ADDRESS,
  MATIC_MUMBAI_MINTER_ADDRESS,
  MATIC_MUMBAI_DIAMOND_FACTORY_ADDRESS,
  MATIC_MUMBAI_DIAMOND_MARKETPLACE_ADDRESS,

  // Astar Mainnet
  ASTAR_MAINNET_GATEWAY,
  ASTAR_MAINNET_DIAMOND_FACTORY_ADDRESS,
  ASTAR_MAINNET_DIAMOND_MARKETPLACE_ADDRESS,

  // Base Mainnet
  BASE_GATEWAY,
  BASE_DIAMOND_FACTORY_ADDRESS,
  BASE_DIAMOND_MARKETPLACE_ADDRESS,

  SENTRY_DSN,
  BASE_RAIRNODE_URL,
  LOG_LEVEL,
  REDIS_HOST,
  REDIS_PORT,
} = process.env;

module.exports = {
  production: !!(PRODUCTION && PRODUCTION === 'true'),
  logLevel: LOG_LEVEL || 'info',
  blockchain: {
    networks: {
      '0x2105': {
        authenticityHost: BASE_GATEWAY,
        factoryAddress: undefined,
        minterAddress: undefined,
        diamondFactoryAddress: BASE_DIAMOND_FACTORY_ADDRESS,
        diamondMarketplaceAddress: BASE_DIAMOND_MARKETPLACE_ADDRESS,
        chainId: 8453,
        symbol: 'BASE',
        network: '0x2105',
        name: 'Base Mainnet',
        testnet: false,
      },
      '0x250': {
        authenticityHost: ASTAR_MAINNET_GATEWAY,
        factoryAddress: undefined,
        minterAddress: undefined,
        diamondFactoryAddress: ASTAR_MAINNET_DIAMOND_FACTORY_ADDRESS,
        diamondMarketplaceAddress: ASTAR_MAINNET_DIAMOND_MARKETPLACE_ADDRESS,
        chainId: 592,
        symbol: 'ASTR',
        network: '0x250',
        name: 'Astar Mainnet',
        testnet: false,
      },
      '0x13881': {
        authenticityHost: TEST_POLYGONSCAN_GATEWAY,
        factoryAddress: MATIC_MUMBAI_FACTORY_ADDRESS,
        minterAddress: MATIC_MUMBAI_MINTER_ADDRESS,
        diamondFactoryAddress: MATIC_MUMBAI_DIAMOND_FACTORY_ADDRESS,
        diamondMarketplaceAddress: MATIC_MUMBAI_DIAMOND_MARKETPLACE_ADDRESS,
        chainId: 80001,
        symbol: 'tMATIC',
        network: '0x13881',
        name: 'Matic Mumbai Testnet',
        testnet: true,
      },
      // Removed when Alchemy was implemented, they do not support Binance
      /*
      '0x38': {
        authenticityHost: BSCSCAN_GATEWAY,
        factoryAddress: BINANCE_MAINNET_FACTORY_ADDRESS,
        minterAddress: BINANCE_MAINNET_MINTER_ADDRESS,
        diamondFactoryAddress: BINANCE_MAINNET_DIAMOND_FACTORY_ADDRESS,
        diamondMarketplaceAddress: BINANCE_MAINNET_DIAMOND_MARKETPLACE_ADDRESS,
        chainId: 56,
        symbol: 'BNB',
        network: '0x38',
        name: 'Binance Mainnet',
        testnet: false,
      },
      '0x61': {
        authenticityHost: TEST_BSCSCAN_GATEWAY,
        factoryAddress: BINANCE_TESTNET_FACTORY_ADDRESS,
        minterAddress: BINANCE_TESTNET_MINTER_ADDRESS,
        diamondFactoryAddress: BINANCE_TESTNET_DIAMOND_FACTORY_ADDRESS,
        diamondMarketplaceAddress: BINANCE_TESTNET_DIAMOND_MARKETPLACE_ADDRESS,
        chainId: 97,
        symbol: 'TBNB',
        network: '0x61',
        name: 'Binance Testnet',
        testnet: true,
      },
      */
      '0x1': {
        authenticityHost: ETHERSCAN_GATEWAY,
        factoryAddress: ETHEREUM_MAINNET_FACTORY_ADDRESS,
        minterAddress: ETHEREUM_MAINNET_MINTER_ADDRESS,
        diamondFactoryAddress: ETHEREUM_DIAMOND_FACTORY_ADDRESS,
        diamondMarketplaceAddress: ETHEREUM_DIAMOND_MARKETPLACE_ADDRESS,
        chainId: 1,
        symbol: 'ETH',
        network: '0x1',
        name: 'Ethereum Mainnet',
        testnet: false,
      },
      '0xaa36a7': {
        authenticityHost: TEST_ETHERSCAN_GATEWAY,
        factoryAddress: SEPOLIA_FACTORY_ADDRESS,
        minterAddress: SEPOLIA_MINTER_ADDRESS,
        diamondFactoryAddress: SEPOLIA_DIAMOND_FACTORY_ADDRESS,
        diamondMarketplaceAddress: SEPOLIA_DIAMOND_MARKETPLACE_ADDRESS,
        chainId: 5,
        symbol: 'ETH',
        network: '0xaa36a7',
        name: 'Sepolia Testnet',
        testnet: true,
      },
      '0x89': {
        authenticityHost: POLYGONSCAN_GATEWAY,
        factoryAddress: MATIC_MAINNET_FACTORY_ADDRESS,
        minterAddress: MATIC_MAINNET_MINTER_ADDRESS,
        diamondFactoryAddress: MATIC_MAINNET_DIAMOND_FACTORY_ADDRESS,
        diamondMarketplaceAddress: MATIC_MAINNET_DIAMOND_MARKETPLACE_ADDRESS,
        chainId: 137,
        symbol: 'MATIC',
        network: '0x89',
        name: 'Matic Mainnet',
        testnet: false,
      },
    },
  },
  sentry: {
    dsn: SENTRY_DSN || '',
    serverName: 'blockchain-service',
    logLevels: ['error'],
  },
  rairnode: {
    baseUri: BASE_RAIRNODE_URL,
  },
  redis: {
    connection: { host: REDIS_HOST, port: REDIS_PORT },
  },
};
