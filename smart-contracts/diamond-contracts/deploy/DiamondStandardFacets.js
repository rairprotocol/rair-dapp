const {deployments, ethers} = require('hardhat');

module.exports = async ({accounts, getUnnamedAccounts}) => {
	const {deploy} = deployments;
	const [deployerAddress] = await getUnnamedAccounts();

	let diamondLoupeFacetDeployment = await deploy('DiamondLoupeFacet', { from: deployerAddress });
	console.log('DiamondLoupeFacet Facet deployed at', diamondLoupeFacetDeployment.receipt.contractAddress);
	
	let ownershipFacetDeployment = await deploy('OwnershipFacet', { from: deployerAddress });
	console.log('Diamond Ownership Facet deployed at', ownershipFacetDeployment.receipt.contractAddress);
};

module.exports.tags = ['DiamondMarketplace'];