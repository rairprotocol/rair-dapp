const ethers = require('ethers');
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID

module.exports = [
  {
    provider: new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/', {
      chainId: 97,
      symbol: 'BNB',
      name: 'Binance Testnet'
    }),
    factoryAddress: '0x91429c87b1D85B0bDea7df6F71C854aBeaD99EE4',
    minterAddress: '0x3a61f5bF7D205AdBd9c0beE91709482AcBEE089f',
    symbol: 'BNB',
  },
  {
    provider: new ethers.providers.JsonRpcProvider(`https://eth-goerli.alchemyapi.io/v2/U0H4tRHPsDH69OKr4Hp1TOrDi-j7PKN_`, {
      chainId: 5,
      symbol: 'ETH',
      name: 'Goerli Testnet'
    }),
    factoryAddress: '0x74278C22BfB1DCcc3d42F8b71280C25691E8C157',
    minterAddress: '0xE5c44102C354B97cbcfcA56F53Ea9Ede572a39Ba',
    symbol: 'ETH'
  },
  {
    provider: new ethers.providers.JsonRpcProvider('https://polygon-mumbai.infura.io/v3/5c77a63a0aa74452a7c77a64fe9a90d5', {
      chainId: 80001,
      symbol: 'tMATIC',
      name: 'Matic Mumbai Testnet'
    }),
    factoryAddress: '0x1A5bf89208Dddd09614919eE31EA6E40D42493CD',
    minterAddress: '0x63Dd6821D902012B664dD80140C54A98CeE97068',
    symbol: 'tMATIC'
  },
  {
    provider: new ethers.providers.JsonRpcProvider('https://polygon-mainnet.infura.io/v3/5c77a63a0aa74452a7c77a64fe9a90d5', {
      chainId: 137,
      symbol: 'MATIC',
      name: 'Matic Mainnet'
    }),
    factoryAddress: '0x556a3Db6d800AAA56f8B09E476793c5100705Db5',
    minterAddress: '0xc76c3ebEA0aC6aC78d9c0b324f72CA59da36B9df',
    symbol: 'MATIC'
  }
];
