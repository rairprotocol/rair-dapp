const Moralis = require('moralis/node');
const Ethers = require('ethers');
require('dotenv').config();
const {erc721Abi, minterAbi, factoryAbi, erc777Abi} = require('./ABI');

const blockchainData = {
	mumbai: {
		chainId: '0x13881', 
		factoryAddress: '0x1A5bf89208Dddd09614919eE31EA6E40D42493CD',
		minterAddress: '0x63Dd6821D902012B664dD80140C54A98CeE97068',
		watchFunction: 'watchPolygonAddress',
		watchCollection: 'watchedPolygonAddress'
	}
}

const getEventData = (abi, eventName) => {
	const [eventAbi] = abi.filter(item => {
		return item.type === 'event' && item.name === eventName
	})
	const instance = new Ethers.Contract(Ethers.constants.AddressZero, abi);
	const [topic] = Object.keys(instance.filters).filter(item => item.includes(`${eventName}(`)).map(item => {
		return Ethers.utils.id(item);
	});
	return {eventAbi, topic};
};

const getDeployedContracts = async (factoryAddress, chainName) => {
	const {eventAbi, topic} = getEventData(factoryAbi, 'NewContractDeployed');
	const options = {
		address: factoryAddress,
		chain: blockchainData[chainName].chainId,
		topic,
		abi: eventAbi
	}
	let events = await Moralis.Web3API.native.getContractEvents(options);
	events.result.forEach(async result => {
		const deployedAddress = Moralis.Object.extend("deployedAddress");
		const deployedQuery = new Moralis.Query(deployedAddress);
		deployedQuery.equalTo('transactionHash', result.transaction_hash);
		const deployedResults = await deployedQuery.find();
		if (deployedResults.length === 0) {
			const address = new deployedAddress();
			address.set("factoryAddress", result.address);
			address.set("transactionHash", result.transaction_hash);
			address.set("chainId", blockchainData[chainName].chainId);
			address.set("owner", result.data.owner);
			address.set("indexOfOwner", result.data.uid);
			address.set("deployedAddress", result.data.token);
			await address.save();
			// Listen to this contract's events
			console.log(`[${chainName}] Saved contract #${result.data.uid} of ${result.data.owner}`);
			await Moralis.Cloud.run(blockchainData[chainName].watchFunction, {
				address: result.data.token.toLowerCase(),
				'sync_historical': true
			});
		}
	})
}

const getProducts = async () => {
	const WatchedAddresses = Moralis.Object.extend("WatchedPolygonAddress");
	const query = new Moralis.Query(WatchedAddresses); 
	const results = await query.find();
	const {eventAbi, topic} = getEventData(erc721Abi, 'ProductCreated');
	const generalOptions = {
		chain: "mumbai",
		topic,
		abi: eventAbi
	};
	results.forEach(
		async item => {
			const options = {
				address: item.get('address'),
				...generalOptions
			}
			let events = await Moralis.Web3API.native.getContractEvents(options);
			events.result.forEach(async result => {
				const Product = Moralis.Object.extend("Product");
				const productQuery = new Moralis.Query(Product);
				productQuery.equalTo('transactionHash', result.transaction_hash);
				const productResults = await productQuery.find();
				if (productResults.length === 0) {
					const product = new Product();
					product.set("contractAddress", result.address);
					product.set("transactionHash", result.transaction_hash);
					product.set("productId", result.data.uid);
					product.set("productName", result.data.name);
					product.set("productStartingToken", result.data.startingToken);
					product.set("productLength", result.data.length);
					product.set("productEndingToken", (Ethers.BigNumber.from(result.data.length).add(result.data.startingToken)).toString());
					product.set("chainId", '0x13881');
					await product.save();
					console.log('Saved product', result.data.uid, 'of', result.address);
				}
			})
		});
}

const logEventTopics = async () => {
	let factoryInstance = await new Ethers.Contract(Ethers.constants.AddressZero, factoryAbi);
	let tokenInstance = await new Ethers.Contract(Ethers.constants.AddressZero, erc721Abi);
	let minterInstance = await new Ethers.Contract(Ethers.constants.AddressZero, minterAbi);
	console.log('Factory');
	Object.keys(factoryInstance.filters).filter(item => item.includes('(')).forEach(item => console.log(item, Ethers.utils.id(item)));
	console.log('Minter');
	Object.keys(minterInstance.filters).filter(item => item.includes('(')).forEach(item => console.log(item, Ethers.utils.id(item)));
	console.log('Token');
	Object.keys(tokenInstance.filters).filter(item => item.includes('(')).forEach(item => console.log(item, Ethers.utils.id(item)));
}

const main = async () => {
	const serverUrl = process.env.MORALIS_SERVER;
	const appId = process.env.MORALIS_API_KEY;
	Moralis.start({ serverUrl, appId });


	/*
	console.log('Minter');
	let events = await Moralis.Web3API.native.getContractEvents(options)
		.catch(err => console.error(err.error));
	events.result.forEach(async item => {
		console.log(item.data.token)
		await Moralis.Cloud.run('watchPolygonAddress', { address: item.data.token.toLowerCase(), 'sync_historical': true });
	});
	*/

	// Gets the Products from all Watched Contracts
	//getProducts();
	
	// Gets the topics of the contract
	//logEventTopics();
	
	// Returns the ABI entry and the Event's hash (topic) so Moralis can use it
	//getEventData(erc721Abi, 'ProductCreated')

	// Queries a factory and stores all deployed contracts
	//getDeployedContracts(blockchainData.mumbai.factoryAddress, 'mumbai');
}

try {
	main();
} catch (err) {
	console.error(err);
}