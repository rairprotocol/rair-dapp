const { User, Notification } = require('../../models');
const log = require('../../utils/logger')(module);

const emitEvent = (socketIo) => async (address, type, message, data = []) => {
    try {
        if (!address) {
            log.info(`Cannot emit event, invalid address ${address}`);
        }
        const userData = await User.findOne({ publicAddress: address });
        if (!userData) {
            log.info(`Cannot emit event, invalid address ${address}`);
        }
        // Array to be expanded as more event types are made
        if ([
            'message',
            'resalePurchase',
            'tokenMint',
        ].includes(type)) {
            const notification = new Notification({
                user: address,
                type,
                message,
                data,
            });
            await notification.save();
        }
        socketIo.to(address).emit(type, { message, data });
    } catch (err) {
        log.info('Cannot emit event', err);
    }
};

module.exports = {
    emitEvent,
};
