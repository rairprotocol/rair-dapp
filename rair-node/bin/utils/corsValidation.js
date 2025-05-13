const { ServerSetting } = require('../models');

module.exports = {
    origin: (origin, callback) => {
        (async () => {
            const settings = await ServerSetting.findOne();
            if (
                !settings?.allowedCORSOrigins ||
                settings?.corsEnabled === false ||
                origin === undefined ||
                settings.allowedCORSOrigins.includes(origin)
            ) {
                return callback(undefined, true);
            }
            return callback(new Error('Not allowed by CORS'));
        })();
    },
    corsOptionDelegate: async (req, callback) => {
        let corsOptions;
        const settings = await ServerSetting.findOne();
        // console.info('Origin:', req.header('Origin'));
        if (settings.allowedCORSOrigins.includes(req.header('Origin'))) {
            corsOptions = { origin: true };
        } else {
            corsOptions = { origin: false };
        }
        callback(null, corsOptions);
    },
};
