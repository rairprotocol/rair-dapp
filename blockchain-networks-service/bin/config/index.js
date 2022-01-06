const {
  TEST_BSCSCAN_GATEWAY,
  TEST_POLYGONSCAN_GATEWAY,
  TEST_ETHERSCAN_GATEWAY,
  POLYGONSCAN_GATEWAY,
  ETHERSCAN_GATEWAY,
  BINANCE_FACTORY_ADDRESS,
  BINANCE_MINTER_ADDRESS,
  GOERLI_FACTORY_ADDRESS,
  GOERLI_MINTER_ADDRESS,
  MATIC_MUMBAI_FACTORY_ADDRESS,
  MATIC_MUMBAI_MINTER_ADDRESS,
  MATIC_MAINNET_FACTORY_ADDRESS,
  MATIC_MAINNET_MINTER_ADDRESS,
  ETHEREUM_MAINNET_FACTORY_ADDRESS,
  ETHEREUM_MAINNET_MINTER_ADDRESS,
  MORALIS_SERVER_TEST,
  MORALIS_SERVER_MAIN,
  MORALIS_API_KEY_TEST,
  MORALIS_API_KEY_MAIN
} = process.env;

module.exports = {
  blockchain: {
    networks: {
      // '0x38': 'Binance Mainnet',
      '0x61': {
        authenticityHost: TEST_BSCSCAN_GATEWAY,
        factoryAddress: BINANCE_FACTORY_ADDRESS,
        minterAddress: BINANCE_MINTER_ADDRESS,
        chainId: 97,
        symbol: 'BNB',
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
        chainId: 137,
        symbol: 'MATIC',
        watchFunction: 'watchPolygonAddress',
        watchCollection: 'watchedPolygonAddress',
        network: '0x89',
        name: 'Matic Mainnet',
        testnet: false
      },
      '0x13881': {
        authenticityHost: TEST_POLYGONSCAN_GATEWAY,
        factoryAddress: MATIC_MUMBAI_FACTORY_ADDRESS,
        minterAddress: MATIC_MUMBAI_MINTER_ADDRESS,
        chainId: 80001,
        symbol: 'tMATIC',
        watchFunction: 'watchPolygonAddress',
        watchCollection: 'watchedPolygonAddress',
        network: '0x13881',
        name: 'Matic Mumbai Testnet',
        testnet: true
      }
    },
    moralis: {
      mainnet: {
        serverUrl: MORALIS_SERVER_MAIN,
        appId: MORALIS_API_KEY_MAIN
      },
      testnet: {
        serverUrl: MORALIS_SERVER_TEST,
        appId: MORALIS_API_KEY_TEST
      }
    }
  }
};

