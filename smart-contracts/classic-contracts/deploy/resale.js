const {deployments, ethers} = require('hardhat');

module.exports = async ({accounts, getUnnamedAccounts}) => {
	const {deploy} = deployments;
	const [deployerAddress] = await getUnnamedAccounts();

	let contractArgs = [
			{
				ethMainnet: "UNKNOWN",
				goerli: "0xEC30759D0A3F3CE0A730920DC29d74e441f492C3",
				mumbai: "0xEC30759D0A3F3CE0A730920DC29d74e441f492C3",
				matic: "0x3fD4268B03cce553f180E77dfC14fde00271F9B7",
				binanceTestnet: "0xEC30759D0A3F3CE0A730920DC29d74e441f492C3",
				binanceMainnet: "UNKNOWN",
			}[hre.network.name] // Treasury addresses
		]

	let deployment = await deploy("Resale_MarketPlace", {
		args: contractArgs,
		from: deployerAddress,
		waitConfirmations: 6
	});
	console.log(`Resale Marketplace deployed at ${deployment.receipt.contractAddress}`);
	if (deployment.newlyDeployed) {
		try {
			await hre.run("verify:verify", {
				address: deployment.receipt.contractAddress,
				constructorArguments: contractArgs,
			});
		} catch (err) {
			console.error(err);
		}
	}
};

module.exports.tags = ['ResaleMarketplace'];