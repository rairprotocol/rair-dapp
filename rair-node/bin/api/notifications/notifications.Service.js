const { Notification } = require('../../models');
const AppError = require('../../utils/errors/AppError');
const logger = require('../../utils/logger')(module);

module.exports = {
    listNotifications: async (req, res, next) => {
        try {
            const {
                onlyRead,
                onlyUnread,
                type,
                user, pageNum = 0,
                itemsPerPage = 10,
            } = req.query;
            const { publicAddress, adminRights } = req.user;
            const filter = {
                user: publicAddress.toLowerCase(),
            };
            if (type) {
                filter.type = type;
            }
            if (onlyRead) {
                filter.read = true;
            }
            if (onlyUnread) {
                filter.read = false;
            }
            if (user && adminRights) {
                filter.user = user.toLowerCase();
            }
            const list = await Notification.aggregate([
                {
                    $match: filter,
                },
                {
                    $lookup: {
                        from: 'MintedToken',
                        let: {
                            tokenId: '$data',
                        },
                        pipeline: [
                            {
                            $match: {
                                $expr: {
                                    $in: [
                                        {
                                            $toString: '$_id',
                                        },
                                        '$$tokenId',
                                    ],
                                },
                            },
                            },
                        ],
                        as: 'tokenData',
                    },
                },
                {
                    $addFields: {
                        tokenData: '$tokenData.metadata.image',
                    },
                },
                { $sort: { createdAt: 1 } },
                { $skip: itemsPerPage * pageNum },
                { $limit: itemsPerPage },
            ]);
            const count = await Notification.count(filter);
            return res.json({
                success: true,
                notifications: list,
                totalCount: count,
            });
        } catch (err) {
            logger.error(err);
            return next(new AppError(err));
        }
    },
    getSingleNotification: async (req, res, next) => {
        try {
            const { id } = req.params;
            const notification = await Notification.findById(id);
            if (!notification) {
                return next(new AppError('Notification not found', 404));
            }
            return res.json({
                success: true,
                notification,
            });
        } catch (err) {
            logger.error(err);
            return next(new AppError(err));
        }
    },
    markNotificationAsRead: async (req, res, next) => {
        try {
            const { publicAddress } = req.user;
            const { ids } = req.body;
            const filter = {
                user: publicAddress,
            };
            if (ids.length) {
                filter._id = { $in: ids };
            }
            const result = await Notification.updateMany(
                filter,
                { $set: { read: true } },
            );
            return res.json({
                success: true,
                updated: result.modifiedCount,
            });
        } catch (err) {
            logger.error(err);
            return next(new AppError(err));
        }
    },
    deleteNotification: async (req, res, next) => {
        try {
            const { publicAddress } = req.user;
            const { ids } = req.body;
            const filter = {
                user: publicAddress,
            };
            if (ids.length) {
                filter._id = { $in: ids };
            }
            const result = await Notification.deleteMany(filter);
            return res.json({
                success: true,
                deleted: result.deletedCount,
            });
        } catch (err) {
            logger.error(err);
            return next(new AppError(err));
        }
    },
};
