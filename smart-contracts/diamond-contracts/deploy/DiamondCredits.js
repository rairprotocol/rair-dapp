const { deployments } = require('hardhat');
const { deployAndVerify } = require('../utilities/deployAndVerify');

module.exports = async ({ getUnnamedAccounts }) => {
	const { get } = deployments;
	const [ deployerAddress ] = await getUnnamedAccounts();

	// DiamondCut should already be deployed
	let diamondCutFacetDeployment = await get("DiamondCutFacet");
	console.log('DiamondCut Facet deployed at', diamondCutFacetDeployment.receipt.contractAddress);

	await deployAndVerify(
		'CreditHandler',
		[diamondCutFacetDeployment.receipt.contractAddress],
		deployerAddress
	);
};

module.exports.tags = ['DiamondMarketplace'];