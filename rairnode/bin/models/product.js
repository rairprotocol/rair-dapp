const mongoose = require('mongoose');
const _ = require('lodash');

const { Schema } = mongoose;

const { DEFAULT_PRODUCT_COVER } = process.env;

const Product = new Schema(
  {
    name: { type: String, required: true, trim: true },
    collectionIndexInContract: { type: String, required: true }, //used only as productIndex
    contract: { type: Schema.ObjectId, required: true },
    copies: { type: Number, required: true },
    soldCopies: { type: Number, default: 0 },
    sold: { type: Boolean, default: false },
    royalty: { type: Number, default: 0 },
    firstTokenIndex: { type: String, required: true },
    cover: { type: String, default: DEFAULT_PRODUCT_COVER },
    category: { type: Schema.ObjectId },
    creationDate: { type: Date, default: Date.now },
    transactionHash: { type: String, required: false },
    diamond: { type: Boolean, required: true, default: false },
  },
  { versionKey: false }
);

Product.statics = {
  async searchPartial(filter, { sortBy, direction }) {
    const filters = _.omit(filter, 'query');

    return this.find(
      {
        name: new RegExp(_.get(filter, 'query', ''), 'gi'),
        ...filters,
      },
      null,
      { sort: { [sortBy]: direction } }
    );
  },

  async searchFull(filter, { sortBy, direction }) {
    const filters = _.omit(filter, 'query');

    return this.find(
      {
        $text: { $search: _.get(filter, 'query', ''), $caseSensitive: false },
        ...filters,
      },
      null,
      { sort: { [sortBy]: direction } }
    );
  },

  async search(filter, options = { sortBy: 'name', direction: 1 }) {
    return this.searchFull(filter, options)
      .then((data) => {
        if (!data.length || data.length === 0) return this.searchPartial(filter, options);
        return data;
      });
  },
};

module.exports = Product;
