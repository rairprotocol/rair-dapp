const ethers = require('ethers');
const FactoryAbi = require('./contracts/RAIR_Token_Factory.json').abi;
const TokenAbi = require('./contracts/RAIR_ERC721.json').abi;
const MinterAbi = require('./contracts/Minter_Marketplace.json').abi;
const { diamondFactoryAbi } = require('./contracts');

const main = async () => {
	let providers = [
		{
			provider: new ethers.providers.StaticJsonRpcProvider('https://speedy-nodes-nyc.moralis.io/f68255ae9308a6e85032bd6a/bsc/testnet/archive', {
				chainId: 97,
				symbol: 'BNB',
				name: 'Binance Testnet'
			}),
			factoryAddress: '0xb173E2F7eD8Bb697e70b02Ed38faaa2319dB3C23',
			minterAddress: '0xcBA6014452e82eBF98fA2748BBD46f1733a13AdD'
		},
		{
			provider: new ethers.providers.StaticJsonRpcProvider('https://speedy-nodes-nyc.moralis.io/f68255ae9308a6e85032bd6a/eth/goerli/archive', {
				chainId: 5,
				symbol: 'ETH',
				name: 'Goerli Testnet'
			}),
			factoryAddress: '0xF9DC1787179c1404910adE194A5087cEbD5c4717',
			minterAddress: '0x14ef15A945b6Cae28f4FA3862E41d74E484Cd3B5'
		},
		{
			provider: new ethers.providers.StaticJsonRpcProvider("https://speedy-nodes-nyc.moralis.io/f68255ae9308a6e85032bd6a/polygon/mumbai/archive", {
				chainId: 80001,
				symbol: 'tMATIC',
				name: 'Matic Mumbai Testnet'
			}),
			factoryAddress: '0xB8083810Fa33e7Ebd777c8cd6eBB453948aFd354',
			minterAddress: '0x4594D508cDa05D016571082d467889f4629e1f56'
		}
	]

	for await (let providerData of providers) {
		providerData.provider.on('debug', ({action, request, response, provider}) => {
			console.log(providerData.provider._network.name, response ? 'Receiving response to' : 'Sending request', request.method);
		});
		console.log('Connected to', providerData.provider._network.name);
		// These connections don't have an address associated, so they can read but can't write to the blockchain
		let factoryInstance = await new ethers.Contract(providerData.factoryAddress, FactoryAbi, providerData.provider);
		let minterInstance = await new ethers.Contract(providerData.minterAddress, MinterAbi, providerData.provider);

		console.log('// MINTER: Offers created in the past');
		for await (let pastEvent of await minterInstance.queryFilter(await minterInstance.filters.AddedOffer())) {
			let {contractAddress, productIndex, rangesCreated, catalogIndex} = pastEvent.args;
			console.log(`[PAST] Minter Marketplace: Created a new offer #${catalogIndex} (from ${contractAddress}, product #${productIndex}) with ${rangesCreated} ranges`);
		}

		console.log('// MINTER: Ranges created in the past');
		for await (let pastEvent of await minterInstance.queryFilter(await minterInstance.filters.AppendedRange())) {
			let {contractAddress, productIndex, offerIndex, rangeIndex, startToken, endToken, price, name} = pastEvent.args;
			console.log(`[PAST] Minter Marketplace: New range created for contract ${contractAddress} on product ${productIndex} (offer #${offerIndex} on the marketplace) as range #${rangeIndex}: ${name}, starting from ${startToken} to ${endToken} at ${price} each`);
		}

		console.log('// MINTER: Sold out ranges in the past');
		for await (let pastEvent of await minterInstance.queryFilter(await minterInstance.filters.SoldOut())) {
			let {contractAddress, catalogIndex, rangeIndex} = pastEvent.args;
			console.log(`[PAST] Minter Marketplace: Range #${rangeIndex} from offer #${catalogIndex} (from ${contractAddress}) is sold out!`);
		}

		console.log('// MINTER: Update offers in the past');
		for await (let pastEvent of await minterInstance.queryFilter(await minterInstance.filters.UpdatedOffer())) {
			let {contractAddress, offerIndex, rangeIndex, tokens, price, name} = pastEvent.args;
			console.log(`[PAST] Minter Marketplace: Updated the info for range #${rangeIndex} ${name} (from ${contractAddress}, offer #${offerIndex}), ${tokens} tokens for ${price} each`);
		}

		console.log('// MINTER: Minted tokens in the past');
		for await (let pastEvent of await minterInstance.queryFilter(await minterInstance.filters.TokenMinted())) {
			let {ownerAddress, contractAddress, catalogIndex, rangeIndex, tokenIndex} = pastEvent.args;
			console.log(`[PAST] Minter Marketplace: ${ownerAddress} minted token #${tokenIndex} from range #${rangeIndex} from offer #${catalogIndex} (from ${contractAddress})!`);
		}

		console.log('// MINTER: Node fees changed in the past');
		for await (let pastEvent of await minterInstance.queryFilter(await minterInstance.filters.ChangedNodeFee())) {
			let {newNodeFee} = pastEvent.args;
			console.log(`[PAST] Minter Marketplace updated the node fee to ${newNodeFee}!`);
		}

		console.log('// MINTER: Treasury address changes in the past');
		for await (let pastEvent of await minterInstance.queryFilter(await minterInstance.filters.ChangedTreasury())) {
			let {newTreasury} = pastEvent.args;
			console.log(`[PAST] Minter Marketplace updated the treasury address to ${newTreasury}!`);
		}

		console.log('// MINTER: Treasury fee changes in the past');
		for await (let pastEvent of await minterInstance.queryFilter(await minterInstance.filters.ChangedTreasuryFee())) {
			let {treasury, newTreasuryFee} = pastEvent.args;
			console.log(`[PAST] Minter Marketplace updated the treasury (${treasury}) fee to ${newTreasuryFee}!`);
		}

		// Factory

		console.log('// FACTORY: Tokens withdrawn in the past');
		for await (let pastEvent of await factoryInstance.queryFilter(await factoryInstance.filters.TokensWithdrawn())) {
			let {recipient, erc777, amount} = pastEvent.args;
			console.log(`[PAST] Factory: ${amount} ERC777 tokens from ${erc777} were withdrawn by ${recipient}`);
		}

		console.log('// FACTORY: Tokens accepted in the past');
		for await (let pastEvent of await factoryInstance.queryFilter(await factoryInstance.filters.NewTokensAccepted())) {
			let {erc777, priceForNFT} = pastEvent.args;
			console.log(`[PAST] Factory: New Tokens accepted for deployment! Now you can pay ${priceForNFT} tokens from ${erc777} to deploy a contract`)
		}

		console.log('// FACTORY: Tokens no longer accepted in the past');
		for await (let pastEvent of await factoryInstance.queryFilter(await factoryInstance.filters.TokenNoLongerAccepted())) {
			let {erc777} = pastEvent.args;
			console.log(`[PAST] Factory: tokens from ${erc777} are no longer accepted!`);
		}

		console.log('// FACTORY: Contracts deployed in the past');
		for await (let pastEvent of await factoryInstance.queryFilter(await factoryInstance.filters.NewContractDeployed())) {
			let {owner, id, token} = pastEvent.args;
			console.log(`[PAST] Factory: A new ERC721 contract has been deployed by ${owner}, that makes ${id} contracts deployed by that user, the new contract is at ${token}`);
		}

		let numberOfCreators = await factoryInstance.getCreatorsCount();
		console.log(numberOfCreators.toString(), 'addresses have deployed tokens in this factory');

		for (let i = 0; i < numberOfCreators; i++) {
			let creatorAddress = await factoryInstance.creators(i);
			let numberOfTokens = await factoryInstance.getContractCountOf(creatorAddress);
			console.log(creatorAddress, 'has deployed', numberOfTokens.toString(), 'contracts');
			for (let j = 0; j < numberOfTokens; j++) {
				let contractAddress = await factoryInstance.ownerToContracts(creatorAddress, j);
				let tokenInstance = new ethers.Contract(contractAddress, TokenAbi, providerData.provider);
				// You can view all listen-able events with:
				// console.log(tokenInstance.filters);

				console.log('// ERC721: Products created in the past');
				for await (let pastEvent of await tokenInstance.queryFilter(await tokenInstance.filters.ProductCreated())) {
					let {id, name, startingToken, length} = pastEvent.args;
					console.log(`[PAST] ${tokenInstance.address}: has a new product! ID#${id} called ${name}, it starts at ${startingToken} and has ${length} copies!`);
				}

				console.log('// ERC721: Range locks created in the past');
				for await (let pastEvent of await tokenInstance.queryFilter(await tokenInstance.filters.RangeLocked())) {
					let {productIndex, startingToken, endingToken, tokensLocked, productName} = pastEvent.args;
					console.log(`[PAST] ${tokenInstance.address}: locked a range of tokens inside product ${productName} (#${productIndex}), from ${startingToken} to ${endingToken} have been locked until ${tokensLocked} tokens get minted!`);
				}

				console.log('// ERC721: Ranges unlocked in the past');
				for await (let pastEvent of await tokenInstance.queryFilter(await tokenInstance.filters.RangeUnlocked())) {
					let {productID, startingToken, endingToken} = pastEvent.args;
					console.log(`[PAST] ${tokenInstance.address}: The Range of tokens from ${startingToken} to ${endingToken} in product #${productID} have been unlocked!`);
				}

				console.log('// ERC721: Products completed in the past');
				for await (let pastEvent of await tokenInstance.queryFilter(await tokenInstance.filters.ProductCompleted())) {
					let {id, name} = pastEvent.args;
					console.log(`[PAST] ${tokenInstance.address} product #${id} (${name}) ran out of mintable copies!`);
				}

				console.log('// ERC721: Transfers done in the past');
				for await (let pastEvent of await tokenInstance.queryFilter(await tokenInstance.filters.Transfer())) {
					let {from, to, tokenId} = pastEvent.args;
					console.log(`[PAST] ${tokenInstance.address}: ${from} sent token #${tokenId} to ${to}!`);
				}

				console.log('// ERC721: Approvals done in the past');
				for await (let pastEvent of await tokenInstance.queryFilter(await tokenInstance.filters.Approval())) {
					let {owner, approved, tokenId} = pastEvent.args;
					console.log(`[PAST] ${tokenInstance.address}: ${owner} approved ${approved} to transfer token #${tokenId}!`);
				}

				console.log('// ERC721: ApprovalForAll calls done in the past');
				for await (let pastEvent of await tokenInstance.queryFilter(await tokenInstance.filters.ApprovalForAll())) {
					let {owner, operator, approved} = pastEvent.args;
					console.log(`[PAST] ${tokenInstance.address}: ${owner} ${approved ? 'enabled' : 'disabled'} full approval ${operator} to transfer tokens!`);
				}
			}
		}
	}
}

try {
	main()
} catch(err) {
	console.error(err);
}