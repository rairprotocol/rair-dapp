module.exports = [
  {
    url: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    network: { chainId: 97, symbol: 'BNB', name: 'Binance Testnet' },
    factoryAddress: '0x91429c87b1D85B0bDea7df6F71C854aBeaD99EE4',
    minterAddress: '0x3a61f5bF7D205AdBd9c0beE91709482AcBEE089f',
    symbol: 'BNB',
  },
  {
    url: 'https://eth-goerli.alchemyapi.io/v2/U0H4tRHPsDH69OKr4Hp1TOrDi-j7PKN_',
    network: { chainId: 5, symbol: 'ETH', name: 'Goerli Testnet' },
    factoryAddress: '0x74278C22BfB1DCcc3d42F8b71280C25691E8C157',
    minterAddress: '0xE5c44102C354B97cbcfcA56F53Ea9Ede572a39Ba',
    symbol: 'ETH'
  },
  {
    url: 'https://rpc-mumbai.maticvigil.com',
    network: { chainId: 80001, symbol: 'tMATIC', name: 'Matic Mumbai Testnet' },
    factoryAddress: '0x1A5bf89208Dddd09614919eE31EA6E40D42493CD',
    minterAddress: '0x63Dd6821D902012B664dD80140C54A98CeE97068',
    symbol: 'tMATIC'
  }
];
