const ethers = require('ethers');
const FactoryAbi = require('./contracts/RAIR_Token_Factory.json').abi;
const TokenAbi = require('./contracts/RAIR_ERC721.json').abi;
const MinterAbi = require('./contracts/Minter_Marketplace.json').abi;

const main = async () => {
	// Connect to the Binance Testnet
	binanceTestnetProvider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/', {
		chainId: 97, symbol: 'BNB', name: 'Binance Testnet'
	})
	console.log('Connected to Binance Testnet');

	// These connections don't have an address associated, so they can read but can't write to the blockchain
	let factoryInstance = await new ethers.Contract('0x5f35db8c13a351e841f83577112ccc95edca9697', FactoryAbi, binanceTestnetProvider);
	let minterInstance = await new ethers.Contract('0xb8083810fa33e7ebd777c8cd6ebb453948afd354', MinterAbi, binanceTestnetProvider);

	minterInstance.on('AddedOffer(address,uint256,uint256,uint256)', (contractAddress, tokensAllowed, individualPrice, catalogIndex) => {
		console.log(`Minter Marketplace: Created a new offer ${catalogIndex} (from ${contractAddress}), ${tokensAllowed} tokens for ${individualPrice} WEI each`);
	});
	minterInstance.on('ChangedNodeFee(uint16)', (newFee) => {
		console.log(`Minter Marketplace updated the node fee to ${newFee}!`);
	});
	minterInstance.on('ChangedTreasury(address)', (newAddress) => {
		console.log(`Minter Marketplace updated the treasury address to ${newAddress}!`);
	});
	minterInstance.on('ChangedTreasuryFee(address,uint16)', (treasuryAddress, newTreasuryFee) => {
		console.log(`Minter Marketplace updated the treasury (${treasuryAddress}) fee to ${newTreasuryFee}!`);
	});
	minterInstance.on('SoldOut(address,uint256)', (contractAddress, offerIndex) => {
		console.log(`Minter Marketplace: Offer #${offerIndex} (from ${contractAddress}) is sold out!`);
	});
	minterInstance.on('TokenMinted(address,uint256)', (contractAddress, offerIndex) => {
		console.log(`Minter Marketplace: Minted a token from offer #${offerIndex} (from ${contractAddress})!`);
	});
	minterInstance.on('UpdatedOffer(address,uint256,uint256,uint256)', (contractAddress, tokensAllowed, individualPrice, catalogIndex) => {
		console.log(`Minter Marketplace: Updated the info for collection ${catalogIndex} (from ${contractAddress}), ${tokensAllowed} tokens for ${individualPrice} each`);
	});

	let numberOfCreators = await factoryInstance.getCreatorsCount();

	console.log(numberOfCreators.toString(), 'addresses have deployed tokens in this factory');
	for (let i = 0; i < numberOfCreators; i++) {
		let creatorAddress = await factoryInstance.creators(i);
		let numberOfTokens = await factoryInstance.getContractCountOf(creatorAddress);
		console.log(creatorAddress, 'has deployed', numberOfTokens.toString(), 'contracts');
		for (let j = 0; j < numberOfTokens; j++) {
			let contractAddress = await factoryInstance.ownerToContracts(creatorAddress, j);
			let tokenInstance = new ethers.Contract(contractAddress, TokenAbi, binanceTestnetProvider);
			// You can view all listen-able events with:
			// console.log(tokenInstance.filters);
			tokenInstance.on("CollectionCreated(uint256,string,uint256)", (index, name, length) => {
				console.log(`${tokenInstance.address} has a new collection! ID#${index} called ${name} with ${length} copies!`);
			})
			tokenInstance.on("Approval(address,address,uint256)", (approver, approvee, tokenId) => {
				console.log(`${tokenInstance.address}: ${approver} approved ${aprovee} to transfer token #${tokenId}!`);
			})
			tokenInstance.on("ApprovalForAll(address,address,bool)", (approver, aprovee, bool) => {
				console.log(`${tokenInstance.address}: ${approver} ${bool ? 'enabled' : 'disabled'} full approval ${aprovee} to transfer tokens!`);
			})
			tokenInstance.on("CollectionCompleted(uint256,string)", (collectionId, name) => {
				console.log(`${tokenInstance.address} collection #${collectionId} (${name}) ran out of mintable copies!`);
			})
			tokenInstance.on("TransfersEnabled(uint256,string)", (collectionId, name) => {
				console.log(`${tokenInstance.address}: Transfers have been enabled for collection #${collectionId} (${name})!`);
			})
			tokenInstance.on("Transfer(address,address,uint256)", (from, to, tokenId) => {
				console.log(`${tokenInstance.address}: ${from} sent token #${tokenId} to ${to}!`);
			})
			await console.log('Set up a listeners for', contractAddress, 'or', await tokenInstance.name());
		}
	}
}

try {
	main()
} catch(err) {
	console.error(err);
}