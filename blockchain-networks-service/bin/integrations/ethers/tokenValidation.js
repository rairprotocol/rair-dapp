const ethers = require("ethers");
const RAIR_ERC721Abi = require("./contracts/RAIR_ERC721.json").abi;
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;

// Left are names that can be modified, right are the names of the endpoints on Infura
const endpoints = {
  mumbai: "polygon-mumbai",
  polygon: "polygon-mainnet",
  ethereum: "mainnet",
  goerli: "goerli",
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
  const provider = new ethers.providers.JsonRpcProvider(
    `https://${endpoints[blockchain]}.infura.io/v3/${INFURA_PROJECT_ID}`
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
  return result;
}

/**
 * Check that a public address has a specific token inside an ERC721 contract
 * @param  {string} accountAddress      Account to check balance of
 * @param  {string} blockchain          Endpoint where Infura gets connected
 * @param  {string} contractAddress     Address of RAIR ERC721 contract
 * @param  {number} tokenId 			      Token to look for
 * @return {boolean}                		Returns true if the account owns the token
 */
async function checkBalanceSingle(
  accountAddress,
  blockchain,
  contractAddress,
  tokenId
) {
  const provider = new ethers.providers.JsonRpcProvider(
    `https://${endpoints[blockchain]}.infura.io/v3/${INFURA_PROJECT_ID}`
  );
  const tokenInstance = new ethers.Contract(
    contractAddress,
    RAIR_ERC721Abi,
    provider
  );
  const result = await tokenInstance.ownerOf(tokenId);
  console.log(result);
  return result.toLowerCase() === accountAddress;
}

module.exports = {
  checkBalanceProduct,
  checkBalanceSingle,
};
