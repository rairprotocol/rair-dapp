const mongoose = require('mongoose');

const { Schema } = mongoose;

const CustomRoyaltiesSet = new Schema({
  // blockchaing prefix for contract adress
  blockchain: { type: String, required: true },
  // contractAddress: Address of the ERC721 contract (Contract schema)
  contractAddress: { type: String, required: true },
  // recipients: Number of addresses that will receive royalties
  recipients: { type: Number, required: true },
  // remainderForSeller: Percentage of the sale price left for the seller of the token
  remainderForSeller: { type: Number, required: true },
});
module.exports = CustomRoyaltiesSet;
