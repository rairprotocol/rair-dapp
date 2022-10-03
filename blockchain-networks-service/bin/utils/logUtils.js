const log = require('./logger')(module);
const Moralis = require('moralis/node');
const { masterMapping } = require('./eventCatcherMapping');

const ethers = require('ethers');

const wasteTime = (ms) => new Promise((resolve, reject) => {
	setTimeout(resolve, ms);
})

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

	while (completeListOfTransactions.length < logData.total) {
		// Need to get more pages
		//console.log("More pages required");
		if (logData?.next) {
			logData = await logData.next();
			log.info(`Querying page #${logData.page} for ${chain}:${address} - Using Next`);
		} else if (logData?.cursor) {
			options.cursor = logData.cursor;
			logData = await Moralis.Web3API.native.getLogsByAddress(options);
			log.info(`Querying page #${logData.page} for ${chain}:${address} - Using Cursor`);
		}
		completeListOfTransactions.push(...logData.result);
	}
	log.info(`[${chain}] Found ${logData.total} events on ${address} since block #${from_block}`);
	//console.log(logData.total,'on',address,'actually',completeListOfTransactions.length);
	return completeListOfTransactions.reverse().map(processLog);
}

module.exports = {
	processLog,
	getTransactionHistory,
	wasteTime
}