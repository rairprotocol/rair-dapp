const log = require('./logger')(module);
const fetch = require('node-fetch');
const Moralis = require('moralis/node');

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

const ethers = require('ethers');
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

const findContractFromAddress = async (address, network, transactionReceipt, dbModels) => {
	return await dbModels.Contract.findOne({contractAddress: address.toLowerCase(), blockchain: network});
}

const wasteTime = (ms) => new Promise((resolve, reject) => {
	setTimeout(resolve, ms);
})

// Events from this list will be stored on the database
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
	SoldOut: null,

	// Resale Marketplace
    OfferStatusChange: handleResaleOffer,
    UpdatedOfferPrice: updateResaleOffer,
    CustomRoyaltiesSet: registerCustomSplits
};

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

const processLog = (event) => {
	// Array of found events
	let foundEvents = [];

	// Depending on the method, the label for some fields change
	let transactionHashLabel = 'transactionHash';
	let blockNumberLabel = 'blockNumber';
	let logIndexLabel = 'logIndex';

	// Ethers expects an array, not 4 separate topics
	if (event.topic0) {
		event.topics = [
			event.topic0,
			event.topic1,
			event.topic2,
			event.topic3
		];
		// Filters any empty topic
		event.topics = event.topics.filter(item => item !== null);
		// Separate topics is also a flag to change the label name
		transactionHashLabel = 'transaction_hash';
		blockNumberLabel = 'block_number';
		logIndexLabel = 'log_index';
	}
	event.topics.forEach(item => {
		let found = masterMapping[item];
		if (found) {
			let interface = new ethers.utils.Interface(found.abi);
			//log.info(`Found ${found.signature}`);
			foundEvents.push({
				eventSignature: found.signature,
				arguments: interface.decodeEventLog(
					found.signature,
					event.data,
					event.topics
				),
				diamondEvent: found.diamondEvent,
				logIndex: event[logIndexLabel],
				transactionHash: event[transactionHashLabel],
				blockNumber: event[blockNumberLabel],
				operation: found.operation
			});
		}
	});
	return foundEvents;
}

const getTransactionHistory = async (address, chain, from_block = 0) => {
	// Wait some time between requests
	await wasteTime(process.env.TASK_SEPARATION_TIME || 10000);

	// Call Moralis SDK and receive ALL logs emitted in a timeframe
	// This counts as 2 requests in the Rate Limiting (March 2022)
	const options = {
		address,
		chain,
		from_block
	};

	// Result is in DESCENDING order, to process it chronologically we need to reverse this array
	let {result, ...logData} = await Moralis.Web3API.native.getLogsByAddress(options);
	let completeListOfTransactions = result;

	while (logData?.next) {
		let nextPage = await logData.next();
		completeListOfTransactions.push(...nextPage.result);
		logData = nextPage;
		log.info(`Querying page #${nextPage.page} for ${chain}:${address}`);
	}
	
	log.info(`[${chain}] Found ${logData.total} events on ${address} since block #${from_block}`);
	
	return completeListOfTransactions.reverse().map(processLog);
}

module.exports = {
	processLog,
	getContractEvents,
	getTransactionHistory,
	wasteTime
}