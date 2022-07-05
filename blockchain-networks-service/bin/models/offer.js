const mongoose = require("mongoose");

const { Schema } = mongoose;

const Offer = new Schema(
  {
    offerIndex: { type: String },
    contract: { type: Schema.ObjectId, required: true },
    product: { type: String, required: true },
    offerPool: { type: String },
    copies: { type: Number },
    soldCopies: { type: Number, default: 0 },
    sold: { type: Boolean, default: false },
    price: { type: String, required: true },
    range: { type: [String], required: true },
    offerName: { type: String, default: "Default", trim: true },
    creationDate: { type: Date, default: Date.now },
    diamond: { type: Boolean, required: true, default: false },
    diamondRangeIndex: { type: String, required: false },
    transactionHash: { type: String, required: false },
  },
  { versionKey: false }
);

Offer.pre("save", function (next) {
  this.copies = this.range[1] - this.range[0] + 1;
  if (!this.diamond && this.offerPool === undefined) {
    throw new Error("OfferPool is required in classic contracts");
  }
  if (!this.diamond && this.offerIndex === undefined) {
    throw new Error("OfferIndex is required in classic contracts");
  }
  next();
});

Offer.pre("insertMany", async function (next, offers) {
  if (Array.isArray(offers) && offers.length) {
    offers = offers.map((offer) => {
      offer.copies = Number(
        BigInt(offer.range[1]) - BigInt(offer.range[0]) + 1
      );
      return offer;
    });
  }

  next();
});

module.exports = Offer;
