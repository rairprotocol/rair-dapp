/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
const ethers = require('ethers');
const log = require('./logger')(module);
const { getAlchemy } = require('./alchemySdk');
const { masterMapping } = require('./eventCatcherMapping');

const wasteTime = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

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

const getTransactionHistory = async (address, chain, fromBlock = 0) => {
  // Wait some time between requests
  // await wasteTime(process.env.TASK_SEPARATION_TIME || 10000);

  const Alchemy = getAlchemy(chain);
  // April 2023 update
  // Call the Alchemy SDK and receive all logs emitten in a specified timeframe
  // This result is chronologically ascending, we can iterate through it normally
  // Need to cast block to number for some reason (might overflow eventually)
  const options = {
    fromBlock: Number(fromBlock),
    address,
  };
  const listOfTransaction = await Alchemy.core.getLogs(options);
  log.info(`[${chain}] Found ${listOfTransaction.length} events on ${address} since block #${fromBlock}`);
  return listOfTransaction.map(processLog);
};

const getLatestBlock = async (chain) => {
  const Alchemy = getAlchemy(chain);
  // The Alchemy SDK will return the latest mined block,
  //   this is used to validate that the database information is correct
  const latestBlock = await Alchemy.core.getBlockNumber();
  return latestBlock;
};

module.exports = {
  processLog,
  getTransactionHistory,
  wasteTime,
  getLatestBlock,
};
