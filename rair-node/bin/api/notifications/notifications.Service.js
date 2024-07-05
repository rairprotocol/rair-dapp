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
            const list = await Notification.find(filter)
                .sort({ createdAt: 'descending' })
                .skip(itemsPerPage * pageNum)
                .limit(itemsPerPage);
            return res.json({
                success: true,
                notifications: list,
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
            const { ids } = req.body;
            const result = await Notification.updateMany({
                _id: { $in: ids },
            }, { $set: { read: true } });
            return res.json({
                success: true,
                updated: result.nModified,
            });
        } catch (err) {
            logger.error(err);
            return next(new AppError(err));
        }
    },
    deleteNotification: async (req, res, next) => {
        try {
            const { id } = req.params;
            const notification = await Notification.findByIdAndDelete(id);
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
};
