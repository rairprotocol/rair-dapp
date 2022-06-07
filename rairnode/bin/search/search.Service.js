// const MintedToken = require("../models/mintedToken");
// const User = require("../models/user");
const getMany = async (model, query, projection, limit) => {
  if (limit) {
    return model.find(query, projection).sort({ creationDate: 1 }).limit(limit);
  }
  return model.find(query, projection);
};
exports.searchUsers = async (textForSearch, User, limit) => {
  const userSearchQuery = {
    nickName: { $regex: `.*${textForSearch}.*`, $options: 'i' },
  };
  const userProjection = { _id: 1, avatar: 1, nickName: 1 };
  const users = await getMany(User, userSearchQuery, userProjection, limit);
  return users;
};

exports.searchProducts = async (textForSearch, Product, limit) => {
  const productSearchQuery = {
    name: { $regex: `.*${textForSearch}.*`, $options: 'i' },
  };
  const productProjection = {
    _id: 1,
    name: 1,
    cover: 1,
    copies: 1,
    collectionIndexInContract: 1,
    title: 1,
    user: 1,
    contract: 1,
  };
  // Route - api/contracts/singleContract/:contractId returns contract based on its id
  // not combination of adress and network
  const products = await Product.aggregate([
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
          productSearchQuery,
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
    .sort({ creationDate: 1 })
    .limit(limit);
  return products;
};

exports.searchTokens = async (textForSearch, MintedToken, limit) => {
  const tokenSearchQuery = {
    $or: [
      { 'metadata.name': { $regex: `.*${textForSearch}.*`, $options: 'i' } },
      {
        'metadata.description': {
          $regex: `.*${textForSearch}.*`,
          $options: 'i',
        },
      },
    ],
  };
  const tokenProjection = {
    _id: 1,
    contract: 1,
    uniqueIndexInContract: 1,
    'metadata.name': 1,
    'metadata.description': 1,
    'metadata.animation_url': 1,
    'metadata.image': 1,
    'metadata.artist': 1,
  };
  const tokens = await getMany(
    MintedToken,
    tokenSearchQuery,
    tokenProjection,
    limit,
  );
  return tokens;
};

exports.globalSearch = (dbContext, allFlag) => async (req, res, next) => {
  try {
    let limit = 4;
    if (allFlag) {
      limit = 20;
    } // checks as bool -> not needed to set undefined
    const { User, Product, MintedToken } = dbContext.db;
    const textForSearch = req.params.textParam;
    // User search
    const users = await this.searchUsers(textForSearch, User, limit);
    const products = await this.searchProducts(textForSearch, Product, limit);
    const tokens = await this.searchTokens(textForSearch, MintedToken, limit);
    if (users.length === 0 && products.length === 0 && tokens.length === 0) {
      return res.json({ success: false, message: 'Nothing found...' });
    }
    const data = { users, products, tokens };
    return res.json({ success: true, data });
  } catch (err) {
    return next(err);
  }
};
