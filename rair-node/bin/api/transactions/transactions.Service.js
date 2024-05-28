const axios = require('axios');

module.exports = {
    processUserTransaction: async (req, res, next) => {
        try {
            const { network, hash } = req.params;
            const redisMessage = {
                toProcess: true,
                userPublicAddress: req.session.userData.publicAddress,
            };
            req.redisService.set(`${network}:${hash}`, redisMessage);
            const response = await axios({
                method: 'POST',
                url: `${process.env.BASE_BCN_URL}/api/v1/transaction/${network}/${hash}`,
                headers: req.headers,
                body: req.body,
            });
            res.json({
                success: response.data.success,
                foundEvents: response.data.foundEvents,
            });
        } catch (e) {
            next(e);
        }
    }
}