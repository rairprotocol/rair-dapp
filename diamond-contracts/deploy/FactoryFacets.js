const {deployments, ethers} = require('hardhat');

module.exports = async ({accounts, getUnnamedAccounts}) => {
	const {deploy} = deployments;
	const [deployerAddress] = await getUnnamedAccounts();

	let diamondLoupeFacetDeployment = await deploy('DiamondLoupeFacet', { from: deployerAddress });
	console.log('DiamondLoupeFacet Facet deployed at', diamondLoupeFacetDeployment.receipt.contractAddress);

	let creatorFacetDeployment = await deploy('creatorFacet', { from: deployerAddress });
	console.log('creatorFacet deployed at', creatorFacetDeployment.receipt.contractAddress);

	let ERC777FacetDeployment = await deploy('ERC777ReceiverFacet', { from: deployerAddress });
	console.log('ERC777 Receiver Facet deployed at', ERC777FacetDeployment.receipt.contractAddress);

	let ownershipFacetDeployment = await deploy('OwnershipFacet', { from: deployerAddress });
	console.log('Diamond Ownership Facet deployed at', ownershipFacetDeployment.receipt.contractAddress);

	let tokensFacetDeployment = await deploy('TokensFacet', { from: deployerAddress });
	console.log('Token Management facet deployed at', tokensFacetDeployment.receipt.contractAddress);
};

module.exports.tags = ['FactoryFacets'];

/*




FeesFacet
MarketplaceDiamond
MintingOffersFacet

RAIR777
*/