const {deployAndVerify} = require('../utilities/deployAndVerify');

module.exports = async ({getUnnamedAccounts}) => {
	const [deployerAddress] = await getUnnamedAccounts();

	let facets = [
        // Standard Diamond Facets
        // DiamondCutFacet

        // 721 Facets
        // "ERC721Facet",
		// "RAIRMetadataFacet",
		// "RAIRProductFacet",
		// "RAIRRangesFacet",
		// "RAIRRoyaltiesFacet",

        // Factory Facets
        // 'creatorFacet',
		// 'ERC777ReceiverFacet',
		// 'TokensFacet',

        // Marketplace Facets
		// "MintingOffersFacet",
		// "FeesFacet",
		"ResaleFacet"

        // Credit Handler Facets
        // "CreditDeposit",
		// "CreditQuery",
		// "CreditWithdraw",
	]

	for await (let facet of facets) {
		await deployAndVerify(facet, [], deployerAddress);
	}
};
