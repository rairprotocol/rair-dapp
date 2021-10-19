const Moralis = require('moralis/node');
require('dotenv').config();
const main = async () => {
	const serverUrl = process.env.MORALIS_SERVER;
	const appId = process.env.MORALIS_API_KEY;
	Moralis.start({ serverUrl, appId });

	console.log(Moralis.Cloud);
	return;
	polygonGetProducts = async (request) => {
		const logger = Moralis.Cloud.getLogger();
		const WatchedAddresses = Moralis.Object.extend("WatchedPolygonAddress");
		const query = new Moralis.Query(WatchedAddresses); 
		const results = await query.find();
		results.forEach(
			async item => {
				const options = {
					chain: "mumbai",
					address: item.get('address'),
					topic: "0x8d3d82130aebba03bb48b5d158bc2bbb4647856765b1089e7250507307965af9",
					abi: {
						"anonymous": false,
						"inputs": [
							{
								"indexed": true,
								"internalType": "uint256",
								"name": "id",
								"type": "uint256"
							},
							{
								"indexed": false,
								"internalType": "string",
								"name": "name",
								"type": "string"
							},
							{
								"indexed": false,
								"internalType": "uint256",
								"name": "startingToken",
								"type": "uint256"
							},
							{
								"indexed": false,
								"internalType": "uint256",
								"name": "length",
								"type": "uint256"
							}
						],
						"name": "ProductCreated",
						"type": "event"
					}
				};
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
						product.set("productEndingToken", result.data.length + result.data.startingToken);
						product.set("chainId", '0x13881');
						await product.save();
						logger.info('Saved product', result.data.uid, 'of', result.address); 
					}
				})
			});
	};
}

try {
	main();
} catch (err) {
	console.error(err);
}