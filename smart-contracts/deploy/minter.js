const {deployments, ethers} = require('hardhat');

module.exports = async ({accounts, getUnnamedAccounts}) => {
  const {deploy} = deployments;
  const [deployerAddress] = await getUnnamedAccounts();
  console.log('Minter Marketplace deployed at', (await deploy('Minter_Marketplace', {
    from: deployerAddress,
    //proxy: true,
    args: [
      // RAIR Treasury address FOR MATIC
      '0x3fD4268B03cce553f180E77dfC14fde00271F9B7',
      // Treasury fee: 9% (9.000)
      9000,
      // Node Fee: 1% (1.000)
      1000
    ],
    //proxyContract: "OpenZeppelinTransparentProxy"
  })).receipt.contractAddress);
};

module.exports.tags = ['MinterMarketplace'];