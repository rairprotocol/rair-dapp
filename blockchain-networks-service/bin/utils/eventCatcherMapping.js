const ethers = require('ethers');

// Load the Smart Contract ABIs
const {
	erc721Abi,
	minterAbi,
	factoryAbi,
	erc777Abi,
	diamondMarketplaceAbi,
	diamondFactoryAbi,
	classicDeprecatedEvents,
	diamondDeprecatedEvents,
	resaleMarketplaceEvents
} = require('../integrations/ethers/contracts');

// Load all event handler functions
const {
	insertContract,
	insertCollection,
	insertTokenClassic,
	insertTokenDiamond,
	insertOfferPool,
	insertOffer,
	insertDiamondOffer,
	insertLock,
	insertDiamondRange,
	metadataForToken,
	metadataForProduct,
	updateOfferClassic,
	updateDiamondRange,
	metadataForContract,
	handleResaleOffer,
	updateResaleOffer,
	registerCustomSplits
} = require('./eventCatcherUtils');


// Smart contract events are mapped to an insertion logic
// The list of keys in this object are also used by the transaction catcher
// 	to know if an event is relevant and needs to be synced
const insertionMapping = {
	// Diamond Factory
	DeployedContract: insertContract,
	CreatedCollection: insertCollection,
	CreatedRange: insertDiamondRange,
	UpdatedRange: updateDiamondRange,
	UpdatedBaseURI: metadataForContract,
	UpdatedProductURI: metadataForProduct,
	UpdatedTokenURI: metadataForToken,
	
	// Diamond Marketplace 
	AddedMintingOffer: insertDiamondOffer,
	TokenMinted: insertTokenClassic,
	MintedToken: insertTokenDiamond,

	// Classic Factory
	NewContractDeployed: insertContract,

	// Classic ERC721
	BaseURIChanged: metadataForContract,
	ProductURIChanged: metadataForProduct,
	TokenURIChanged: metadataForToken,
	ProductCreated: insertCollection,

	// Classic Marketplace
	AddedOffer: insertOfferPool,
	AppendedRange: insertOffer,
	RangeLocked: insertLock,
	UpdatedOffer: updateOfferClassic,
	//SoldOut: null,

	// Resale Marketplace
    OfferStatusChange: handleResaleOffer,
    UpdatedOfferPrice: updateResaleOffer,
    CustomRoyaltiesSet: registerCustomSplits
};

// This function processes each ABI and extracts the event name
const getContractEvents = (abi, isDiamond = false) => {
	// Generate an interface with the ABI found
	let interface = new ethers.utils.Interface(abi);
	// Initialize the mapping of each event
	let mapping = {};

	Object.keys(interface.events).forEach((eventSignature) => {
		// Find the one entry in the ABI for the signature
		let [singleAbi] = abi.filter(item => {
			return item.name === eventSignature.split('(')[0];
		});
		if (!singleAbi) {
			console.error(`Couldn't find ABI for signature ${eventSignature}`);
		} else {
			mapping[ethers.utils.id(eventSignature)] = {
				signature: eventSignature,
				abi: [singleAbi],
				diamondEvent: isDiamond,
				operation: insertionMapping[singleAbi.name],
			};
		}
	});
	return mapping;
};

// We populate this once on startup and query it when necessary
const masterMapping = {
	...getContractEvents(erc721Abi),
	...getContractEvents(minterAbi),
	...getContractEvents(factoryAbi),

	...getContractEvents(diamondFactoryAbi, true),
	...getContractEvents(diamondMarketplaceAbi, true),
	
	...getContractEvents(classicDeprecatedEvents, false),
	...getContractEvents(diamondDeprecatedEvents, true),

	...getContractEvents(resaleMarketplaceEvents, false),
}

module.exports = {
	masterMapping,
	insertionMapping
}