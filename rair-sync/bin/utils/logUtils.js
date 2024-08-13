/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
const ethers = require('ethers');
const log = require('./logger')(module);
const { getAlchemy } = require('./alchemySdk');
const { masterMapping } = require('./eventCatcherMapping');

const wasteTime = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const tiers = [2000, 10000, 100000, 1000000, 2000000];

const processLog = (event) => {
  // Array of found events
  const foundEvents = [];

  // Depending on the method, the label for some fields change
  let transactionHashLabel = 'transactionHash';
  let blockNumberLabel = 'blockNumber';
  let logIndexLabel = 'logIndex';

  // April 2023: Alchemy was built for Ethers compatibility, this code was for Moralis' data
  // Ethers expects an array, not 4 separate topics
  if (event.topic0) {
    event.topics = [
      event.topic0,
      event.topic1,
      event.topic2,
      event.topic3,
    ];
    // Filters any empty topic
    event.topics = event.topics.filter((item) => item !== null);
    // Separate topics is also a flag to change the label name
    transactionHashLabel = 'transaction_hash';
    blockNumberLabel = 'block_number';
    logIndexLabel = 'log_index';
  }
  event.topics.forEach((item) => {
    const found = masterMapping[item];
    if (found) {
      const interfaceData = new ethers.utils.Interface(found.abi);
      // log.info(`Found ${found.signature}`);
      foundEvents.push({
        eventSignature: found.signature,
        arguments: interfaceData.decodeEventLog(
          found.signature,
          event.data,
          event.topics,
        ),
        diamondEvent: found.diamondEvent,
        logIndex: event[logIndexLabel],
        transactionHash: event[transactionHashLabel],
        blockNumber: event[blockNumberLabel],
        operation: found.operation,
      });
    }
  });
  return foundEvents;
};

const getTransactionHistory = async (address, blockchainData, fromBlock = 0) => {
  if (!address) {
    return [];
  }

  let provider;

  if (blockchainData.alchemySupport) {
    provider = getAlchemy(blockchainData.hash).core;
  } else if (blockchainData.rpcEndpoint) {
    provider = ethers.getDefaultProvider(blockchainData.rpcEndpoint);
  } else {
    return [];
  }
  const latestBlock = await provider.getBlockNumber();

  // April 2023 update
  // Call the Alchemy SDK and receive all logs emitted in a specified timeframe
  // This result is chronologically ascending, we can iterate through it normally

  // September 2023 update, getting logs is limited to either
  //  2k block queries or 10k logs in response, assuming worst case scenario
  //  events will be queried in 2k blocks. This will affect speed only once
  //  when the contracts are processed for the first time, because they all start
  //  from block 0

  // RPC method will work the same
  let listOfTransaction = [];
  const options = {
    fromBlock: Number(fromBlock),
    address,
  };
  let speedTier = tiers.length - 1;
  do {
    await wasteTime(4000);
    fromBlock = options.fromBlock;
    try {
      if (fromBlock + tiers[speedTier] > latestBlock) {
        options.toBlock = undefined;
      } else {
        options.toBlock = fromBlock + tiers[speedTier];
      }
      const getLogsResult = await provider.getLogs(options);
      listOfTransaction = listOfTransaction.concat(getLogsResult);
      log.info(`[${blockchainData.hash}] Syncing ${address} ${options.fromBlock}/${latestBlock} (${((options.fromBlock / latestBlock) * 100).toFixed(3)}%)`);
      speedTier += (speedTier === tiers.length - 1) ? 0 : 1;
      options.fromBlock = options.toBlock;
    } catch (error) {
      log.error(`Error querying ${address} with ${tiers[speedTier]} blocks`);
      // console.error(Object.keys(error), error.reason);
      speedTier = 0;
    }
  } while ((options.fromBlock + tiers[speedTier]) < latestBlock);
  log.info(`[${blockchainData.hash}] Found ${listOfTransaction.length} events on ${address}`);
  return listOfTransaction.map(processLog);
};

const getLatestBlock = async (blockchainData) => {
  if (blockchainData.alchemySupport) {
    const Alchemy = getAlchemy(blockchainData.hash);
    return Alchemy.core.getBlockNumber();
  } if (blockchainData.rpcEndpoint) {
    const provider = ethers.getDefaultProvider(blockchainData.rpcEndpoint);
    return provider.getBlockNumber();
  }
  return 0;
};

module.exports = {
  processLog,
  getTransactionHistory,
  wasteTime,
  getLatestBlock,
};
