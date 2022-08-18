const Moralis = require('moralis/node');
const log = require('../utils/logger')(module);
const { logAgendaActionStart } = require('../utils/agenda_action_logger');
const { AgendaTaskEnum } = require('../enums/agenda-task');
const { wasteTime, getTransactionHistory } = require('../utils/logUtils.js');
const { BigNumber } = require('ethers');

const lockLifetime = 1000 * 60 * 5;

module.exports = (context) => {
	// This will receive all logs emitted from a contract in a certain timeframe and process them
	// Which is cheaper than the current approach of each event for each contract
	context.agenda.define(AgendaTaskEnum.SyncAll721Events, { lockLifetime }, async (task, done) => {
		try {
			// Log the start of the task
			await wasteTime(10000);
			logAgendaActionStart({agendaDefinition: AgendaTaskEnum.SyncAll721Events});
			
			// Extract network hash and task name from the task data
			const { network } = task.attrs.data;

			// Find all non-diamond contracts from this blockchain
			let contractsToQuery = await context.db.Contract.find({
				blockchain: network,
				diamond: false,
				external: {$ne: true}
			});

			if (contractsToQuery.length === 0) {
				log.info(`Skipping contract events for ${network}, no contracts to query.`);
				return done();
			}

			// Get network data using the task's blockchain hash
			// This includes minter address and factory address
			const networkData = context.config.blockchain.networks[network];

			// Find contracts that shouldn't be synced
			// TODO Apply restrictions to long term sync
			//let forbiddenContracts = await context.db.SyncRestriction.find({blockchain: network});
			//forbiddenContracts = forbiddenContracts.map(contract => contract.contractAddress.toLowerCase());

			// Fetch Moralis auth data
			const { serverUrl, appId, masterKey } = context.config.blockchain.moralis[networkData.testnet ? 'testnet' : 'mainnet']

			// Initialize moralis instances
			Moralis.start({ serverUrl, appId, masterKey });

			// Get last block parsed from the Versioning collection
			let version = await context.db.Versioning.findOne({ name: AgendaTaskEnum.SyncAll721Events, network });

			if (version === null) {
				version = await (new context.db.Versioning({
					name: AgendaTaskEnum.SyncAll721Events,
					network,
					number: 0,
					running: false
				})).save();
			}

			if (version.running) {
				return done({reason: `A ${AgendaTaskEnum.SyncAll721Events} process for network ${network} is already running!`});
			} else {
				version.running = true;
				version = await version.save();
			}


			/*
				Collection Name 	Description
				------------------------------------------------
				'Contract',			Already synced before this
				'File', 			No need to sync
				'User', 			No need to sync
				'Product', 			Sync from ERC721 (This file)
				'OfferPool', 		Sync from Minter Marketplace
				'Offer', 			Sync from Minter Marketplace
				'MintedToken', 		Sync from Minter Marketplace
				'LockedTokens', 	Sync from ERC721 (This file)
				'Versioning',		No need to Sync
				'Task',				No need to Sync
				'SyncRestriction',	No need to Sync
				'Transaction'		Syncs on every file
			*/

			// Keep track of the latest block number processed
			let transactionArray = [];

			let insertions = {};

			for await (let contract of contractsToQuery) {
				try {
					// To avoid rate limiting errors on Moralis
					await wasteTime(7000);

					if (contract.diamond) {
						// Ignore diamond contracts
						log.info(`[${network}] Ignoring diamonds for now`);
						continue;
					}

					if (!contract.lastSyncedBlock) {
						contract.lastSyncedBlock = 0;
					}
		
					let lastSuccessfullBlock = contract.lastSyncedBlock;

					let processedResult = await getTransactionHistory(contract.contractAddress, network, contract.lastSyncedBlock);

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
						if (filteredTransaction && filteredTransaction.caught && filteredTransaction.toAddress.includes(contract)) {
							log.info(`Ignorning log ${event.transactionHash} because the transaction is already processed for contract ${contract}`);
						} else if (event) {
							if (event.operation) {
								// If the log is already on DB, update the address list
								if (filteredTransaction) {
									filteredTransaction.toAddress.push(contract);
									await filteredTransaction.save();
								} else if (!transactionArray.includes(event.transactionHash)) {
									// Otherwise, push it into the insertion list
									transactionArray.push(event.transactionHash);
									// And create a DB entry right away

									await context.db.Transaction.updateOne({
										_id: event.transactionHash,
										blockchainId: network,
										processed: true,
									}, {
										$push: { toAddress: contract.contractAddress }
									}, { upsert: true })
								}

								try {
									let documentToInsert = await event.operation(
										context.db,
										network,
										// Make up a transaction data, the logs don't include it
										{
											transactionHash: event.transactionHash,
											to: contract.contractAddress,
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
								
							}
						}
						// Update the latest successfull block
						if (lastSuccessfullBlock <= event.blockNumber) {
							lastSuccessfullBlock = event.blockNumber;
						}
					}
					// Add 1 to the last successful block so the next query to Moralis excludes it
					// Because the last successfull block was already processed here
					// But validate that the last parsed block is different from the current one,
					// Otherwise it will keep increasing and could ignore events
					if (contract.lastSyncedBlock < lastSuccessfullBlock) {
						contract.lastSyncedBlock = BigNumber.from(lastSuccessfullBlock).add(1);
						await contract.save();
					}
				} catch (err) {
					log.error(`Found error getting [${network}] - ${contract} events => ${err}`);
					break;
				}
			}
			// Log the number of insertions for each event
			for await (let sig of Object.keys(insertions)) {
				if (insertions[sig]?.length > 0) {
					log.info(`[${network}] Inserted ${insertions[sig]?.length} documents for ${sig}`);
				}
			}

			version.running = false;
			await version.save();

			log.info(`Done with ${network}, ${AgendaTaskEnum.SyncAll721Events}`);

			return done();
		} catch (e) {
			log.error(e);
			return done(e);
		}
	});
};