const {deployments, ethers} = require('hardhat');

module.exports = async ({accounts, getUnnamedAccounts}) => {
	const { deploy } = deployments;
	const [deployerAddress] = await getUnnamedAccounts();

	// Selects the address for the ERC777 depending on the blockhain
	let constructorArgumentsForNewFactory = [
		'15000000000000000000',			// Deployments are by default 15 RAIR tokens
		{
			ethMainnet: "0xf0ebe73fdae61b305132fd1873c98fb5c4735b40",
			goerli: "0x4e6a5B076730954d80e55dDb2d2e7E732B5bAb70",
			mumbai: "0x1AeAb89553233D1045b506e8DCBFa3df76E18896",
			matic: "0x0Ce668D271b8016a785Bf146e58739F432300B12",
			binanceTestnet: "0x5b01aBE2DCfaa4C9c80ccE87223c8e21D7Fc9845",
			binanceMainnet: "0x0Ce668D271b8016a785Bf146e58739F432300B12",
		}[hre.network.name]
	];

	if (constructorArgumentsForNewFactory[1] === undefined) {
		console.error("NO ERC777 CONTRACT DEFINED");
		return;
	}

	let newFactoryDeployment = (await deploy(
		"RAIR721_Master_Factory",
		{
			from: deployerAddress,
			args: constructorArgumentsForNewFactory,
			waitConfirmations: 6
		}
	))

	if (!newFactoryDeployment) {
		console.log('ERROR DEPLOYING');
		return
	}

	console.error(`Deployed Master Factory contract on ${hre.network.name}, address: ${newFactoryDeployment?.receipt?.contractAddress}`);

	let constructorArgumentsForDeployer = [ newFactoryDeployment.receipt.contractAddress ];

	let newDeployerDeployment = (await deploy(
		"RAIR721_Deployer",
		{
			from: deployerAddress,
			args: constructorArgumentsForDeployer,
			waitConfirmations: 6
		}
	))

	if (!newDeployerDeployment) {
		console.error('ERROR DEPLOYING DEPLOYING CONTRACT');
		return
	}

	console.log(`Deployed Factory Deployer contract on ${hre.network.name}, address: ${newDeployerDeployment?.receipt?.contractAddress}`);

	if (newFactoryDeployment.newlyDeployed) {
		await hre.run("verify:verify", {
			address: newFactoryDeployment.receipt.contractAddress,
			constructorArguments: constructorArgumentsForNewFactory
		});
	}

	if (newDeployerDeployment.newlyDeployed) {
		await hre.run("verify:verify", {
			address: newDeployerDeployment.receipt.contractAddress,
			constructorArguments: constructorArgumentsForDeployer
		});
	}

	console.log('Complete!');
};

module.exports.tags = ['NewTokenFactory'];