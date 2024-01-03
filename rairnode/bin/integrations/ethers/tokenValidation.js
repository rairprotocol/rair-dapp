const log = require('../../utils/logger')(module);
const config = require('../../config');
const { getInstance } = require('./contractInstances');
const { classicRAIR721Abi } = require('../smartContracts');

// Astar's gas limit is lower than other blockchains
// Without specifying the gas limit basic calls will fail
const specificOptions = {
  '0x250': {
    gasLimit: 4500000,
  },
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
    const tokenInstance = await getInstance(
      blockchain,
      contractAddress,
      classicRAIR721Abi,
      true,
    );
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
      `Error querying a range of NFTs on RPC for ${blockchain}`,
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
    const tokenInstance = await getInstance(
      blockchain,
      contractAddress,
      classicRAIR721Abi,
      true,
    );
    const args = [tokenId];
    if (specificOptions[blockchain]) {
      args.push(specificOptions[blockchain]);
    }
    const result = await tokenInstance.ownerOf(...args);
    return result.toLowerCase() === accountAddress;
  } catch (error) {
    log.error(
      `Error querying a single NFT on ${blockchain}`,
    );
    log.error(error);
  }
  return false;
}

const checkBalanceAny = async (userAddress, blockchain, contractAddress) => {
  try {
    const tokenInstance = await getInstance(
      blockchain,
      contractAddress,
      classicRAIR721Abi,
      true,
    );
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
