const {deployments, ethers} = require('hardhat');

module.exports = async ({accounts, getUnnamedAccounts}) => {
	const {deploy} = deployments;
	const [deployerAddress] = await getUnnamedAccounts();

	let facets = [
		"ERC721Facet",
		"RAIRMetadataFacet",
		"RAIRProductFacet",
		"RAIRRangesFacet"
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

module.exports.tags = ['TokenFacets'];