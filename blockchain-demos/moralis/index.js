const Moralis = require('moralis/node');
const Ethers = require('ethers');
require('dotenv').config();
const {erc721Abi, minterAbi, factoryAbi, erc777Abi} = require('./ABI');
const { getABIData } = require('./utils');

const blockchainData = {
	mumbai: {
		chainId: '0x13881', 
		factoryAddress: '0x5535FE9ABdA206F6780cc87b4e1fe4733b98bd9C',
		minterAddress: '0x4594D508cDa05D016571082d467889f4629e1f56',
		watchFunction: 'watchPolygonAddress',
		watchCollection: 'watchedPolygonAddress',
		testnet: true
	},
	goerli: {
		chainId: '0x5', 
		factoryAddress: '0x0C7A7D9641AB33228fD9C202DB4290B304963592',
		minterAddress: '0x14ef15A945b6Cae28f4FA3862E41d74E484Cd3B5',
		watchFunction: 'watchEthAddress',
		watchCollection: 'watchedEthAddress',
		testnet: true
	},
	binance: {
		chainId: '0x61', 
		factoryAddress: '0x122D66159CBe0F9021aC120923847E79a4dCFC2C',
		minterAddress: '0xcBA6014452e82eBF98fA2748BBD46f1733a13AdD',
		watchFunction: 'watchBscAddress',
		watchCollection: 'watchedBscAddress',
		testnet: true
	},
	matic: {
		chainId: '0x89', 
		factoryAddress: '0x92FBe344513e108B581170E73CFA352B729E47EA',
		minterAddress: '0x781F15a23506CF28539EA057e3f33008E6339E49',
		watchFunction: 'watchPolygonAddress',
		watchCollection: 'watchedPolygonAddress',
		testnet: false
	}
}

const getTokenTransfers = async (chainName) => {
	const Contract = Moralis.Object.extend("Contract");
	const contractQuery = new Moralis.Query(Contract); 
	contractQuery.equalTo('blockchain', blockchainData[chainName].chainId);
	const contractResult = await contractQuery.find().catch(console.error);

	const {abi, topic} = getABIData(erc721Abi, 'event', 'Transfer');
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
			let events = await Moralis.Web3API.native.getContractEvents(options).catch(console.error);

			const MintedToken = Moralis.Object.extend("MintedToken");
			const Product = Moralis.Object.extend("Product");
			const OfferPool = Moralis.Object.extend("OfferPool");
			const Offer = Moralis.Object.extend("Offer");
			events?.result?.forEach(async result => {
				const mintedTokenQuery = new Moralis.Query(MintedToken);
				mintedTokenQuery.equalTo('transactionHash', result.transaction_hash);
				const mintedTokenResult = await mintedTokenQuery.find().catch(console.error);
				
				if (mintedTokenResult.length === 0) {
					const mintedToken = new MintedToken();
					mintedToken.set("contract", result.address);
					mintedToken.set("transactionHash", result.transaction_hash);
					mintedToken.set("blockchain", blockchainData[chainName].chainId);

					mintedToken.set("internalTokenIndex", result.data.tokenId);
					mintedToken.set("fromAddress", result.data.from);
					mintedToken.set("toAddress", result.data.to);
					mintedToken.set("blockNumber", result.block_number);

					const productQuery = new Moralis.Query(Product);
					productQuery.equalTo('contract', result.address);
					productQuery.equalTo('blockchain', blockchainData[chainName].chainId);
					const productResult = await productQuery.find().catch(console.error);
					if (!productResult.length) {
						console.log(`Can't find products for #${result.data.tokenId} of ${result.address}`);
						return;
					}
					let aux = productResult.filter(i => {
						let firstToken = Ethers.BigNumber.from(i.get('firstTokenIndex'));
						let lastToken = Ethers.BigNumber.from(i.get('lastTokenIndex'));
						return firstToken.lte(result.data.tokenId) && lastToken.gte(result.data.tokenId);
					});
					if (aux.length !== 1) {
						console.log(`Can't find a specific product for #${result.data.tokenId}`);
						return;
					}
					const productIndex = aux[0].get('collectionIndexInContract')
					aux[0].set('soldCopies', Number((Ethers.BigNumber.from(aux[0].get('soldCopies')).add(1)).toString()))
					mintedToken.set("product", productIndex);
					mintedToken.set("productIndex",  (Ethers.BigNumber.from(aux[0].get('firstTokenIndex')).add(result.data.tokenId)).toString());

					const offerPoolQuery = new Moralis.Query(OfferPool);
					offerPoolQuery.equalTo('contract', result.address);
					offerPoolQuery.equalTo('product', productIndex);
					offerPoolQuery.equalTo('blockchain', blockchainData[chainName].chainId);
					const offerPoolResult = await offerPoolQuery.first().catch(console.error);
					if (!offerPoolResult) {
						console.log(`Can't find offer pool for product #${productIndex} of contract ${result.address}`);
						return;
					}
					const offerPoolIndex = offerPoolResult.get('marketplaceCatalogIndex');
					mintedToken.set("offerPool", offerPoolIndex);

					const offerQuery = new Moralis.Query(Offer);
					offerPoolQuery.equalTo('contract', result.address);
					offerPoolQuery.equalTo('product', productIndex);
					offerPoolQuery.equalTo('blockchain', blockchainData[chainName].chainId);
					productQuery.lessThanOrEqualTo('range.0', result.data.tokenId);
					productQuery.greaterThanOrEqualTo('range.1', result.data.tokenId);
					const offerResult = await offerQuery.first().catch(console.error);
					if (!offerResult) {
						console.log(`Can't find offer for product #${productIndex}`);
						return;
					}
					offerResult.set('soldCopies', Number((Ethers.BigNumber.from(offerResult.get('soldCopies')).add(1)).toString()))
					mintedToken.set("offer", offerResult.get('offerIndex'));
					
					await mintedToken.save().catch(console.error);
					await aux[0].save().catch(console.error)
					await offerResult.save().catch(console.error);
					console.log(`[${chainName}] New token transfer for #${result.data.tokenId} of ${result.address}`);
				}
			})
		});
}

const getAppendedRanges = async (minterAddress, chainName) => {
	await Moralis.Cloud.run(blockchainData[chainName].watchFunction, {
		address: minterAddress,
		'sync_historical': true
	}).catch(console.error);

	const {abi, topic} = getABIData(minterAbi, 'event', 'AppendedRange');
	const options = {
		address: minterAddress,
		chain: blockchainData[chainName].chainId,
		topic,
		abi
	}
	let events = await Moralis.Web3API.native.getContractEvents(options).catch(console.error);
	events?.result?.forEach(async result => {
		const Offer = Moralis.Object.extend("Offer");
		const offerQuery = new Moralis.Query(Offer);
		offerQuery.equalTo('transactionHash', result.transaction_hash);
		const offerResult = await offerQuery.find().catch(console.error);
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

			await offer.save().catch(console.error);
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
				await offerPoolResult.save().catch(console.error);
			}
		}
	})
};

const getOfferPools = async (minterAddress, chainName) => {
	await Moralis.Cloud.run(blockchainData[chainName].watchFunction, {
		address: minterAddress,
		'sync_historical': true
	}).catch(console.error);

	const {abi, topic} = getABIData(minterAbi, 'event', 'AddedOffer');
	const options = {
		address: minterAddress,
		chain: blockchainData[chainName].chainId,
		topic,
		abi
	}
	let events = await Moralis.Web3API.native.getContractEvents(options).catch(console.error);
	events?.result?.forEach(async result => {
		const OfferPool = Moralis.Object.extend("OfferPool");
		const offerPoolQuery = new Moralis.Query(OfferPool);
		offerPoolQuery.equalTo('transactionHash', result.transaction_hash);
		const offerPoolResult = await offerPoolQuery.find().catch(console.error);
		if (offerPoolResult.length === 0) {
			const offerPool = new OfferPool();
			offerPool.set('transactionHash', result.transaction_hash);
			offerPool.set('blockchain', blockchainData[chainName].chainId);
			offerPool.set('minterAddress', result.address);
			offerPool.set('marketplaceCatalogIndex', result.data.catalogIndex);
			offerPool.set('contract', result.data.contractAddress);
			offerPool.set('product', result.data.productIndex);
			offerPool.set('rangeNumber', result.data.rangesCreated);
			await offerPool.save().catch(console.error);
			console.log(`[${chainName}] Saved Offer Pool #${result.data.catalogIndex} of ${result.address}`);
		}
	})
}

const getCustomPayments = async (minterAddress, chainName) => {
	await Moralis.Cloud.run(blockchainData[chainName].watchFunction, {
		address: minterAddress,
		'sync_historical': true
	});

	const {abi, topic} = getABIData(minterAbi, 'event', 'CustomPaymentSet');
	const options = {
		address: minterAddress,
		chain: blockchainData[chainName].chainId,
		topic,
		abi
	}
	let events = await Moralis.Web3API.native.getContractEvents(options);
	events.result.forEach(async result => {
		const CustomPayment = Moralis.Object.extend("CustomPayment");
		const customPaymentQuery = new Moralis.Query(CustomPayment);
		customPaymentQuery.equalTo('transactionHash', result.transaction_hash);
		const customPaymentResult = await customPaymentQuery.find();
		if (customPaymentResult.length === 0) {
			const customPayment = new CustomPayment();
			customPayment.set('transactionHash', result.transaction_hash);
			customPayment.set('blockchain', blockchainData[chainName].chainId);
			customPayment.set('minterAddress', result.address);
			customPayment.set('recipients', result.data.recipients);
			customPayment.set('percentages', result.data.percentages);
			await customPayment.save();
			console.log(`[${chainName}] Saved Custom Payment on offer pool index ${result.data.catalogIndex}`);
		}
	})
}

const getDeployedContracts = async (factoryAddress, chainName) => {
	await Moralis.Cloud.run(blockchainData[chainName].watchFunction, {
		address: factoryAddress,
		'sync_historical': true
	}).catch(console.error);

	const {abi, topic} = getABIData(factoryAbi, 'event', 'NewContractDeployed');
	const options = {
		address: factoryAddress,
		chain: blockchainData[chainName].chainId,
		topic,
		abi
	}
	let events = await Moralis.Web3API.native.getContractEvents(options).catch(console.error);
	events?.result?.forEach(async result => {
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
			await address.save().catch(console.error);
			// Listen to this contract's events
			console.log(`[${chainName}] Saved contract #${result.data.uid} of ${result.data.owner}`);
			await Moralis.Cloud.run(blockchainData[chainName].watchFunction, {
				address: result.data.token.toLowerCase(),
				'sync_historical': true
			}).catch(console.error);
		}
	})
}

const getProducts = async (chainName) => {
	const Contract = Moralis.Object.extend("Contract");
	const contractQuery = new Moralis.Query(Contract); 
	contractQuery.equalTo('blockchain', blockchainData[chainName].chainId);
	const contractResult = await contractQuery.find().catch(console.error);

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
			let events = await Moralis.Web3API.native.getContractEvents(options).catch(console.error);

			const Product = Moralis.Object.extend("Product");
			events?.result?.forEach(async result => {
				const productQuery = new Moralis.Query(Product);
				productQuery.equalTo('transactionHash', result.transaction_hash);
				const productResults = await productQuery.find().catch(console.error);
				
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
					product.set("lastTokenIndex", (Ethers.BigNumber.from(result.data.length).add(result.data.startingToken).sub(1)).toString());
					product.set("blockchain", blockchainData[chainName].chainId);
					await product.save().catch(console.error);
					
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
	const serverUrl = process.env.MORALIS_SERVER_TEST;
	const appId = process.env.MORALIS_API_KEY_TEST;
	Moralis.start({ serverUrl, appId });

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