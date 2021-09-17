const ethers = require('ethers');

module.exports = [
  {
    provider: new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/', {
      chainId: 97,
      symbol: 'BNB',
      name: 'Binance Testnet'
    }),
    factoryAddress: '0x8CFB64bd8295372e532D7595cEf0b900c768e612',
    minterAddress: '0x1150A9D87EAb450ab83A3779Fe977cfdF9aEF45C',
    symbol: 'BNB',
  },
  {
    provider: new ethers.providers.JsonRpcProvider('https://eth-goerli.alchemyapi.io/v2/U0H4tRHPsDH69OKr4Hp1TOrDi-j7PKN_', {
      chainId: 5,
      symbol: 'ETH',
      name: 'Goerli Testnet'
    }),
    factoryAddress: '0x69F0980e45ae2A3aC5254C7B3202E8fce5B0f84F',
    minterAddress: '0xb256E35Ad58fc9c57948388C27840CEBcd7cb991',
    symbol: 'ETH'
  },
  {
    provider: new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com', {
      chainId: 80001,
      symbol: 'tMATIC',
      name: 'Matic Mumbai Testnet'
    }),
    factoryAddress: '0x74278C22BfB1DCcc3d42F8b71280C25691E8C157',
    minterAddress: '0xE5c44102C354B97cbcfcA56F53Ea9Ede572a39Ba',
    symbol: 'tMATIC'
  }
];
