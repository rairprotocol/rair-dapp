const mongoose = require('mongoose');

const { Schema } = mongoose;

const Contract = new Schema(
  {
    title: { type: String, required: true, trim: true },
    user: { type: String, lowercase: true, required: true },
    blockchain: { type: String, required: true },
    contractAddress: { type: String, required: true, lowercase: true },
    diamond: { type: Boolean, required: true, default: false },
    creationDate: { type: Date, default: Date.now },
    transactionHash: { type: String, required: false },
    lastSyncedBlock: { type: String, required: false, default: '0' },
    external: { type: Boolean, required: true, default: false },
    singleMetadata: { type: Boolean, default: false },
    metadataURI: { type: String, default: 'none' },
  },
  { versionKey: false },
);
Contract.statics = {
  defaultProjection: {
    _id: 1,
    contractAddress: 1,
    title: 1,
    blockchain: 1,
    diamond: 1,
  },
  lookupProduct: {
    $lookup: {
      from: 'Product',
      let: {
        contr: '$_id',
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $eq: ['$contract', '$$contr'],
                },
              ],
            },
          },
        },
      ],
      as: 'products',
    },
  },
  lookupLockedTokens: {
    $lookup: {
      from: 'LockedTokens',
      let: {
        contr: '$_id',
        prod: '$products.collectionIndexInContract',
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
      as: 'tokenLock',
    },
  },
  offerPoolLookup: {
    $lookup: {
      from: 'OfferPool',
      let: {
        contr: '$_id',
        prod: '$products.collectionIndexInContract',
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
  offerLookup: {
    $lookup: {
      from: 'Offer',
      let: {
        prod: '$products.collectionIndexInContract',
        contractL: '$_id',
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
      as: 'products.offers',
    },
  },
  lookupProduct: {
    $lookup: {
      from: 'Product',
      let: {
        contr: '$_id',
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $eq: ['$contract', '$$contr'],
                },
              ],
            },
          },
        },
      ],
      as: 'products',
    },
  },
  lookupLockedTokens: {
    $lookup: {
      from: 'LockedTokens',
      let: {
        contr: '$_id',
        prod: '$products.collectionIndexInContract',
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
      as: 'tokenLock',
    },
  },
  offerPoolLookup: {
    $lookup: {
      from: 'OfferPool',
      let: {
        contr: '$_id',
        prod: '$products.collectionIndexInContract',
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
  offerLookup: {
    $lookup: {
      from: 'Offer',
      let: {
        prod: '$products.collectionIndexInContract',
        contractL: '$_id',
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
      as: 'products.offers',
    },
  },
};

module.exports = Contract;
