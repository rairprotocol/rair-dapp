const { BigNumber } = require('ethers');
const { getTransactionHistory, getLatestBlock } = require('./logUtils');
const { Transaction, Blockchain } = require('../models');
const log = require('./logger')(module);
const { Versioning } = require('../models');
const { blockchain } = require('../config');

const processLogEvents = async (
  event, // Raw data of the event
  network, // Blockchain being processed
  contractAddress, // Contract address
  processedTransactions,
) => {
  if (!event) {
    return undefined;
  }
  const returnValues = {
    transactionArray: [...processedTransactions],
    insertions: {},
    lastSuccessfullBlock: 0,
  };
  const filteredTransaction = await Transaction.findOne({
    _id: event.transactionHash,
    blockchainId: network,
    processed: true,
    caught: true,
  });
  if (
    filteredTransaction &&
    filteredTransaction.caught &&
    filteredTransaction.toAddress.includes(contractAddress)
  ) {
    log.info(
      `Ignorning log ${event.transactionHash} because the transaction is already processed for contract ${contractAddress}`,
    );
  } else if (event && event.operation) {
    // If the log is already on DB, update the address list
    if (filteredTransaction) {
      filteredTransaction.toAddress.push(contractAddress);
      await filteredTransaction.save();
    } else if (
      !returnValues.transactionArray.includes(event.transactionHash)
    ) {
      // Otherwise, push it into the insertion list
      returnValues.transactionArray.push(event.transactionHash);
      // And create a DB entry right away

      try {
        await Transaction.updateOne(
          {
            _id: event.transactionHash,
            blockchainId: network,
            processed: true,
          },
          {
            $push: { toAddress: contractAddress },
          },
          { upsert: true },
        );
      } catch (error) {
        log.error(
          `There was an issue saving transaction ${event.transactionHash} for contract ${contractAddress}: ${error}`,
        );
        return undefined;
      }
    }

    try {
      const operationSuccessful = await event.operation(
        // Compose the transaction data, the logs don't include it
        {
          network,
          transactionHash: event.transactionHash,
          fromAddress: contractAddress,
          diamondEvent: event.diamondEvent,
        },
        ...event.arguments,
      );

      if (operationSuccessful) {
        if (returnValues.insertions[event.eventSignature] === undefined) {
          returnValues.insertions[event.eventSignature] = 0;
        }
        returnValues.insertions[event.eventSignature] += 1;
      }
    } catch (err) {
      log.error(`Error processing transaction ${event?.transactionHash}`);
      console.error(event, err);
    }
  }
  // Update the latest successfull block
  if (returnValues.lastSuccessfullBlock <= event.blockNumber) {
    returnValues.lastSuccessfullBlock = event.blockNumber;
  }
  return returnValues;
};

exports.processLogEvents = processLogEvents;

exports.syncEventsFromSingleContract = (taskName, contractName) => async (job, done) => {
  try {
    // Log the start of the task
    log.info(`Agenda action starting: ${taskName}`);

    // Extract network hash and task name from the task data
    const { network } = job.attrs.data;

    const blockchainData = await Blockchain.findOne({ hash: network });
    if (!blockchainData || blockchainData?.sync.toString() === 'false') {
      log.info(`[${network}] Skipping ${taskName} events, syncing is disabled.`);
      return done();
    }

    // Get network data using the task's blockchain hash
    // This includes minter address and factory address
    const networkData = blockchain.networks[network];

    if (contractName && !networkData[contractName]) {
      log.info(`[${network}] Skipping ${taskName} events, address is not defined.`);
      return done();
    }

    // Get last block parsed from the Versioning collection
    let version = await Versioning.findOne({
      name: taskName,
      network,
    });

    if (version === null) {
      version = await (new Versioning({
        name: taskName,
        network,
        number: 0,
      })).save();
    }

    if (version.running === true) {
      return done({ reason: `[${network}] Process ${taskName} already running.` });
    }
    version.running = true;

    const latestBlock = await getLatestBlock(network);

    if (latestBlock < version.number) {
      log.error(`[${network}] ${taskName} ERROR: latest block is ${version.number} but the last mined block is ${latestBlock}, the contract's last synced block will be reset to 0, expect a lot of duplicate transaction messages!`);
      version.number = 0;
    }

    version = await version.save();

    // Track latest block number processed
    let lastSuccessfullBlock = BigNumber.from(version.number);
    // Track processed transactions for this task execution
    let transactionArray = [];
    // Used for logging
    const insertions = {};

    // Queries the blockchain / alchemy for the latest events
    const processedResult = await getTransactionHistory(
      networkData[contractName],
      network,
      version.number,
    );
    // If there are no new events, stop
    if (processedResult.length === 0) {
      version.running = false;
      await version.save();
      log.info(`[${network}] ${taskName} complete`);
      return done();
    }

    // The events HAVE to be processed in order
    // eslint-disable-next-line no-restricted-syntax
    for await (const [event] of processedResult) {
      const result = await processLogEvents(
        event,
        network,
        networkData[contractName],
        transactionArray,
      );
        // An undefined value means there was nothing to process from that event
      if (result) {
        transactionArray = result.transactionArray;
        // Keep track of the successful operations for each event
        Object.keys(result.insertions).forEach((key) => {
          if (insertions[key] === undefined) {
            insertions[key] = 0;
          }
          insertions[key] += 1;
        });
        if (lastSuccessfullBlock.lt(result.lastSuccessfullBlock)) {
          lastSuccessfullBlock = BigNumber.from(result.lastSuccessfullBlock);
        }
      }
    }
    // Log the number of logs processed
    Object.keys(insertions).forEach((sig) => {
      if (insertions[sig] > 0) {
        log.info(
          `[${network}] Processed ${insertions[sig]} events of ${sig}`,
        );
      }
    });

    // Add 1 to the last successful block so the next query to Alchemy excludes it
    // Because the last successfull block was already processed here
    // But validate that the last parsed block is different from the current one,
    // Otherwise it will keep increasing and could ignore events
    version.running = false;
    if (lastSuccessfullBlock.gt(version.number)) {
      version.number += lastSuccessfullBlock.add(1).toString();
    }
    await version.save();
    log.info(`[${network}] ${taskName} complete`);

    return done();
  } catch (error) {
    log.error(error);
    return done(error);
  }
};
