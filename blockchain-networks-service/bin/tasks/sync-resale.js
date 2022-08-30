const Moralis = require('moralis/node');
const log = require('../utils/logger')(module);
const { logAgendaActionStart } = require('../utils/agenda_action_logger');
const { AgendaTaskEnum } = require('../enums/agenda-task');
const { wasteTime, getTransactionHistory } = require('../utils/logUtils.js');
const { BigNumber } = require('ethers');

const lockLifetime = 1000 * 60 * 5;

module.exports = (context) => {
	// This will receive all logs emitted from the classic minter marketplace in a certain timeframe and process them
	context.agenda.define(AgendaTaskEnum.SyncResaleMarketplaceEvents, { lockLifetime }, async (task, done) => {
		try {
			wasteTime(10000);
			// Log the start of the task
			logAgendaActionStart({agendaDefinition: AgendaTaskEnum.SyncResaleMarketplaceEvents});
			
			// Extract network hash and task name from the task data
			const { network } = task.attrs.data;

			// Get network data using the task's blockchain hash
			// This includes minter address and factory address
			const networkData = context.config.blockchain.networks[network];

			if (!networkData.resaleMarketplaceAddress) {
				log.info(`Skipping ${network}, resale marketplace address is not defined.`);
				return done();
			}

			// Fetch Moralis auth data
			const { serverUrl, appId, masterKey } = context.config.blockchain.moralis[networkData.testnet ? 'testnet' : 'mainnet']

			// Initialize moralis instances
			Moralis.start({ serverUrl, appId, masterKey });

			// Get last block parsed from the Versioning collection
			let version = await context.db.Versioning.findOne({ name: AgendaTaskEnum.SyncResaleMarketplaceEvents, network });

			if (version === null) {
				version = await (new context.db.Versioning({
					name: AgendaTaskEnum.SyncResaleMarketplaceEvents,
					network,
					number: 0
				})).save();
			}

			/*
				Collection Name 	Description
				------------------------------------------------------------
				'Contract',				Already synced
				'File', 				No need to sync
				'User', 				No need to sync
				'Product', 				Already synced
				'OfferPool', 			Already synced
				'Offer', 				Already synced
				'MintedToken', 			Already synced
				'LockedTokens', 		Already synced
				'Versioning',			No need to Sync
				'Task',					No need to Sync
				'SyncRestriction',		No need to Sync
				'Transaction'			Syncs on every file
				/// NEW
				'CustomRoyaltiesSet'	This file
				'ResaleTokenOffer'		This file
			*/

			let processedTransactions = await context.db.Transaction.find({
				blockchainId: network,
				processed: true
			});

			// Keep track of the latest block number processed
			let lastSuccessfullBlock = BigNumber.from(version.number);
			let transactionArray = [];

			let processedResult = await getTransactionHistory(networkData.resaleMarketplaceAddress, network, version.number);

			let insertions = {};

			for await (let [event] of processedResult) {
				if (!event) {
					continue;
				}
				let [filteredTransaction] = processedTransactions.filter(item => item._id === event.transactionHash);
				if (filteredTransaction && filteredTransaction.caught && filteredTransaction.toAddress.includes(networkData.resaleMarketplaceAddress)) {
					log.info(`[${network}] Ignorning log ${event.transactionHash} because the transaction is already processed for contract ${networkData.resaleMarketplaceAddress}`);
				} else {
					if (event && event.operation) {
						// If the log is already on DB, update the address list
						if (filteredTransaction) {
							filteredTransaction.toAddress.push(networkData.resaleMarketplaceAddress);
							await filteredTransaction.save();
						} else if (!transactionArray.includes(event.transactionHash)) {
							// Otherwise, push it into the insertion list
							transactionArray.push(event.transactionHash);
							// And create a DB entry right away
							try {
								await (new context.db.Transaction({
									_id: event.transactionHash,
									toAddress: networkData.resaleMarketplaceAddress,
									processed: true,
									blockchainId: network
								})).save();
							} catch (error) {
								log.error(`There was an issue saving transaction ${event.transactionHash} for contract ${networkData.diamondMarketplaceAddress}: ${error}`);
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
									to: networkData.resaleMarketplaceAddress,
									blockNumber: event.blockNumber
								},
								true,
								...event.arguments
							);
							// This used to be for an optimized batch insertion, now it's just for logging
							if (insertions[event.eventSignature] === undefined) {
								insertions[event.eventSignature] = [];
							}
							insertions[event.eventSignature].push(documentToInsert);
						} catch (err) {
							console.error('An error has ocurred!', event);
							continue;
						}
					}
				}
				// Update the latest successfull block
				if (lastSuccessfullBlock.lte(event.blockNumber)) {
					lastSuccessfullBlock = BigNumber.from(event.blockNumber);
				}
			}
			for await (let sig of Object.keys(insertions)) {
				if (insertions[sig]?.length > 0) {
					log.info(`Inserted ${insertions[sig]?.length} documents for ${sig}`);
				}
			}

			log.info(`Done with ${network}, ${AgendaTaskEnum.SyncResaleMarketplaceEvents}`);

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