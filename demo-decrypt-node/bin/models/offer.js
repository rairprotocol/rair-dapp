const mongoose = require('mongoose');

const { Schema } = mongoose;

const Offer = new Schema({
  rangeIndex: { type: Number, required: true },
  contract: { type: String, lowercase:true, required: true },
  product: { type: Number, required: true },
  offerPool: { type: Number, required: true },
  copies: { type: Number },
  soldCopies: { type: Number, default: 0 },
  sold: { type: Boolean, default: false },
  price: { type: Number, required: true },
  range: { type: [Number], required: true },
  rangeName: { type: String },
  creationDate: { type: Date, default: Date.now }
}, { versionKey: false });

Offer.pre('save', function (next) {
  this.copies = (this.range[1] - this.range[0]) + 1;
  next();
});

module.exports = Offer;
