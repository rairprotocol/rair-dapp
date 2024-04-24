const {deployAndVerify} = require('../utilities/deployAndVerify');

module.exports = async ({getUnnamedAccounts}) => {
	const [deployerAddress] = await getUnnamedAccounts();

	let facets = [
        // Standard Diamond Facets
        "DiamondCutFacet",
		"DiamondLoupeFacet",
		"OwnershipFacet",

        // 721 Facets
        "ERC721EnumerableFacet",
		"RAIRMetadataFacet",
		"RAIRProductFacet",
		"RAIRRangesFacet",
		"RAIRRoyaltiesFacet",

        // Factory Facets
        "CreatorsFacet",
		"DeployerFacet",
		"TokensFacet",
		// Points facets
        "PointsDeposit",
		"PointsQuery",
		"PointsWithdraw",

        // Marketplace Facets
		"MintingOffersFacet",
		"FeesFacet",
		"ResaleFacet",
	]

	for await (let facet of facets) {
		await deployAndVerify(facet, [], deployerAddress);
	}
};
