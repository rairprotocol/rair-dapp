const { JsonRpcProvider, Network, Contract } = require('ethers');
const log = require('../../utils/logger')(module);
const config = require('../../config');
const { diamondFactoryAbi } = require('../smartContracts');

const astarMainnet = new Network('Astar Mainnet', 0x250);
const maticTestnet = new Network('Matic Testnet', 0x13881);
const maticMainnet = new Network('Matic Mainnet', 0x89);
const binanceTestnet = new Network('Binance Testnet', 0x61);
const binanceMainnet = new Network('Binance Mainnet', 0x38);
const ethereumGoerli = new Network('Ethereum Goerli', 0x5);
const ethereumMainnet = new Network('Ethereum Mainnet', 0x1);

// Astar's gas limit is lower than other blockchains
// Without specifying the gas limit basic calls will fail
const specificOptions = {
  '0x250': {
    gasLimit: 4500000,
  },
};

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
  astar: astarMainnet,
  '0x250': astarMainnet,
};

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
  astar: 'https://evm.astar.network', // Temporal solution, Alchemy struggles with calls
  '0x250': 'https://evm.astar.network',
};

const getInstance = async (blockchain, contractAddress) => {
  const provider = new JsonRpcProvider(endpoints[blockchain], v6Networks[blockchain], {
    staticNetwork: v6Networks[blockchain],
  });
  if (!endpoints[blockchain]) {
    throw Error(`Invalid blockchain requested: ${blockchain}`);
  }
  const tokenInstance = new Contract(
    contractAddress,
    diamondFactoryAbi,
    provider,
  );
  return tokenInstance;
};

/**
 * Check that a public address has tokens in a product inside a RAIR-ERC721 contract
 * @param  {string} accountAddress      Account to check balance of
 * @param  {string} blockchain          Endpoint where Infura gets connected
 * @param  {string} contractAddress     Address of RAIR ERC721 contract
 * @param  {string} productId           Product ID within the contract
 * @param  {string} offerRangeStart     Start of the range to look for
 * @param  {string} offerRangeEnd       End of the range to look for
 * @return {boolean}                    Returns true if the account has at least one token
 */
async function checkBalanceProduct(
  accountAddress,
  blockchain,
  contractAddress,
  productId,
  offerRangeStart,
  offerRangeEnd,
) {
  // Static RPC Providers are used because the chain ID *WILL NOT* change,
  //    doing this we save calls to the blockchain to verify Chain ID
  try {
    const tokenInstance = await getInstance(blockchain, contractAddress);
    const args = [
      accountAddress,
      productId,
      offerRangeStart,
      offerRangeEnd,
    ];
    const result = await tokenInstance.hasTokenInProduct(...args);
    return result;
  } catch (error) {
    log.error(
      `Error querying a range of NFTs on RPC for ${blockchain}: ${endpoints[blockchain]}`,
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
 * @param  {string} tokenId             Token to look for
 * @return {boolean}                    Returns true if the account owns the token
 */
async function checkBalanceSingle(
  accountAddress,
  blockchain,
  contractAddress,
  tokenId,
) {
  // Static RPC Providers are used because the chain ID *WILL NOT* change,
  //   doing this we save calls to the blockchain to verify Chain ID
  try {
    const tokenInstance = await getInstance(blockchain, contractAddress);
    const args = [tokenId];
    if (specificOptions[blockchain]) {
      args.push(specificOptions[blockchain]);
    }
    const result = await tokenInstance.ownerOf(...args);
    return result.toLowerCase() === accountAddress;
  } catch (error) {
    log.error(
      `Error querying a single NFT on RPC: ${endpoints[blockchain]}`,
    );
    log.error(error);
  }
  return false;
}

const checkBalanceAny = async (userAddress, blockchain, contractAddress) => {
  try {
    const tokenInstance = await getInstance(blockchain, contractAddress);
    const args = [userAddress];
    if (specificOptions[blockchain]) {
      args.push(specificOptions[blockchain]);
    }
    const result = await tokenInstance.balanceOf(...args);
    return result > 0;
  } catch (err) {
    log.error(`Error querying tokens for user ${userAddress} from admin Contract.`);
    log.error(err);
    return false;
  }
};

async function checkAdminTokenOwns(accountAddress) {
  return checkBalanceAny(accountAddress, config.admin.network, config.admin.contract);
}

module.exports = {
  checkBalanceProduct,
  checkBalanceSingle,
  checkAdminTokenOwns,
  checkBalanceAny,
};
