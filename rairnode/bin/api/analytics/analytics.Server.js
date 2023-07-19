const fs = require('fs');
const path = require('path');
const { MediaViewLog, File } = require('../../models');
const AppError = require('../../utils/errors/AppError');

exports.getAnalyticsData = async (req, res, next) => {
    try {
        const { mediaId } = req.params;
        const mediaData = await File.findById(mediaId);
        if (!mediaData) {
            return next(new AppError('Invalid media Id', 404));
        }
        if (
            !req.user.superAdmin &&
            req.user.publicAddress !== mediaData.uploader
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
        const uniqueAddresses = await MediaViewLog.distinct('userAddress', { file: mediaId });
        if (!onlyCount) {
            results = await MediaViewLog.find(query, '-_id -updatedAt')
                .sort({ createdAt: 'descending' })
                .skip(skip)
                .limit(pageSize);
        }

        return res.json({
            success: true,
            results,
            totalCount,
            uniqueAddresses,
        });
    } catch (e) {
        return next(e);
    }
};

exports.getAnalyticsCSVReport = async (req, res, next) => {
    try {
        const { mediaId } = req.params;
        const mediaData = await File.findById(mediaId);
        if (!mediaData) {
            return next(new AppError('Invalid media Id', 404));
        }
        if (
            !req.user.superAdmin &&
            req.user.publicAddress !== mediaData.uploader
        ) {
            return next(new AppError('Invalid user address', 403));
        }

        const query = {
            file: mediaId,
        };

        const results = await MediaViewLog.find(query, '-_id -updatedAt')
            .sort({ createdAt: 'descending' });

        const delimiter = ';';

        const stringData = results.reduce((result, item) => {
            const line = `${item.userAddress}${delimiter} ${item.decryptedFiles}${delimiter} ${item.createdAt.toUTCString()}\n`;
            return `${result}${line}`;
        }, `User Address${delimiter} Files Decrypted${delimiter} Time Started${delimiter} File: ${mediaData.title} (${mediaId})\n`);
        const fileName = path.join(__dirname, `AnalyticReport-${mediaData.title}.csv`);

        fs.writeFileSync(fileName, stringData);

        await res.download(fileName);

        return setTimeout(() => {
            fs.rmSync(fileName);
        }, 2000);
    } catch (e) {
        return next(e);
    }
};
