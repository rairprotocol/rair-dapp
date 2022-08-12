const mongoose = require('mongoose');

const { Schema } = mongoose;

const { DEFAULT_PRODUCT_COVER } = process.env;

const Product = new Schema(
  {
    name: { type: String, required: true, trim: true },
    collectionIndexInContract: { type: String, required: true }, // used only as productIndex
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
    singleMetadata: { type: Boolean, default: false },
    metadataURI: { type: String, default: 'none' },
  },
  { versionKey: false },
);
const defaultProjecttion = {
  _id: 1,
  name: 1,
  cover: 1,
  copies: 1,
  collectionIndexInContract: 1,
  title: 1,
  user: 1,
  contract: 1,
};
Product.statics = {
  async textSearch(
    productSearchQuery,
    productProjection = defaultProjecttion,
    limit = 4,
    page = 1,
  ) {
    const skip = (page - 1) * limit;
    return this.aggregate([
      { $match: productSearchQuery },
      {
        $lookup: {
          from: 'OfferPool',
          let: {
            contr: '$contract',
            prod: '$collectionIndexInContract',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$contract', '$$contr'],
                    },
                    {
                      $eq: ['$product', '$$prod'],
                    },
                  ],
                },
              },
            },
          ],
          as: 'offerPool',
        },
      },
      {
        $unwind: {
          path: '$offerPool',
          preserveNullAndEmptyArrays: true,
        },
      },

      // eslint-disable-next-line no-dupe-keys
      {
        $lookup: {
          from: 'Offer',
          let: {
            prod: '$collectionIndexInContract',
            contractL: '$contract',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$contract', '$$contractL'],
                    },
                    {
                      $eq: ['$product', '$$prod'],
                    },
                  ],
                },
              },
            },
          ],
          as: 'offers',
        },
      },

      {
        $match: {
          $and: [
            {
              $or: [
                { diamond: true, 'products.offers': { $not: { $size: 0 } } },
                {
                  diamond: { $in: [false, undefined] },
                  offerPool: { $ne: null },
                  'products.offers': { $not: { $size: 0 } },
                },
              ],
            },
          ],
        },
      },
      { $project: productProjection },
    ])
      .sort({ creationDate: -1 })
      .skip(skip)
      .limit(limit);
  },

  async search(
    textParam,
    projection = this.defaultProjecttion,
    limit = 4,
    page = 1,
  ) {
    // eslint-disable-next-line no-param-reassign
    if (limit > 100) limit = 100;
    // eslint-disable-next-line no-param-reassign
    if (page < 0) page = 0;
    let searchQuery = {
      $text: {
        $search: `"${textParam}"`,
        $language: 'en',
        $caseSensitive: false,
      },
    };
    return this.textSearch(searchQuery, projection, limit, page).then(
      (data) => {
        if (!data.length || data.length === 0) {
          searchQuery = {
            name: { $regex: `.*${textParam}.*`, $options: 'i' },
          };
          return this.textSearch(searchQuery, projection, limit, page);
        }
        return data;
      },
    );
  },
};
module.exports = Product;
