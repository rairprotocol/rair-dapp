const {deployments, ethers} = require('hardhat');

module.exports = async ({accounts, getUnnamedAccounts}) => {
  const {deploy} = deployments;
  const [deployerAddress] = await getUnnamedAccounts();
  console.log('Factory deployed at', (await deploy('RAIR_Token_Factory', {
    from: deployerAddress,
    //proxy: true,
    //args: [11, '0x51eA5316F2A9062e1cAB3c498cCA2924A7AB03b1'],
    //proxyContract: "OpenZeppelinTransparentProxy"
  })).receipt.contractAddress);
};

module.exports.tags = ['TokenFactory'];