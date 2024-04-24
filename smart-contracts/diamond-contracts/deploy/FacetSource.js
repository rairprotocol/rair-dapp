const { deployAndVerify } = require('../utilities/deployAndVerify');
const { deployments } = require('hardhat');

module.exports = async ({ getUnnamedAccounts }) => {
	const { get } = deployments;
	const [deployerAddress] = await getUnnamedAccounts();

	let diamondCutFacetDeployment = await get("DiamondCutFacet");
	await deployAndVerify(
		'FacetSource',
		[diamondCutFacetDeployment.receipt.contractAddress],
		deployerAddress
	);
};

module.exports.tags = ['ERC721 Facet Source'];