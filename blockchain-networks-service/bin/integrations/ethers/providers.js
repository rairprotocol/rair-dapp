const {
  BINANCE_FACTORY_ADDRESS,
  BINANCE_MINTER_ADDRESS,
  GOERLI_FACTORY_ADDRESS,
  GOERLI_MINTER_ADDRESS,
  MATIC_MUMBAI_FACTORY_ADDRESS,
  MATIC_MUMBAI_MINTER_ADDRESS,
  MATIC_MAINNET_FACTORY_ADDRESS,
  MATIC_MAINNET_MINTER_ADDRESS
} = process.env;

module.exports = [
  {
    factoryAddress: BINANCE_FACTORY_ADDRESS,
    minterAddress: BINANCE_MINTER_ADDRESS,
    network: '0x61',
    name: 'Binance Testnet'
  },
  {
    factoryAddress: GOERLI_FACTORY_ADDRESS,
    minterAddress: GOERLI_MINTER_ADDRESS,
    network: '0x5',
    name: 'Goerli Testnet'
  },
  {
    factoryAddress: MATIC_MUMBAI_FACTORY_ADDRESS,
    minterAddress: MATIC_MUMBAI_MINTER_ADDRESS,
    network: '0x13881',
    name: 'Matic Mumbai Testnet'
  },
  {
    watchFunction: 'watchPolygonAddress',
    watchCollection: 'watchedPolygonAddress',
    factoryAddress: MATIC_MAINNET_FACTORY_ADDRESS,
    minterAddress: MATIC_MAINNET_MINTER_ADDRESS,
    network: '0x89',
    name: 'Matic Mainnet'
  }
];
