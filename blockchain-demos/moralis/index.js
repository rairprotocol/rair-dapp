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

const getABIData = (abi, type, eventName) => {
	const [resultingAbi] = abi.filter(item => {
		return item.type === type && item.name === eventName
	})
	const instance = new Ethers.Contract(Ethers.constants.AddressZero, abi);
	const [topic] = Object.keys(instance.filters).filter(item => item.includes(`${eventName}(`)).map(item => {
		return Ethers.utils.id(item);
	});
	return {abi: resultingAbi, topic};
};

const getAppendedRanges = async (minterAddress, chainName) => {
	await Moralis.Cloud.run(blockchainData[chainName].watchFunction, {
		address: minterAddress,
		'sync_historical': true
	});

	const {abi, topic} = getABIData(minterAbi, 'event', 'AppendedRange');
	const options = {
		address: minterAddress,
		chain: blockchainData[chainName].chainId,
		topic,
		abi
	}
	let events = await Moralis.Web3API.native.getContractEvents(options);
	events.result.forEach(async result => {
		const Offer = Moralis.Object.extend("Offer");
		const offerQuery = new Moralis.Query(Offer);
		offerQuery.equalTo('transactionHash', result.transaction_hash);
		const offerResult = await offerQuery.find();
		if (offerResult.length === 0) {

			const offer = new Offer();
			offer.set('transactionHash', result.transaction_hash);
			offer.set('blockchain', blockchainData[chainName].chainId);
			offer.set('minterAddress', result.address);

			offer.set('offerIndex', result.data.rangeIndex);
			offer.set('contract', result.data.contractAddress);
			offer.set('product', result.data.productIndex);
			offer.set('offerPool', result.data.offerIndex);
			offer.set('copies', (Ethers.BigNumber.from(result.data.endToken).sub(result.data.startToken)).toString());
			offer.set('soldCopies', 0);
			offer.set('sold', false);
			offer.set('price', result.data.price);
			offer.set('range', [result.data.startToken, result.data.endToken]);
			offer.set('name', result.data.name);

			await offer.save();
			console.log(`[${chainName}] Saved Offer #${result.data.rangeIndex} of pool ${result.data.offerIndex}`);

			const OfferPool = Moralis.Object.extend("OfferPool");
			const offerPoolQuery = new Moralis.Query(OfferPool);
			offerPoolQuery.equalTo('minterAddress', result.address);
			offerPoolQuery.equalTo('blockchain', blockchainData[chainName].chainId);
			offerPoolQuery.equalTo('marketplaceCatalogIndex', result.data.offerIndex);
			const [offerPoolResult] = await offerPoolQuery.find();

			if (offerPoolResult && offerPoolResult.get('transactionHash') !== result.transaction_hash) {
				offerPoolResult.set('rangeNumber', (Ethers.BigNumber.from(offerPoolResult.get('rangeNumber')).add(1)).toString());
				console.log(`[${chainName}] Updated offer count of pool ${offerPoolResult.get('marketplaceCatalogIndex')}`);
				await offerPoolResult.save();
			}
		}
	})
};

const getOfferPools = async (minterAddress, chainName) => {
	await Moralis.Cloud.run(blockchainData[chainName].watchFunction, {
		address: minterAddress,
		'sync_historical': true
	});

	const {abi, topic} = getABIData(minterAbi, 'event', 'AddedOffer');
	const options = {
		address: minterAddress,
		chain: blockchainData[chainName].chainId,
		topic,
		abi
	}
	let events = await Moralis.Web3API.native.getContractEvents(options);
	events.result.forEach(async result => {
		const OfferPool = Moralis.Object.extend("OfferPool");
		const offerPoolQuery = new Moralis.Query(OfferPool);
		offerPoolQuery.equalTo('transactionHash', result.transaction_hash);
		const offerPoolResult = await offerPoolQuery.find();
		if (offerPoolResult.length === 0) {
			const offerPool = new OfferPool();
			offerPool.set('transactionHash', result.transaction_hash);
			offerPool.set('blockchain', blockchainData[chainName].chainId);
			offerPool.set('minterAddress', result.address);
			offerPool.set('marketplaceCatalogIndex', result.data.catalogIndex);
			offerPool.set('contract', result.data.contractAddress);
			offerPool.set('product', result.data.productIndex);
			offerPool.set('rangeNumber', result.data.rangesCreated);
			await offerPool.save();
			console.log(`[${chainName}] Saved Offer Pool #${result.data.catalogIndex} of ${result.address}`);
		}
	})
}

const getDeployedContracts = async (factoryAddress, chainName) => {
	await Moralis.Cloud.run(blockchainData[chainName].watchFunction, {
		address: factoryAddress,
		'sync_historical': true
	});

	const {abi, topic} = getABIData(factoryAbi, 'event', 'NewContractDeployed');
	const options = {
		address: factoryAddress,
		chain: blockchainData[chainName].chainId,
		topic,
		abi
	}
	let events = await Moralis.Web3API.native.getContractEvents(options);
	events.result.forEach(async result => {
		const Contract = Moralis.Object.extend("Contract");
		const contractQuery = new Moralis.Query(Contract);
		contractQuery.equalTo('transactionHash', result.transaction_hash);
		const contractResults = await contractQuery.find();
		if (contractResults.length === 0) {
			const nameAbi = getABIData(erc721Abi, 'function', 'name')
			const options = {
				chain: blockchainData[chainName].chainId,
				address: result.data.token,
				function_name: "name",
				abi: [nameAbi.abi]
			};
			const name = await Moralis.Web3API.native.runContractFunction(options).catch(console.error);

			const address = new Contract();
			address.set("factoryAddress", result.address);
			address.set("transactionHash", result.transaction_hash);
			address.set("blockchain", blockchainData[chainName].chainId);
			address.set("user", result.data.owner);
			address.set("indexOfOwner", result.data.uid);
			address.set("contractAddress", result.data.token);
			address.set("title", name);
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

const getProducts = async (chainName) => {
	const Contract = Moralis.Object.extend("Contract");
	const contractQuery = new Moralis.Query(Contract); 
	contractQuery.equalTo('blockchain', blockchainData[chainName].chainId);
	const contractResult = await contractQuery.find();

	const {abi, topic} = getABIData(erc721Abi, 'event', 'ProductCreated');
	const generalOptions = {
		chain: blockchainData[chainName].chainId,
		topic,
		abi
	};
	
	contractResult.forEach(
		async item => {
			
			const options = {
				address: item.get('contractAddress'),
				...generalOptions
			}
			let events = await Moralis.Web3API.native.getContractEvents(options);

			const Product = Moralis.Object.extend("Product");
			events.result.forEach(async result => {
				const productQuery = new Moralis.Query(Product);
				productQuery.equalTo('transactionHash', result.transaction_hash);
				const productResults = await productQuery.find();
				
				if (productResults.length === 0) {
					const product = new Product();
					product.set("contract", result.address);
					product.set("transactionHash", result.transaction_hash);
					product.set("collectionIndexInContract", result.data.uid);
					product.set("name", result.data.name);
					product.set("firstTokenIndex", result.data.startingToken);
					product.set("copies", result.data.length);
					product.set("soldCopies", 0);
					product.set("sold", false);
					product.set("lastTokenIndex", (Ethers.BigNumber.from(result.data.length).add(result.data.startingToken)).toString());
					product.set("chainId", blockchainData[chainName].chainId);
					await product.save();
					
					console.log(`[${chainName}] Saved product #${result.data.uid} of ${result.address}`);
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
	Offer
	

	MintedToken
	token: { type: Number, required: true },
	uniqueIndexInContract: { type: Number, required: true },
	ownerAddress: { type: String, lowercase: true },
	offerPool: { type: Number, required: true },
	offer: { type: Number, required: true },
	contract: { type: String, lowercase: true, required: true },
	metadata: { type: Metadata, default: () => ({}) },
	metadataURI: { type: String, default: 'none' },
	authenticityLink: { type: String, default: 'none' },
	isMinted: { type: Boolean, required: true },
	creationDate: { type: Date, default: Date.now }

	console.log('Minter');
	let events = await Moralis.Web3API.native.getContractEvents(options)
		.catch(err => console.error(err.error));
	events.result.forEach(async item => {
		console.log(item.data.token)
		await Moralis.Cloud.run('watchPolygonAddress', { address: item.data.token.toLowerCase(), 'sync_historical': true });
	});
	*/
	
	// Gets the topics of the contract. Useless now that getABIData exists
	//logEventTopics();
	// Returns the ABI entry and the Event's hash (topic) so Moralis can use it
	//getABIData(erc721Abi, 'event', 'ProductCreated');

	// Queries a factory and stores all deployed contracts
	//await getDeployedContracts(blockchainData.mumbai.factoryAddress, 'mumbai');
	// Gets the Products from all Deployed Contracts
	//await getProducts('mumbai');
	// Gets the Offers (OfferPool) created
	//await getOfferPools(blockchainData.mumbai.minterAddress ,'mumbai');
	// Gets the ranges appended on the minter marketplace
	//await getAppendedRanges(blockchainData.mumbai.minterAddress ,'mumbai');
}

try {
	main();
} catch (err) {
	console.error(err);
}