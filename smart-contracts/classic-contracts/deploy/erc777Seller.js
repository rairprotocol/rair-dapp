const {deployments, ethers} = require('hardhat');

module.exports = async ({accounts, getUnnamedAccounts}) => {
	const { deploy, get } = deployments;
	const [deployerAddress] = await getUnnamedAccounts();

	// Selects the address for the ERC777 depending on the blockhain
	let constructorArgumentsForSeller = [
		{
			'0x1': "0xf0ebe73fdae61b305132fd1873c98fb5c4735b40",
			'0x5': "0x4e6a5B076730954d80e55dDb2d2e7E732B5bAb70",
			mumbai: "0x1AeAb89553233D1045b506e8DCBFa3df76E18896",
			matic: "0x0Ce668D271b8016a785Bf146e58739F432300B12",
			binanceTestnet: "0x5b01aBE2DCfaa4C9c80ccE87223c8e21D7Fc9845",
			binanceMainnet: "0x0Ce668D271b8016a785Bf146e58739F432300B12",
		}[hre.network.name]
	];
	
	if (constructorArgumentsForSeller[0] === undefined) {
		console.error("NO ERC777 CONTRACT DEFINED");
		return;
	}
	
	//let newSellerDeployment = await get("RAIR_Token_Purchaser");
	let newSellerDeployment = (await deploy(
		"RAIR_Token_Purchaser",
		{
			from: deployerAddress,
			args: constructorArgumentsForSeller,
			waitConfirmations: 6
		}
	))

	if (!newSellerDeployment) {
		console.log('ERROR DEPLOYING');
		return
	}

	console.error(`Deployed ERC777 seller contract on ${hre.network.name}, address: ${newSellerDeployment?.receipt?.contractAddress}`);

	if (newSellerDeployment.newlyDeployed) {
		await hre.run("verify:verify", {
			address: newSellerDeployment.receipt.contractAddress,
			constructorArguments: constructorArgumentsForSeller
		});
	}

	console.log('Complete!');
};

module.exports.tags = ['ERC777Seller'];