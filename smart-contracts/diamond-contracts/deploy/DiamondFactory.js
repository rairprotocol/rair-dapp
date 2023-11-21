const { deployAndVerify } = require('../utilities/deployAndVerify');

module.exports = async ({ getUnnamedAccounts }) => {
	const [deployerAddress] = await getUnnamedAccounts();

	const diamondCutData = await deployAndVerify('DiamondCutFacet', [], deployerAddress);
	await deployAndVerify('FactoryDiamond', [diamondCutData.receipt.contractAddress], deployerAddress);
};

module.exports.tags = ['DiamondTokenFactory'];