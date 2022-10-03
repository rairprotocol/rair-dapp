/* eslint-disable no-param-reassign */
const ethers = require('ethers');
const Moralis = require('moralis/node');
const endpoints = require('../../config/blockchainEndpoints');
const log = require('../../utils/logger')(module);
const {masterMapping, insertionMapping} = require('../../utils/eventCatcherMapping');

const { providersMapping } = require('../../utils/speedyNodeProviders');

// Move this to a config file
Moralis.start({
  serverUrl: process.env.MORALIS_SERVER_TEST,
  appId: process.env.MORALIS_API_KEY_TEST,
});

const getTransaction = async (
  network,
  transactionHash,
  userAddress,
  dbModels,
) => {
  try {
    // Validate that the processed transaction doesn't exist already in the database
    const existingTransaction = await dbModels.Transaction.findOne({
      _id: transactionHash,
    });
    if (existingTransaction !== null) {
      throw Error(
        `Transaction Verification failed for tx: ${transactionHash}, the transaction is already processed`,
      );
    }
    // Store on DB that the transaction is being processed
    let newTransaction = await new dbModels.Transaction({
      _id: transactionHash,
      blockchainId: network,
    }).save();

    log.info(
      `Querying hash ${transactionHash} on ${network} using ${endpoints[network]}`,
    );

    // Default values in case the Moralis SDK query works
    let transactionReceipt;
    let fromAddressLabel = 'from_address';
    let toAddressLabel = 'to_address';
    // let logIndexLabel = 'log_index';
    let transactionHashLabel = 'hash';

    // Retreive data from Moralis SDK (Cheaper than speedy nodes (Feb 2022))
    const options = {
      chain: network,
      transaction_hash: transactionHash,
    };
    try {
      // Catch any error if the SDK fails
      transactionReceipt = await Moralis.Web3API.native.getTransaction(options);
    } catch (err) {
      log.error(err);
    }

    if (!transactionReceipt) {
      log.error(
        `Validation failed for tx ${transactionHash}, couldn't get a response from Moralis`,
      );
      transactionReceipt = await providersMapping[
        network
      ].provider.getTransactionReceipt(transactionHash);
      // Values to get the data in the ethers.js format
      fromAddressLabel = 'from';
      toAddressLabel = 'to';
      // logIndexLabel = 'logIndex';
      transactionHashLabel = 'transactionHash';
    }

    // Check if the Transaction comes from the same user that sent the request
    if (transactionReceipt[fromAddressLabel].toLowerCase() !== userAddress) {
      newTransaction.processed = true;
      await newTransaction.save();
      await dbModels.Transaction.deleteOne({ _id: newTransaction._id });
      throw Error(
        `Transaction Authentication failed for tx: ${transactionHash}, expected ${transactionReceipt[fromAddressLabel]} to equal ${userAddress}`,
      );
    }

    // Fill out data from the transaction
    newTransaction.fromAddress = transactionReceipt[fromAddressLabel];
    newTransaction.toAddress = transactionReceipt[toAddressLabel];
    newTransaction = await newTransaction.save();

    const insertionQueue = [];

    // Loop over the logs from the transaction
    const result = transactionReceipt.logs.map((event) => {
      const foundEvents = [];
      if (event.topic0) {
        // In case the data comes from the Moralis SDK
        // Formats the topic data into something ethers can decode
        event.topics = [event.topic0, event.topic1, event.topic2, event.topic3];
        // Filters all the null topics
        event.topics = event.topics.filter((item) => item !== null);
      }
      // Loop over the topics of the event
      event.topics.forEach((item) => {
        // Using the topic, identify the event)
        const found = masterMapping[item];
        if (found) {
          if (!Object.keys(insertionMapping).includes(found.abi[0].name)) {
            log.info(
              'Ignoring event',
              found.abi[0].name,
              ', not relevant for syncing',
            );
            return;
          }
          const contractInterface = new ethers.utils.Interface(found.abi);
          log.info(`TRANSACTION CATCHER - Found Event: ${found.signature}`);
          // console.log('Sig', found.signature, 'Data', event.data, 'Topics', event.topics)
          const decodedData = contractInterface.decodeEventLog(
            found.signature,
            event.data,
            event.topics,
          );
          if (found.operation) {
            insertionQueue.push({
              eventData: found,
              operation: found.operation,
              params: [
                dbModels,
                network,
                transactionReceipt,
                found.diamondEvent,
                ...decodedData,
              ],
            });
          }

          foundEvents.push({
            eventSignature: found.signature,
            arguments: decodedData,
            transactionHash: event[transactionHashLabel],
            blockNumber: event.blockNumber,
          });
        }
      });
      return foundEvents;
    });

    if (insertionQueue.length > 0) {
      // Wait until all events are processed to actually insert them on the database
      // eslint-disable-next-line no-restricted-syntax
      for await (const insertion of insertionQueue) {
        // This can be optimized if there are more than one event of the same type
        try {
          await insertion.operation(...insertion.params);
        } catch (err) {
          log.error('Error storing information of event');
          console.log(insertion.eventData);
          log.error(err);
        }
      }
      // Set transaction as fully processed ONLY if there was something to insert, otherwise ignore
      newTransaction.processed = true;
      newTransaction.caught = true;
      await newTransaction.save();
    }
    return result;
  } catch (err) {
    throw Error(err);
  }
};

module.exports = {
  getTransaction,
};
