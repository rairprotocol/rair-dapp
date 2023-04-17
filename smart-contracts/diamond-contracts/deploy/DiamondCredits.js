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

	let facets = [
		"CreditDeposit",
		"CreditQuery",
		"CreditWithdraw",
	]

	for await (let facet of facets) {
		let deployment = await deploy(facet, {
			from: deployerAddress,
			waitConfirmations: 6
		});
		console.log(`${facet} deployed at ${deployment.receipt.contractAddress}`);
		if (deployment.newlyDeployed) {
			try {
				await hre.run("verify:verify", {
					address: deployment.receipt.contractAddress,
					constructorArguments: []
				});
			} catch (err) {
				console.error(err);
			}
		}
	}
};

module.exports.tags = ['DiamondMarketplace'];