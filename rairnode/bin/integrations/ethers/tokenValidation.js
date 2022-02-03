const ethers = require('ethers')
const RAIR_ERC721Abi = require('./contracts/RAIR_ERC721.json').abi;

const endpoints = {
	'0x13881': process.env.MATIC_TESTNET_RPC,
	'polygon': process.env.MATIC_MAINNET_RPC,
	'0x61': process.env.BINANCE_TESTNET_RPC,
	'0x1': process.env.ETHEREUM_MAINNET_RPC,
	'0x5': process.env.ETHEREUM_TESTNET_GOERLI_RPC
}

/**
 * Check that a public address has tokens in a product inside a RAIR-ERC721 contract
 * @param  {string} accountAddress      Account to check balance of
 * @param  {string} blockchain          Endpoint where Infura gets connected
 * @param  {string} contractAddress     Address of RAIR ERC721 contract
 * @param  {string} productId           Product ID within the contract
 * @param  {number} offerRangeStart     Start of the range to look for
 * @param  {number} offerRangeEnd       End of the range to look for
 * @return {boolean}               			Returns true if the account has at least one of the given token
 */
async function checkBalanceProduct (accountAddress, blockchain, contractAddress, productId, offerRangeStart, offerRangeEnd) {
	const provider = new ethers.providers.JsonRpcProvider(endpoints[blockchain]);
	const tokenInstance = new ethers.Contract(contractAddress, RAIR_ERC721Abi, provider);
	const result = await tokenInstance.hasTokenInProduct(accountAddress, productId, offerRangeStart, offerRangeEnd);
	return result
}

/**
 * Check that a public address has a specific token inside an ERC721 contract
 * @param  {string} accountAddress      Account to check balance of
 * @param  {string} blockchain          Endpoint where Infura gets connected
 * @param  {string} contractAddress     Address of RAIR ERC721 contract
 * @param  {number} tokenId 			      Token to look for
 * @return {boolean}                		Returns true if the account owns the token
 */
async function checkBalanceSingle (accountAddress, blockchain, contractAddress, tokenId) {
	const provider = new ethers.providers.JsonRpcProvider(endpoints[blockchain]);
	const tokenInstance = new ethers.Contract(contractAddress, RAIR_ERC721Abi, provider);
	const result = await tokenInstance.ownerOf(tokenId);
	return result.toLowerCase() === accountAddress;
}

module.exports = {
  checkBalanceProduct,
  checkBalanceSingle
}
