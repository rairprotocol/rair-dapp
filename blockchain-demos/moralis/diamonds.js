const Moralis = require('moralis/node');
require('dotenv').config();
const { diamondFactoryAbi } = require('./ABI');
const { getABIData } = require('./utils');

const main = async () => {

	const serverUrl = process.env.MORALIS_SERVER_TEST;
	const appId = process.env.MORALIS_API_KEY_TEST;
	const masterKey = process.env.MORALIS_MASTER_KEY; 
	Moralis.start({ serverUrl, appId, masterKey });

	let deploymentEvent = getABIData(diamondFactoryAbi, 'event', 'NewContractDeployed');
	let syncDeployments = {
		"topic": deploymentEvent.topic,
		"abi": deploymentEvent.abi,
		"tableName": "GoerliDeployments",
		"sync_historical": true,
		"chainId": '0x13881',
		"address": "0xbB236Ce48dDCb58adB8665E220FE976bA5d080a5"
	};

	//console.log(await Moralis.Cloud.run("watchContractEvent", syncDeployments, { useMasterKey: true }));

	const EventSync = Moralis.Object.extend("EventSync");
	const eventSync = new EventSync();
	eventSync.set("abi", JSON.stringify(deploymentEvent.abi));
	eventSync.set("sync_historical", true);
	eventSync.set("topic", deploymentEvent.topic);
	eventSync.set("address", "0xbB236Ce48dDCb58adB8665E220FE976bA5d080a5");
	eventSync.set("chainId", '0x13881');
	eventSync.set("tableName", 'GoerliDeployments');
	//console.log(await eventSync.save({ useMasterKey: true }));

	/*
	Object.keys(blockchainData).forEach(async blockchain => {
		if (!blockchainData[blockchain].testnet) {
			return;
		}
		console.log(`Validating ${blockchain}`);
		// Queries a factory and stores all deployed contracts
		await getDeployedContracts(blockchainData[blockchain].factoryAddress, blockchain).catch(console.error);
		// Gets the Products from all Deployed Contracts
		await getProducts(blockchain).catch(console.error);
		// Gets the Offers (OfferPool) created
		await getOfferPools(blockchainData[blockchain].minterAddress, blockchain).catch(console.error);
		// Gets the ranges appended on the minter marketplace
		await getAppendedRanges(blockchainData[blockchain].minterAddress, blockchain).catch(console.error);
		// Gets all token transfers made on all deployed contracts
		await getTokenTransfers(blockchain).catch(console.error);
		// Gets all custom payments set on the minter marketplace
		await getCustomPayments(blockchainData[blockchain].minterAddress, blockchain).catch(console.error);
		console.log(`Done with ${blockchain}!`);
	});
	*/

	// Gets the topics of the contract. Useless now that getABIData exists
	//logEventTopics();
	// Returns the ABI entry and the Event's hash (topic) so Moralis can use it
	//getABIData(erc721Abi, 'event', 'ProductCreated');
}

try {
	main();
} catch (err) {
	console.error(err);
}