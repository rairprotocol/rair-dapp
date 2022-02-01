const {deployments, ethers} = require('hardhat');

module.exports = async ({accounts, getUnnamedAccounts}) => {
	const {deploy} = deployments;
	const [deployerAddress] = await getUnnamedAccounts();

	let diamondCutFacetDeployment = await deploy('DiamondCutFacet', { from: deployerAddress });
	console.log('DiamondCut Facet deployed at', diamondCutFacetDeployment.receipt.contractAddress);

	let diamondFactoryDeployment = await deploy('FactoryDiamond', {
		from: deployerAddress,
		args: [diamondCutFacetDeployment.receipt.contractAddress],
	})
	console.log('Diamond Factory deployed at', diamondFactoryDeployment.receipt.contractAddress);
};

module.exports.tags = ['DiamondTokenFactory'];