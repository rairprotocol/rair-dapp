const Web3 = require('web3')

const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID

const web3 = new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`))

/**
 * Check that a given Ethereum account has tokens in a ERC1155
 * @param  {string} accountAddress  Account to check balance of
 * @param  {string} contractAddress Address of ERC1155 contract
 * @param  {string} tokenId         Token ID within the contract
 * @return {boolean}                Returns true if the account has at least one of the given token
 */
async function accountTokenBalance (accountAddress, contractAddress, tokenId) {
  const tokenContract = new web3.eth.Contract(require('./erc1155-abi.json'), contractAddress)
  const result = await tokenContract.methods.balanceOf(accountAddress, tokenId).call()
  return parseInt(result)
}

module.exports = {
  accountTokenBalance
}
