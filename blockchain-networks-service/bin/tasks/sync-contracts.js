const Moralis = require('moralis/node');
const log = require('../utils/logger')(module);
const { logAgendaActionStart } = require('../utils/agenda_action_logger');
const { AgendaTaskEnum } = require('../enums/agenda-task');
const { processLog, wasteTime, getTransactionHistory } = require('../utils/logUtils.js');
const { BigNumber } = require('ethers');

const lockLifetime = 1000 * 60 * 5;

module.exports = (context) => {
	// This will receive all logs emitted from a contract in a certain timeframe and process them
	// Which is cheaper than the current approach of each event for each contract
	context.agenda.define(AgendaTaskEnum.SyncContracts, { lockLifetime }, async (task, done) => {
		try {
			// Log the start of the task
			wasteTime(10000);
			logAgendaActionStart({agendaDefinition: AgendaTaskEnum.SyncContracts});
			
			// Extract network hash and task name from the task data
			const { network, name } = task.attrs.data;

			// Get network data using the task's blockchain hash
			// This includes minter address and factory address
			const networkData = context.config.blockchain.networks[network];

			if (!networkData.factoryAddress) {
				log.info(`Skipping classic deployment events of ${network}, factory address is not defined.`);
				return done();
			}
			// Find previous master factories
			let contractsToQuery = await context.db.PastAddress.find({
				contractType: 'factory',
				blockchain: network,
				diamond: false
			}).distinct('address');

			if (!contractsToQuery.includes(networkData.factoryAddress)) {
				await (new context.db.PastAddress({
					contractType: 'factory',
					blockchain: network,
					diamond: false,
					address: networkData.factoryAddress
				})).save();
				log.info(`Added a new Factory address for ${network}`);
				contractsToQuery.push(networkData.factoryAddress);
			}

			log.info(`[${network}] Querying the events of ${contractsToQuery.length} factories`);

			// Fetch Moralis auth data
			const { serverUrl, appId, masterKey } = context.config.blockchain.moralis[networkData.testnet ? 'testnet' : 'mainnet']

			// Initialize moralis instances
			Moralis.start({ serverUrl, appId, masterKey });

			// Get last block parsed from the Versioning collection
			let version = await context.db.Versioning.findOne({ name: AgendaTaskEnum.SyncContracts, network });

			if (version === null) {
				version = await (new context.db.Versioning({
					name: AgendaTaskEnum.SyncContracts,
					network,
					number: 0,
					running: false
				})).save();
			}

			if (version.running === true) {
				return done({reason: `A ${AgendaTaskEnum.SyncContracts} process for network ${network} is already running!`});
			} else {
				version.running = true;
				version = await version.save();
			}

			/*
				Collection Name 	Description
				------------------------------------------------------------
				'Contract',			Deployed contracts (This file)
				'File', 			No need to sync
				'User', 			No need to sync
				'Product', 			From ERC721 Contracts
				'OfferPool', 		Sync from Minter Marketplace
				'Offer', 			Sync from Minter Marketplace
				'MintedToken', 		Sync from Minter Marketplace
				'LockedTokens', 	From ERC721 Contracts
				'Versioning',		No need to Sync
				'Task',				No need to Sync
				'SyncRestriction',	No need to Sync
				'Transaction'		Syncs on every file
			*/

			// Keep track of the latest block number processed
			let lastSuccessfullBlock = BigNumber.from(version.number);
			let transactionArray = [];
			let insertions = {};

			for await (let masterFactory of contractsToQuery) {
				let processedResult = await getTransactionHistory(masterFactory, network, version.number);

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
					if (filteredTransaction && filteredTransaction.caught && filteredTransaction.toAddress.includes(masterFactory)) {
						log.info(`Ignorning log ${event.transactionHash} because the transaction is already processed for contract ${masterFactory}`);
					} else {
						if (event && event.operation) {
							// If the log is already on DB, update the address list
							if (filteredTransaction) {
								filteredTransaction.toAddress.push(masterFactory);
								await filteredTransaction.save();
							} else if (!transactionArray.includes(event.transactionHash)) {
								// Otherwise, push it into the insertion list
								transactionArray.push(event.transactionHash);
								// And create a DB entry right away
								try {
									await (new context.db.Transaction({
										_id: event.transactionHash,
										toAddress: masterFactory,
										processed: true,
										blockchainId: network
									})).save();
								} catch (error) {
									log.error(`There was an issue saving transaction ${event.transactionHash} for contract ${masterFactory}: ${error}`);
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
										to: masterFactory,
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
			}

			for await (let sig of Object.keys(insertions)) {
				if (insertions[sig]?.length > 0) {
					log.info(`[${network}] Inserted ${insertions[sig]?.length} documents for ${sig}`);
				}
			}

			log.info(`Done with ${network}, ${AgendaTaskEnum.SyncContracts}`);

			// Add 1 to the last successful block so the next query to Moralis excludes it
			// Because the last successfull block was already processed here
			// But validate that the last parsed block is different from the current one,
			// Otherwise it will keep increasing and could ignore events
			version.running = false;
			if (lastSuccessfullBlock.gte(version.number)) {
				version.number = lastSuccessfullBlock.add(1).toString();
			}
			await version.save()

			return done();
		} catch (e) {
			log.error(e);
			return done(e);
		}
	});
};