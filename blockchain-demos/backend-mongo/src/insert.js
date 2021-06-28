const ethers = require('ethers');
const Factory = require('./contracts/RAIR_Token_Factory.json').abi;
const ERC777 = require('./contracts/RAIR777.json').abi;
const ERC721 = require('./contracts/RAIR_ERC721.json').abi;
const Demo = require('./databaseModel.js')

const main = async () => {
	await require('./connectMongo.js');
	// Connect to the Binance Testnet
	binanceTestnetProvider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/', {
		chainId: 97, symbol: 'BNB', name: 'Binance Testnet'
	})

	// These connections don't have an address associated, so they can read but can't write to the blockchain
	let erc777Instance = new ethers.Contract('0x51eA5316F2A9062e1cAB3c498cCA2924A7AB03b1', ERC777, binanceTestnetProvider);
	let factoryInstance = new ethers.Contract('0x5c31677c7E73F97020213690F736A8a2Ff922EBC', Factory, binanceTestnetProvider);

	console.log('Information about the demo ERC777 token (likes to timeout)');
	
	const tokenDecimals = await erc777Instance.decimals()
	console.log('Decimals:', tokenDecimals);

	// Some queries to the blockchain return a BigNumber object,
	//	you can view them as a decimal number using toString()!
	const tokenGranularity = (await erc777Instance.granularity()).toString()
	console.log('Granularity:', tokenGranularity);

	const tokenName = await erc777Instance.name()
	console.log('Name:', tokenName);

	const tokenSymbol = await erc777Instance.symbol()
	console.log('Symbol:', tokenSymbol);

	console.log('Balance of 0xEC30759D0A3F3CE0A730920DC29d74e441f492C3 (Juan):', (await erc777Instance.balanceOf('0xEC30759D0A3F3CE0A730920DC29d74e441f492C3')).toString(), 'RAIRs(777)');
	const balanceFactory = (await erc777Instance.balanceOf('0x5c31677c7E73F97020213690F736A8a2Ff922EBC')).toString()
	console.log('Balance of the Factory (0x5c31677c7E73F97020213690F736A8a2Ff922EBC):', balanceFactory, 'RAIRs(777)');

	// You can check all of the functions available in an instance by calling
	// console.log(erc777Instance.functions);

	// This creates an object on the database, but it's NOT saved yet
	let insertForDemo = new Demo({
		tokenAddress: erc777Instance.address,
		name: tokenName,
		symbol: tokenSymbol,
		granularity: tokenGranularity,
		decimals: tokenDecimals,
		balanceOfFactory: balanceFactory
	})

	// To save into Mongo, use save()
	await insertForDemo.save()
}

try {
	main()
} catch(err) {
	console.error(err);
}