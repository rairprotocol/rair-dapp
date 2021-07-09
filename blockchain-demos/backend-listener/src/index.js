const ethers = require('ethers');
const Factory = require('./contracts/RAIR_Token_Factory.json').abi;
const Token = require('./contracts/RAIR_ERC721.json').abi;

const main = async () => {
	// Connect to the Binance Testnet
	binanceTestnetProvider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/', {
		chainId: 97, symbol: 'BNB', name: 'Binance Testnet'
	})

	// These connections don't have an address associated, so they can read but can't write to the blockchain
	let factoryInstance = await new ethers.Contract('0x4d4b5a70E77ac749B180eC24e48d03aF9d08e531', Factory, binanceTestnetProvider);
	let listOfTokens = await factoryInstance.tokensByOwner('0xEC30759D0A3F3CE0A730920DC29d74e441f492C3'); // Put your wallet address here!
	
	for await (token of listOfTokens) {
		let tokenInstance = new ethers.Contract(token, Token, binanceTestnetProvider);

		// You can view all listen-able events with:
		//		console.log(tokenInstance.filters);

		tokenInstance.on("CollectionCreated(uint256)", (index) => {
			console.log(`${token} has a new collection: ID#${index}`);
		})
	}
}

try {
	main()
} catch(err) {
	console.error(err);
}