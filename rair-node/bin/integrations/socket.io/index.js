const { User } = require('../../models');
const log = require('../../utils/logger')(module);

const emitEvent = (socketIo) => async (address, type, message, data = {}) => {
    try {
        if (!address) {
            log.info(`Cannot emit event, invalid address ${address}`);
        }
        console.info(address, type, message, data);
        const userData = await User.findOne({ publicAddress: address });
        if (!userData) {
            log.info(`Cannot emit event, invalid address ${address}`);
        }
        socketIo.to(address).emit(type, message);
    } catch (err) {
        log.info('Cannot emit event', err);
    }
};

module.exports = {
    emitEvent,
};
