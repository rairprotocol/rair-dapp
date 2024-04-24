const { deployments } = require('hardhat');
const { deployAndVerify } = require('../utilities/deployAndVerify');

module.exports = async ({ getUnnamedAccounts }) => {
	const { get } = deployments;
	const [deployerAddress] = await getUnnamedAccounts();
	
	let diamondCutFacetDeployment = await get("DiamondCutFacet");
	await deployAndVerify(
		'FactoryDiamond',
		[diamondCutFacetDeployment.receipt.contractAddress],
		deployerAddress
	);
};

module.exports.tags = ['DiamondTokenFactory'];