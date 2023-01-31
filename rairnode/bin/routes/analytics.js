const express = require('express');
const { JWTVerification, validation } = require('../middleware');
const { MediaViewLog } = require('../models');

const router = express.Router();

router.get(
    '/:mediaId',
    JWTVerification,
    validation('analyticsParams', 'params'),
    validation('analyticsQuery', 'query'),
    async (req, res, next) => {
        try {
            const { mediaId } = req.params;
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

            res.json({
                success: true,
                results,
                totalCount,
            });
        } catch (e) {
            next(e);
        }
    },
);

module.exports = router;
