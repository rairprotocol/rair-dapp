const mongoose = require('mongoose');

const { Schema } = mongoose;

const ResaleTokenOffer = new Schema({
  // operator: Operator that caused the event to be emitted
  operator: { type: String, required: true },
  // tokenAddress: Address of the ERC721 contract (Contract schema)
  contract: {
    type: mongoose.Schema.ObjectId,
    ref: 'Contract',
    required: true,
  },
  // tokenId: Index of the NFT put up for sale
  tokenId: { type: String, required: true },
  // price: Price (in wei) of the NFT.
  price: { type: String, required: true },
  // status: Open (0), Closed (1), Cancelled (2)
  status: { type: String, required: true },
  // tradeid: Index of the resale offer
  tradeid: { type: String, required: true },
});
module.exports = ResaleTokenOffer;
