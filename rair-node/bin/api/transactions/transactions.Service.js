const { redisPublisher } = require('../../services/redis');

module.exports = {
    processUserTransaction: async (req, res, next) => {
        try {
            const { network, hash } = req.params;
            await redisPublisher.publish('transactions', JSON.stringify({
                network,
                hash,
                userData: req.session.userData,
            }));
            res.json({
                success: true,
            });
        } catch (e) {
            next(e);
        }
    },
};
