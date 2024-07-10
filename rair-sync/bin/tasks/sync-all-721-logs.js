const { BigNumber } = require('ethers');
const log = require('../utils/logger')(module);
const { AgendaTaskEnum } = require('../enums/agenda-task');
const {
  wasteTime,
  getTransactionHistoryWithAlchemy,
  getTransactionHistoryWithRPC,
  getLatestBlock,
} = require('../utils/logUtils');
const { Contract, Versioning, Blockchain } = require('../models');
const { processLogEvents } = require('../utils/reusableTransactionHandler');

const lockLifetime = 1000 * 60 * 5;
const taskName = AgendaTaskEnum.SyncAll721Events;

module.exports = (context) => {
  // This will receive all logs emitted from a contract in a certain timeframe and process them
  // Which is cheaper than the current approach of each event for each contract
  context.agenda.define(
    taskName,
    { lockLifetime },
    async (task, done) => {
      try {
        // Log the start of the task
        await wasteTime(10000);
        // Log the start of the task
        log.info(`Agenda action starting: ${taskName}`);

        // Extract network hash and task name from the task data
        const { network } = task.attrs.data;
        const blockchainData = await Blockchain.findOne({ hash: network });
        if (!blockchainData || blockchainData?.sync.toString() === 'false') {
          log.info(`[${network}] Skipping ${taskName} events, syncing is disabled.`);
          return done();
        }
        // Find all non-diamond contracts from this blockchain
        const contractsToQuery = await Contract.find({
          blockchain: network,
          diamond: false,
          external: { $ne: true },
          blockSync: false, // only actual change to allow new sync restrction
        });

        if (contractsToQuery.length === 0) {
          log.info(
            `Skipping contract events for ${network}, no contracts to query.`,
          );
          return done();
        }

        // Get last block parsed from the Versioning collection
        let version = await Versioning.findOne({
          name: taskName,
          network,
        });

        if (version === null) {
          version = await new Versioning({
            name: taskName,
            network,
            number: 0,
            running: false,
          }).save();
        }

        if (version.running) {
          return done({
            reason: `A ${taskName} process for network ${network} is already running!`,
          });
        }
        version.running = true;
        version = await version.save();

        /*
        Collection Name   Description
        ------------------------------------------------
        'Contract',         Already synced before this
        'File',             No need to sync
        'User',             No need to sync
        'Product',          Sync from ERC721 (This file)
        'OfferPool',        Sync from Minter Marketplace
        'Offer',            Sync from Minter Marketplace
        'MintedToken',      Sync from Minter Marketplace
        'LockedTokens',     Sync from ERC721 (This file)
        'Versioning',       No need to Sync
        'Task',             No need to Sync
        'SyncRestriction',  No need to Sync
        'Transaction'       Syncs on every file
        */

        let transactionArray = [];

        // Keep track of the latest block number processed
        const latestBlock = await getLatestBlock(network);

        const insertions = {};

        // The contracts don't need to be processed in order
        // But to prevent any issues with rate limiting, it's recommended that we
        //  process them serially
        // eslint-disable-next-line no-restricted-syntax
        for await (const contract of contractsToQuery) {
          try {
            // To avoid rate limiting errors on Alchemy
            await wasteTime(7000);

            if (contract.diamond) {
              // Ignore diamond contracts
              log.info(`[${network}] Ignoring diamonds for now`);
              // eslint-disable-next-line no-continue
              continue;
            }

            if (!contract.lastSyncedBlock) {
              contract.lastSyncedBlock = 0;
            }
            if (latestBlock < contract.lastSyncedBlock) {
              log.error(`ERROR: Contract ${contract.contractAddress}'s latest block is ${contract.lastSyncedBlock} but the last mined block from ${network} is ${latestBlock}, the contract's last synced block will be reset to 0, expect a lot of duplicate transaction messages!`);
              contract.lastSyncedBlock = 0;
            }

            let lastSuccessfullBlock = contract.lastSyncedBlock;

            const syncingFunction = blockchainData.alchemySupport
              ? getTransactionHistoryWithAlchemy
              : getTransactionHistoryWithRPC;

            const processedResult = await syncingFunction(
              contract.contractAddress,
              blockchainData,
              contract.lastSyncedBlock,
            );

            // The events HAVE to be processed in order
            // eslint-disable-next-line no-restricted-syntax
            for await (const [event] of processedResult) {
              const result = await processLogEvents(
                event,
                network,
                contract.contractAddress,
                transactionArray,
              );
              // Result
              /*
                transactionArray: [...processedTransactions],
                insertions: {},
                lastSuccessfullBlock: 0,
              */
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
                if (lastSuccessfullBlock < result.lastSuccessfullBlock) {
                  lastSuccessfullBlock = result.lastSuccessfullBlock;
                }
              }
            }
            // Add 1 to the last successful block so the next query to Alchemy excludes it
            // Because the last successfull block was already processed here
            // But validate that the last parsed block is different from the current one,
            // Otherwise it will keep increasing and could ignore events
            if (contract.lastSyncedBlock < lastSuccessfullBlock) {
              contract.lastSyncedBlock =
                BigNumber.from(lastSuccessfullBlock).add(1);
              await contract.save();
            }
          } catch (err) {
            log.error(
              `Found error getting [${network}] - ${contract} events => ${err}`,
            );
            break;
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

        version.running = false;
        await version.save();

        log.info(`[${network}], ${taskName} complete`);

        return done();
      } catch (e) {
        log.error(e);
        return done(e);
      }
    },
  );
};
