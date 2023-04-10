/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
const { BigNumber } = require('ethers');
const log = require('../utils/logger')(module);
const { logAgendaActionStart } = require('../utils/agenda_action_logger');
const { AgendaTaskEnum } = require('../enums/agenda-task');
const {
  wasteTime,
  getTransactionHistory,
  getLatestBlock,
} = require('../utils/logUtils');
const { Contract, Versioning, Transaction } = require('../models');

const lockLifetime = 1000 * 60 * 5;

module.exports = (context) => {
  // This will receive all logs emitted from a contract in a certain timeframe and process them
  // Which is cheaper than the current approach of each event for each contract
  context.agenda.define(
    AgendaTaskEnum.SyncAllDiamond721Events,
    { lockLifetime },
    async (task, done) => {
      try {
        // Log the start of the task
        await wasteTime(10000);
        logAgendaActionStart({
          agendaDefinition: AgendaTaskEnum.SyncAllDiamond721Events,
        });

        // Extract network hash and task name from the task data
        const { network } = task.attrs.data;

        // Find all diamond contracts from this blockchain
        const contractsToQuery = await Contract.find({
          blockchain: network,
          diamond: true,
          external: { $ne: true },
          blockSync: false, // only actual change to allow new sync restrction
        });

        if (contractsToQuery.length === 0) {
          log.info(
            `Skipping diamond contracts of ${network}, there are no contracts`,
          );
          return done();
        }

        // TODO Implement blacklisted contracts
        // Find contracts that shouldn't be synced

        // Get last block parsed from the Versioning collection
        let version = await Versioning.findOne({
          name: AgendaTaskEnum.SyncAllDiamond721Events,
          network,
        });

        if (version === null) {
          version = await new Versioning({
            name: AgendaTaskEnum.SyncAllDiamond721Events,
            network,
            number: 0,
          }).save();
        }

        /*
        Collection Name   Description
        ------------------------------------------------
        'Contract',         Already synced before this
        'File',             No need to sync
        'User',             No need to sync
        'Product',          Sync from Diamond ERC721 (This file)
        'OfferPool',        Does not exist in diamonds
        'Offer',            Sync from Diamond ERC721 (This file)
        'MintedToken',      Sync from Minter Marketplace
        'LockedTokens',     Sync from Diamond ERC721 (This file)
        'Versioning',       No need to Sync
        'Task',             No need to Sync
        'SyncRestriction',  No need to Sync
        'Transaction'       Syncs on every file
        */

        // Keep track of the latest block number processed
        const lastSuccessfullBlock = version.number;
        const transactionArray = [];

        const latestBlock = await getLatestBlock(network);

        const insertions = {};

        for await (const contract of contractsToQuery) {
          // To avoid rate limiting errors on Alchemy I wait X seconds to parse data
          await wasteTime(7000);

          if (!contract.lastSyncedBlock) {
            contract.lastSyncedBlock = 0;
          }
          if (latestBlock < contract.lastSyncedBlock) {
            log.error(`ERROR: Contract ${contract.contractAddress}'s latest block is ${contract.lastSyncedBlock} but the last mined block from ${network} is ${latestBlock}, the contract's last synced block will be reset to 0, expect a lot of duplicate transaction messages!`);
            contract.lastSyncedBlock = 0;
          }

          let lastSuccessfullBlock = contract.lastSyncedBlock;

          const processedResult = await getTransactionHistory(
            contract.contractAddress,
            network,
            contract.lastSyncedBlock,
          );

          for await (const [event] of processedResult) {
            if (!event) {
              continue;
            }
            const filteredTransaction = await Transaction.findOne({
              _id: event.transactionHash,
              blockchainId: network,
              processed: true,
              caught: true,
            });
            if (
              filteredTransaction &&
              filteredTransaction.caught &&
              filteredTransaction.toAddress.includes(contract)
            ) {
              log.info(
                `Ignorning log ${event.transactionHash} because the transaction is already processed for contract ${contract}`,
              );
            } else if (event && event.operation) {
              // If the log is already on DB, update the address list
              if (filteredTransaction) {
                filteredTransaction.toAddress.push(contract);
                await filteredTransaction.save();
              } else if (!transactionArray.includes(event.transactionHash)) {
                // Otherwise, push it into the insertion list
                transactionArray.push(event.transactionHash);
                // And create a DB entry right away
                try {
                  await new Transaction({
                    _id: event.transactionHash,
                    toAddress: contract.contractAddress,
                    processed: true,
                    blockchainId: network,
                  }).save();
                } catch (error) {
                  log.error(
                    `There was an issue saving transaction ${event.transactionHash} for contract ${contract.contractAddress}: ${error}`,
                  );
                  continue;
                }
              }

              // Try to do the insertions
              try {
                const documentToInsert = await event.operation(
                  context.db,
                  network,
                  // Make up a transaction data, the logs don't include it
                  {
                    transactionHash: event.transactionHash,
                    to: contract.contractAddress,
                    blockNumber: event.blockNumber,
                  },
                  true,
                  ...event.arguments,
                );
                  // This used to be for an optimized batch insertion, now it's just for logging
                if (insertions[event.eventSignature] === undefined) {
                  insertions[event.eventSignature] = [];
                }
                insertions[event.eventSignature].push(documentToInsert);
              } catch (err) {
                console.error('An error has ocurred!', event, err);
                continue;
              }
            }

            // Update the latest successfull block
            if (lastSuccessfullBlock <= event.blockNumber) {
              lastSuccessfullBlock = event.blockNumber;
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
        }
        for await (const sig of Object.keys(insertions)) {
          if (insertions[sig]?.length > 0) {
            log.info(
              `[${network}] Inserted ${insertions[sig]?.length} documents for ${sig}`,
            );
          }
        }

        log.info(
          `Done with ${network}, ${AgendaTaskEnum.SyncAllDiamond721Events}`,
        );

        version.running = false;
        version.number = lastSuccessfullBlock;
        await version.save();

        return done();
      } catch (e) {
        log.error(e);
        return done(e);
      }
    },
  );
};
