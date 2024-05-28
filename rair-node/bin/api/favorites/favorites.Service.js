const { FavoriteTokens } = require('../../models');
const eFactory = require('../../utils/entityFactory');

const filterByUserAddress = async (userAddress) => FavoriteTokens.aggregate([
    {
        $lookup: {
            from: 'MintedToken',
            localField: 'token',
            foreignField: '_id',
            as: 'token',
        },
    },
    {
        $unwind: {
            path: '$token',
        },
    },
    {
        $lookup: {
            from: 'Contract',
            localField: 'token.contract',
            foreignField: '_id',
            as: 'contract',
        },
    },
    {
        $unwind: {
            path: '$contract',
        },
    },
    {
        $match: {
            userAddress,
            'contract.blockView': false,
        },
    },
]);

exports.createFavorite = eFactory.createOne(FavoriteTokens, { userAddress: 'user.publicAddress' });
exports.deleteFavorite = eFactory.deleteOne(FavoriteTokens);

exports.getAllFavoritesByUser = async (req, res, next) => {
    const result = await filterByUserAddress(req.user.publicAddress);
    return res.json({ success: true, result });
};
exports.getAllFavoritesOfAddress = async (req, res, next) => {
    const result = await filterByUserAddress(req.params.userAddress);
    return res.json({ success: true, result });
};
