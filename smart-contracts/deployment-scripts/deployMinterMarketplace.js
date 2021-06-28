const ethers = require('ethers');
require('dotenv').config();
let MinterData;

try {
	// The ABI describes how the contract works, it's the result of Hardhat / Truffle compiling the .sol files
	MinterData = require('../artifacts/contracts/MarketplaceMinter.sol/Minter_Marketplace.json');
} catch (err) {
	console.log('Error! Try running "npm run hardhat:compile" to produce artifacts!');
	console.error(err);
	return;
}

const main = async () => {
	// Connect to the Binance Testnet, this JsonRpcProvider can be used to connect to any Blockchain!
	let binanceTestnetProvider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/', {
		chainId: 97, symbol: 'BNB', name: 'Binance Testnet'
	});
	console.log(`Connected to ${binanceTestnetProvider._network.name}!`);

	// To deploy anything we need a wallet address, to do transactions on behalf of that account a private key must be provided
	// 		Write your private key on a .env file so it remains a secret!
	let currentWallet = new ethers.Wallet(process.env.ADDRESS_PRIVATE_KEY, binanceTestnetProvider);
	console.log('Balance of', currentWallet.address, 'before the deployment:', (await currentWallet.getBalance()).toString(), binanceTestnetProvider._network.symbol);

	// The contract factory holds all the information about the contract, using the ABI and the Bytecode, the address will be the deployer and owner of the contract
	let MinterFactory = await new ethers.ContractFactory(MinterData.abi, MinterData.bytecode, currentWallet);

	// For deployment, the factory requires 2 things:
	//		The number of ERC777 tokens required to deploy an ERC721
	// 			and the address of the ERC777
	let minterInstance = await MinterFactory.deploy('0x51eA5316F2A9062e1cAB3c498cCA2924A7AB03b1', 9000, 1000);
	try {
		await minterInstance.deployed();
	} catch (err) {
		console.error(err);
	}
	console.log('Your factory contract is deployed! Find it on address', minterInstance.address);
	console.log('Gas Price:', minterInstance.deployTransaction.gasPrice.toString());
	console.log('Gas Limit:', minterInstance.deployTransaction.gasLimit.toString());
	console.log('Transaction Hash:', minterInstance.deployTransaction.hash);
	console.log('Chain ID:', minterInstance.deployTransaction.chainId);

	console.log('Balance of', currentWallet.address, 'after the deployment:', (await currentWallet.getBalance()).toString(), binanceTestnetProvider._network.symbol);
}

try {
	main()
} catch(err) {
	console.error(err);
}