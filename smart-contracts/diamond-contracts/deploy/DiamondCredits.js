const {deployments, ethers} = require('hardhat');

module.exports = async ({accounts, getUnnamedAccounts}) => {
	const {deploy, get} = deployments;
	const [deployerAddress] = await getUnnamedAccounts();

	// DiamondCut should already be deployed
	let diamondCutFacetDeployment = await get("DiamondCutFacet");
	console.log('DiamondCut Facet deployed at', diamondCutFacetDeployment.receipt.contractAddress);

	let creditHandlerDeployment = await deploy('CreditHandler', {
		from: deployerAddress,
		args: [diamondCutFacetDeployment.receipt.contractAddress],
		waitConfirmations: 6
	})
	console.log('Main Credit contract deployed at', creditHandlerDeployment.receipt.contractAddress);
	await hre.run("verify:verify", {
		address: creditHandlerDeployment.receipt.contractAddress,
		constructorArguments: [diamondCutFacetDeployment.receipt.contractAddress]
	});
};

module.exports.tags = ['DiamondMarketplace'];