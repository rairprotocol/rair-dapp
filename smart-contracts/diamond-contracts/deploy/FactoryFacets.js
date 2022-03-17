const {deployments, ethers} = require('hardhat');

module.exports = async ({accounts, getUnnamedAccounts}) => {
	const {deploy} = deployments;
	const [deployerAddress] = await getUnnamedAccounts();
	
	let creatorFacetDeployment = await deploy('creatorFacet', { from: deployerAddress });
	console.log('CreatorFacet deployed at', creatorFacetDeployment.receipt.contractAddress);

	let ERC777FacetDeployment = await deploy('ERC777ReceiverFacet', { from: deployerAddress });
	console.log('ERC777 Receiver Facet deployed at', ERC777FacetDeployment.receipt.contractAddress);
	
	let tokensFacetDeployment = await deploy('TokensFacet', { from: deployerAddress });
	console.log('Token Management facet deployed at', tokensFacetDeployment.receipt.contractAddress);
};

module.exports.tags = ['FactoryFacets'];