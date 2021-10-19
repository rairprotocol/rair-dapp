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

const getDeployedContracts = async (factoryAddress, chainName) => {
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
	await getDeployedContracts(blockchainData.mumbai.factoryAddress, 'mumbai');
	// Gets the Products from all Deployed Contracts
	await getProducts('mumbai');
}

try {
	main();
} catch (err) {
	console.error(err);
}