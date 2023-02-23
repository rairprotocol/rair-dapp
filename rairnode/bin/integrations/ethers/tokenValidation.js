const { JsonRpcProvider, Network } = require('ethers');
const ethers = require('ethers');
const log = require('../../utils/logger')(module);
const RAIR_ERC721Abi = require('./contracts/RAIR_ERC721.json').abi;

const config = require('../../config');

let maticTestnet = new Network('Matic Testnet', 0x13881);
let maticMainnet = new Network('Matic Mainnet', 0x89);
let binanceTestnet = new Network('Binance Testnet', 0x61);
let binanceMainnet = new Network('Binance Mainnet', 0x38);
let ethereumGoerli = new Network('Ethereum Goerli', 0x5);
let ethereumMainnet = new Network('Ethereum Mainnet', 0x1);

const v6Networks = {
  '0x13881': maticTestnet,
  mumbai: maticTestnet,
  '0x89': maticMainnet,
  matic: maticMainnet,
  '0x61': binanceTestnet,
  'binance-testnet': binanceTestnet,
  '0x38': binanceMainnet,
  'binance-mainnet': binanceMainnet,
  '0x1': ethereumMainnet,
  ethereum: ethereumMainnet,
  '0x5': ethereumGoerli,
  goerli: ethereumGoerli,
}

const endpoints = {
  '0x13881': process.env.MATIC_TESTNET_RPC,
  mumbai: process.env.MATIC_TESTNET_RPC,
  '0x89': process.env.MATIC_MAINNET_RPC,
  matic: process.env.MATIC_MAINNET_RPC,
  '0x61': process.env.BINANCE_TESTNET_RPC,
  'binance-testnet': process.env.BINANCE_TESTNET_RPC,
  '0x38': process.env.BINANCE_MAINNET_RPC,
  'binance-mainnet': process.env.BINANCE_MAINNET_RPC,
  '0x1': process.env.ETHEREUM_MAINNET_RPC,
  ethereum: process.env.ETHEREUM_MAINNET_RPC,
  '0x5': process.env.ETHEREUM_TESTNET_GOERLI_RPC,
  goerli: process.env.ETHEREUM_TESTNET_GOERLI_RPC,
};

/**
 * Check that a public address has tokens in a product inside a RAIR-ERC721 contract
 * @param  {string} accountAddress      Account to check balance of
 * @param  {string} blockchain          Endpoint where Infura gets connected
 * @param  {string} contractAddress     Address of RAIR ERC721 contract
 * @param  {string} productId           Product ID within the contract
 * @param  {string} offerRangeStart     Start of the range to look for
 * @param  {string} offerRangeEnd       End of the range to look for
 * @return {boolean}               			Returns true if the account has at least one of the given token
 */
async function checkBalanceProduct(
  accountAddress,
  blockchain,
  contractAddress,
  productId,
  offerRangeStart,
  offerRangeEnd
) {
  // Static RPC Providers are used because the chain ID *WILL NOT* change,
  //		doing this we save calls to the blockchain to verify Chain ID
  try {
    let provider = new ethers.providers.StaticJsonRpcProvider(
      endpoints[blockchain]
    );
    const tokenInstance = new ethers.Contract(
      contractAddress,
      RAIR_ERC721Abi,
      provider
    );
    const result = await tokenInstance.hasTokenInProduct(
      accountAddress,
      productId,
      offerRangeStart,
      offerRangeEnd
    );
    delete provider;
    return result;
  } catch (error) {
    log.error(
      'Error querying a range of NFTs on RPC: ',
      endpoints[blockchain]
    );
    log.error(error);
  }
  return false;
}

/**
 * Check that a public address has a specific token inside an ERC721 contract
 * @param  {string} accountAddress      Account to check balance of
 * @param  {string} blockchain          Endpoint where Infura gets connected
 * @param  {string} contractAddress     Address of RAIR ERC721 contract
 * @param  {string} tokenId 			      Token to look for
 * @return {boolean}                		Returns true if the account owns the token
 */
async function checkBalanceSingle(
  accountAddress,
  blockchain,
  contractAddress,
  tokenId
) {
  // Static RPC Providers are used because the chain ID *WILL NOT* change,
  //		doing this we save calls to the blockchain to verify Chain ID
  try {
    let provider = new ethers.providers.StaticJsonRpcProvider(
      endpoints[blockchain]
    );
    const tokenInstance = new ethers.Contract(
      contractAddress,
      RAIR_ERC721Abi,
      provider
    );
    const result = await tokenInstance.ownerOf(tokenId);
    delete provider;
    return result.toLowerCase() === accountAddress;
  } catch (error) {
    console.error(
      'Error querying a single NFT on RPC: ',
      endpoints[blockchain]
    );
    log.error(error);
  }
  return false;
}

const checkBalanceAny = async (userAddress, chain, contractAddress) => {
  try {
    let provider = new JsonRpcProvider(
      endpoints[chain], v6Networks[chain], {
        staticNetwork: v6Networks[chain]
      }
    );
    const tokenInstance = new ethers.Contract(
      contractAddress,
      RAIR_ERC721Abi,
      provider
    );
    const result = await tokenInstance.balanceOf(userAddress);
    return result > 0;
  } catch (err) {
    log.error(`Error querying tokens for user ${userAddress} from admin Contract.`);
    log.error(err);
    return false;
  }
}

async function checkAdminTokenOwns(accountAddress) {
  return await checkBalanceAny(accountAddress, config.admin.network, config.admin.contract);
}

module.exports = {
  checkBalanceProduct,
  checkBalanceSingle,
  checkAdminTokenOwns,
  checkBalanceAny
};
