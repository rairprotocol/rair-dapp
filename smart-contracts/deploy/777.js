const {deployments, ethers} = require('hardhat');

module.exports = async ({accounts, getUnnamedAccounts}) => {
  const {deploy} = deployments;
  const [deployerAddress] = await getUnnamedAccounts();
  console.log('ERC777 deployed at', (await deploy('RAIR777', {
    from: deployerAddress,
    //proxy: true,
    args: ['412000000000000000000000000', ['0xEC30759D0A3F3CE0A730920DC29d74e441f492C3']],
    //proxyContract: "OpenZeppelinTransparentProxy"
  })).receipt.contractAddress);
};

module.exports.tags = ['ERC777'];