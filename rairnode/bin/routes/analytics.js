const express = require('express');
const { verifyUserSession, validation, isSuperAdmin } = require('../middleware');
const { MediaViewLog, File } = require('../models');
const AppError = require('../utils/errors/AppError');

const router = express.Router();

router.get(
    '/:mediaId',
    verifyUserSession,
    isSuperAdmin,
    validation('analyticsParams', 'params'),
    validation('analyticsQuery', 'query'),
    async (req, res, next) => {
        try {
            const { mediaId } = req.params;
            const mediaData = await File.findById(mediaId);
            if (!mediaData) {
                return next(new AppError('Invalid media Id', 404));
            }
            if (
                !req.user.superAdmin &&
                req.user.publicAddress !== mediaData.authorPublicAddress
            ) {
                return next(new AppError('Invalid user address', 403));
            }

            const { fromDate, toDate, userAddress, onlyCount } = req.query;
            let { itemsPerPage, pageNum } = req.query;
            if (!pageNum || pageNum === '') {
                pageNum = 1;
            }
            if (!itemsPerPage || itemsPerPage === '') {
                itemsPerPage = 10;
            }

            const pageSize = parseInt(itemsPerPage, 10);
            const skip = (parseInt(pageNum, 10) - 1) * pageSize;

            const query = {
                file: mediaId,
            };
            if (fromDate || toDate) {
                query.createdAt = {};
                if (fromDate) {
                    query.createdAt.$gte = fromDate;
                }
                if (toDate) {
                    query.createdAt.$lte = toDate;
                }
            }
            if (userAddress) {
                query.userAddress = userAddress;
            }

            const totalCount = await MediaViewLog.countDocuments(query);
            let results = false;
            if (!onlyCount) {
                results = await MediaViewLog.find(query, '-_id -updatedAt')
                    .skip(skip)
                    .limit(pageSize);
            }

            return res.json({
                success: true,
                results,
                totalCount,
            });
        } catch (e) {
            return next(e);
        }
    },
);

module.exports = router;
