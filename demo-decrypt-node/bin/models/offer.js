const mongoose = require('mongoose');

const { Schema } = mongoose;

const Offer = new Schema({
  marketplaceCatalogIndex: { type: Number, unique: true, required: true },
  contract: { type: String, lowercase:true, required: true },
  product: { type: Number, required: true },
  copies: { type: Number, required: true },
  soldCopies: { type: Number, default: 0 },
  sold: { type: Boolean, default: false },
  price: { type: Number, required: true },
  resale: { type: Number, required: true },
  resaleEnabled: { type: Boolean },
  range: { type: [Number], required: true },
  creationDate: { type: Date, default: Date.now }
}, { versionKey: false });

Offer.pre('save', function (next) {
  if (this.resale > 0) {
    this.resaleEnabled = false;
    return next();
  }

  this.resaleEnabled = true;
  return next();
})

module.exports = Offer;
