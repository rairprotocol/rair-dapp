const Moralis = require('moralis/node');
const log = require('../utils/logger')(module);
const { logAgendaActionStart } = require('../utils/agenda_action_logger');
const { AgendaTaskEnum } = require('../enums/agenda-task');
const { processLog, wasteTime, getTransactionHistory } = require('../utils/logUtils.js');
const { BigNumber } = require('ethers');

const lockLifetime = 1000 * 60 * 5;

module.exports = (context) => {
	// This will receive all logs emitted from the classic minter marketplace in a certain timeframe and process them
	context.agenda.define(AgendaTaskEnum.SyncClassicMarketplaceEvents, { lockLifetime }, async (task, done) => {
		try {
			// Log the start of the task
			wasteTime(10000);
			logAgendaActionStart({agendaDefinition: AgendaTaskEnum.SyncClassicMarketplaceEvents});
			
			// Extract network hash and task name from the task data
			const { network, name } = task.attrs.data;

			// Get network data using the task's blockchain hash
			// This includes minter address and factory address
			const networkData = context.config.blockchain.networks[network];

			if (!networkData.minterAddress) {
				log.info(`Skipping classic marketplace events of ${network}, marketplace address is not defined.`);
				return done();
			}

			let forbiddenTokenSyncs = await context.db.SyncRestriction.find({
				blockchain: network, tokens: false
			}).distinct('contractAddress');
			forbiddenTokenSyncs = forbiddenTokenSyncs.map(contract => contract.toLowerCase());

			// Fetch Moralis auth data
			const { serverUrl, appId, masterKey } = context.config.blockchain.moralis[networkData.testnet ? 'testnet' : 'mainnet']

			// Initialize moralis instances
			Moralis.start({ serverUrl, appId, masterKey });

			// Get last block parsed from the Versioning collection
			let version = await context.db.Versioning.findOne({ name: AgendaTaskEnum.SyncClassicMarketplaceEvents, network });

			if (version === null) {
				version = await (new context.db.Versioning({
					name: AgendaTaskEnum.SyncClassicMarketplaceEvents,
					network,
					number: 0
				})).save();
			}

			if (version.running) {
				return done({reason: `A ${AgendaTaskEnum.SyncClassicMarketplaceEvents} process for network ${network} is already running!`});
			} else {
				version.running = true;
				version = await version.save();
			}

			/*
				Collection Name 	Description
				------------------------------------------------------------
				'Contract',			Already synced before this
				'File', 			No need to sync
				'User', 			No need to sync
				'Product', 			Already synced before this
				'OfferPool', 		Sync from Minter Marketplace (This file)
				'Offer', 			Sync from Minter Marketplace (This file)
				'MintedToken', 		Sync from Minter Marketplace (This file)
				'LockedTokens', 	Already synced before this
				'Versioning',		No need to Sync
				'Task',				No need to Sync
				'SyncRestriction',	No need to Sync
				'Transaction'		Syncs on every file
			*/

			// Keep track of the latest block number processed
			let lastSuccessfullBlock = BigNumber.from(version.number);
			let transactionArray = [];
			
			let processedResult = await getTransactionHistory(networkData.minterAddress, network, version.number);
			if (processedResult.length === 0) {
				return done();
			}

			let insertions = {};

			for await (let [event] of processedResult) {
				if (!event) {
					continue;
				}
				let filteredTransaction = await context.db.Transaction.findOne({
					_id: event.transactionHash,
					blockchainId: network,
					processed: true,
					caught: true
				});
				if (filteredTransaction && filteredTransaction.caught && filteredTransaction.toAddress.includes(networkData.minterAddress)) {
					log.info(`Ignorning log ${event.transactionHash} because the transaction is already processed for contract ${networkData.minterAddress}`);
				} else {
					if (event && event.operation) {
						// If the log is already on DB, update the address list
						if (filteredTransaction) {
							filteredTransaction.toAddress.push(networkData.minterAddress);
							await filteredTransaction.save();
						} else if (!transactionArray.includes(event.transactionHash)) {
							// Otherwise, push it into the insertion list
							transactionArray.push(event.transactionHash);
							// And create a DB entry right away
							try {
								await (new context.db.Transaction({
									_id: event.transactionHash,
									toAddress: networkData.minterAddress,
									processed: true,
									blockchainId: network
								})).save();
							} catch (error) {
								log.error(`There was an issue saving transaction ${event.transactionHash} for contract ${networkData.minterAddress}: ${error}`);
								continue;
							}
						}

						try {
							let documentToInsert = await event.operation(
								context.db,
								network,
								// Make up a transaction data, the logs don't include it
								{
									transactionHash: event.transactionHash,
									to: networkData.factoryAddress,
									blockNumber: event.blockNumber
								},
								event.diamondEvent,
								...event.arguments
							);
							// This used to be for an optimized batch insertion, now it's just for logging
							if (insertions[event.eventSignature] === undefined) {
								insertions[event.eventSignature] = [];
							}
							insertions[event.eventSignature].push(documentToInsert);
						} catch (err) {
							console.error('An error has ocurred!', event);
							throw err;
						}

						// Update the latest successfull block
						if (lastSuccessfullBlock.lte(event.blockNumber)) {
							lastSuccessfullBlock = BigNumber.from(event.blockNumber);
						}
					}
				}
			}
			for await (let sig of Object.keys(insertions)) {
				if (insertions[sig]?.length > 0) {
					log.info(`[${network}] Inserted ${insertions[sig]?.length} documents for ${sig}`);
				}
			}

			log.info(`Done with ${network}, ${AgendaTaskEnum.SyncClassicMarketplaceEvents}`);

			// Add 1 to the last successful block so the next query to Moralis excludes it
			// Because the last successfull block was already processed here
			// But validate that the last parsed block is different from the current one,
			// Otherwise it will keep increasing and could ignore events
			version.running = false;
			if (lastSuccessfullBlock.gte(version.number)) {
				version.number = lastSuccessfullBlock.add(1).toString();
			}
			await version.save();

			return done();
			
		} catch (e) {
			log.error(e);
			return done(e);
		}
	});
};