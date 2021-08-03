const {deployments, ethers} = require('hardhat');

module.exports = async ({accounts, getUnnamedAccounts}) => {
  const {deploy} = deployments;
  const [deployerAddress] = await getUnnamedAccounts();
  console.log('Minter Marketplace deployed at', (await deploy('Minter_Marketplace', {
    from: deployerAddress,
    //proxy: true,
    //args: ['0xEC30759D0A3F3CE0A730920DC29d74e441f492C3', 9000, 1000],
    //proxyContract: "OpenZeppelinTransparentProxy"
  })).receipt.contractAddress);
};

module.exports.tags = ['MinterMarketplace'];