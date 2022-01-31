const {deployments, ethers} = require('hardhat');

module.exports = async ({accounts, getUnnamedAccounts}) => {
	const {deploy} = deployments;
	const [deployerAddress] = await getUnnamedAccounts();

	let mintingOffersFacetDeployment = await deploy('MintingOffersFacet', { from: deployerAddress });
	console.log('Minting Offers Facet deployed at', mintingOffersFacetDeployment.receipt.contractAddress);

	let feesFacetDeployment = await deploy('FeesFacet', { from: deployerAddress });
	console.log('Fees Manager Facet deployed at', feesFacetDeployment.receipt.contractAddress);
};

module.exports.tags = ['MinterFacets'];