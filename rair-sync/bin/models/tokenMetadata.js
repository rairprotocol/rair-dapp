const mongoose = require('mongoose');

const { Schema } = mongoose;

const attributeData = new Schema({
  name: { type: String, required: true },
  values: [{ type: String, required: true }],
  quantity: [{ type: Number, required: true }],
}, { _id: false });

const TokenMetadata = new Schema(
  {
    contract: { type: Schema.ObjectId, ref: 'Offer', required: false },
    product: { type: Number, required: true },
    attributes: [{
      type: attributeData, required: true, default: () => ({}),
    }],
  },
  { versionKey: false, timestamps: false },
);

module.exports = TokenMetadata;
