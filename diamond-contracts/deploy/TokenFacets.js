const {deployments, ethers} = require('hardhat');

module.exports = async ({accounts, getUnnamedAccounts}) => {
	const {deploy} = deployments;
	const [deployerAddress] = await getUnnamedAccounts();

	//let ERC721FacetDeployment = await deploy('ERC721Facet', { from: deployerAddress });
	//console.log('ERC721Facet deployed at', ERC721FacetDeployment.receipt.contractAddress);
};

module.exports.tags = ['TokenFacets'];

/*
FeesFacet
MarketplaceDiamond
MintingOffersFacet
RAIR777
*/