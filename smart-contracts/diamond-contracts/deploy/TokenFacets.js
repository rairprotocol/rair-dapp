const {deployments, ethers} = require('hardhat');

module.exports = async ({accounts, getUnnamedAccounts}) => {
	const {deploy} = deployments;
	const [deployerAddress] = await getUnnamedAccounts();

	let erc721FacetDeployment = await deploy('ERC721Facet', { from: deployerAddress });
	console.log('ERC721 Facet deployed at', erc721FacetDeployment.receipt.contractAddress);

	let metadataFacetDeployment = await deploy('RAIRMetadataFacet', { from: deployerAddress });
	console.log('Metadata Facet deployed at', metadataFacetDeployment.receipt.contractAddress);

	let productFacetDeployment = await deploy('RAIRProductFacet', { from: deployerAddress });
	console.log('Product Facet deployed at', productFacetDeployment.receipt.contractAddress);

	let rangesFacetDeployment = await deploy('RAIRRangesFacet', { from: deployerAddress });
	console.log('Ranges Facet deployed at', rangesFacetDeployment.receipt.contractAddress);
};

module.exports.tags = ['TokenFacets'];