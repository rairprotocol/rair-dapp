const ethers = require('ethers');
const FactoryAbi = require('./contracts/RAIR_Token_Factory.json').abi;
const TokenAbi = require('./contracts/RAIR_ERC721.json').abi;
const MinterAbi = require('./contracts/Minter_Marketplace.json').abi;
const DiamondFactoryAbi = require('./contracts/diamondFactoryABI.json').abi;
const DiamondMarketplaceAbi = require('./contracts/diamondMarketplaceABI.json').abi;
const Koa = require('koa');
const morgan = require('koa-morgan')
const Router = require('koa-router');
const Moralis = require('moralis/node');
require('dotenv').config();
const app = new Koa();
const router = new Router();

const blockchainEndponts = {
	"0x5": {
		symbol: "ETH",
		speedyNode: "https://speedy-nodes-nyc.moralis.io/f68255ae9308a6e85032bd6a/eth/goerli/archive",
		name: "Ethereum Goerli"
	},
	"0x89": {
		symbol: "MATIC",
		speedyNode: "",
		name: "Matic Mainnet"
	},
	"0x61": {
		symbol: "BNB",
		speedyNode: "https://speedy-nodes-nyc.moralis.io/f68255ae9308a6e85032bd6a/bsc/testnet/archive",
		name: "Binance Testnet"
	},
	"0x13881":  {
		symbol: "tMATIC",
		speedyNode: "https://speedy-nodes-nyc.moralis.io/f68255ae9308a6e85032bd6a/polygon/mumbai/archive",
		name: "Matic Testnet"
	}
}

const getContractEvents = (abi) => {
	let interface = new ethers.utils.Interface(abi);
	let mapping = {};
	Object.keys(interface.events).forEach((eventSignature) => {
		singleAbi = abi.filter(item => {
			return eventSignature.includes(item.name) && item.type === 'event';
		})[0];
		mapping[ethers.utils.id(eventSignature)] = {
			signature: eventSignature,
			abi: [singleAbi]
		};
	});
	return mapping;
}

const masterMapping = {
	...getContractEvents(FactoryAbi),
	...getContractEvents(TokenAbi),
	...getContractEvents(MinterAbi),
	...getContractEvents(DiamondFactoryAbi),
	...getContractEvents(DiamondMarketplaceAbi)
}

/*
	{
	to: '0x14ef15A945b6Cae28f4FA3862E41d74E484Cd3B5',
	from: '0xEC30759D0A3F3CE0A730920DC29d74e441f492C3',
	contractAddress: null,
	transactionIndex: 20,
	gasUsed: BigNumber { _hex: '0x03c744', _isBigNumber: true },
	logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000080000000000000000000200020000000000000000000000000000000000000000000000010000000000000008000000000000000000000000000000000000000000000000020000000000000000000804000000000000000000000010000000020000080000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000002000000000000000000000000000000000000000000000820000000000000000000000080000000000000000000000000000000000000000800',
	blockHash: '0x4e026d92de0c6235ce44781774e0831b8b490d0a06301391e13288ff8c156494',
	transactionHash: '0x2fc313e6c96547c925db665177bbb28239593abb0f881a474b4ac670a0849787',
	logs: [
		{
			transactionIndex: 20,
			blockNumber: 5826597,
			transactionHash: '0x2fc313e6c96547c925db665177bbb28239593abb0f881a474b4ac670a0849787',
			address: '0x49d2afdcd196e630cBB2281BD338aDf44d598015',
			topics: [
			'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
			'0x0000000000000000000000000000000000000000000000000000000000000000',
			'0x000000000000000000000000ec30759d0a3f3ce0a730920dc29d74e441f492c3',
			'0x0000000000000000000000000000000000000000000000000000000000000000'
		],
			data: '0x',
			logIndex: 46,
			blockHash: '0x4e026d92de0c6235ce44781774e0831b8b490d0a06301391e13288ff8c156494'
		},
		{
			transactionIndex: 20,
			blockNumber: 5826597,
			transactionHash: '0x2fc313e6c96547c925db665177bbb28239593abb0f881a474b4ac670a0849787',
			address: '0x14ef15A945b6Cae28f4FA3862E41d74E484Cd3B5',
			topics: [
			'0x188c6e7ce5cf6a45f5d4441da49a243005c388c7f4f00137378ba3d058baf01d'
		],
			data: '0x000000000000000000000000ec30759d0a3f3ce0a730920dc29d74e441f492c300000000000000000000000049d2afdcd196e630cbb2281bd338adf44d598015000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
			logIndex: 47,
			blockHash: '0x4e026d92de0c6235ce44781774e0831b8b490d0a06301391e13288ff8c156494'
		}
	],
	blockNumber: 5826597,
	confirmations: 243676,
	cumulativeGasUsed: BigNumber { _hex: '0x1ee423', _isBigNumber: true },
	effectiveGasPrice: BigNumber { _hex: '0x59682f07', _isBigNumber: true },
	status: 1,
	type: 2,
	byzantium: true
}
*/

const processLog = (event) => {
	let foundEvents = [];
	if (event.topic0) {
		event.topics = [
			event.topic0,
			event.topic1,
			event.topic2,
			event.topic3
		];
		event.topics = event.topics.filter(item => item !== null);
	}
	event.topics.forEach(item => {
		let found = masterMapping[item];
		if (found) {
			let interface = new ethers.utils.Interface(found.abi);
			console.log(`Found ${found.signature}`);
			foundEvents.push({
				eventSignature: found.signature,
				arguments: interface.decodeEventLog(
					found.signature,
					event.data,
					event.topics
				),
				logIndex: event.logIndex,
				transactionHash: event.transactionHash,
				blockNumber: event.blockNumber
			});
		}
	});
	return foundEvents;
}

const serverUrl = process.env.MORALIS_SERVER_TEST;
const appId = process.env.MORALIS_API_KEY_TEST;
Moralis.start({ serverUrl, appId });

const main = async () => {
	app.use(morgan('dev'));

	// This route gets all events from the contract
	router.get('/contractLogs/:network/:contractAddress', async (ctx, next) => {
		let {network, contractAddress} = ctx.params;
		console.log(`Parsing logs for address ${contractAddress}`);
		const options = {
			address: contractAddress,
			chain: network,
		};

		if (!Object.keys(blockchainEndponts).includes(network)) {
			ctx.body = {success: false, message: `Blockchain ${network} not supported`};
			next();
			return;
		}

		const logs = await Moralis.Web3API.native.getLogsByAddress(options);

		let parsedLogs = logs.result.map(processLog);

		ctx.body = {success: true, message: `Found ${parsedLogs.length} events!`, parsedLogs};
	})

	// This route gets all events from a transaction
	router.get('/verify/:network/:transactionHash', async (ctx, next) => {
		let {network, transactionHash} = ctx.params;
		let chainData = blockchainEndponts[network];

		if (!chainData) {
			ctx.body = {success: false, message: `Blockchain ${network} not supported`};
			next();
			return;
		}

		console.log(`Verifying transaction ${transactionHash}`);

		const provider = new ethers.providers.StaticJsonRpcProvider(chainData.speedyNode, {
			chainId: parseInt(network, 16),
			symbol: chainData.symbol,
			name: chainData.name
		});

		// Verify JWT sender is the same as transaction's 'from'

		let transactionReceipt = await provider.getTransactionReceipt(transactionHash);
		if (transactionReceipt.from !== '0xEC30759D0A3F3CE0A730920DC29d74e441f492C3') {
			ctx.body = {success: false, message: `Authentication failed!`};
			next();
			return;
		}

		let result = transactionReceipt.logs.map(processLog);

		ctx.body = {success: true, message: `Found ${result.length} events!`, result};
	});

	app
		.use(router.routes())
		.use(router.allowedMethods());

	app.listen(process.env.PORT);
	console.log(`Listening on port: ${process.env.PORT}`);

	/*let logsData = data.logs;
	//let minterInstance = await new ethers.Contract(data.to, MinterAbi, provider);
	//console.log(minterInstance.filters.TokenMinted());
	//console.log();

	let eventSignature = "TokenMinted(address,address,uint256,uint256,uint256)"

	let topic = ethers.utils.id(eventSignature);

	logsData.forEach(item => {
		console.log(item);
		if (item.topics.includes(topic)) {
			console.log);
		}
	})
	*/
}




try {
	main();
} catch (e) {
	console.error(e);
}