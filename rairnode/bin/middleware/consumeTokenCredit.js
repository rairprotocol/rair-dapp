const { BigNumber } = require('alchemy-sdk');
const { UserCreditMovement, UserCredit } = require('../models');
const AppError = require('../utils/errors/AppError');

module.exports = (blockchain, price) => async (req, res, next) => {
    const foundCredit = await UserCredit.findOne({
        userAddress: req.session.userData.publicAddress,
        blockchain,
    });
    if (foundCredit) {
        if (BigNumber.from(foundCredit.amountOnChain.toString())
                .sub(foundCredit.amountConsumed.toString())
                .lt(price)
        ) {
            return next(new AppError('Insufficient token balance'));
        }
        const newBalanceChange = new UserCreditMovement({
            erc777Address: foundCredit.erc777Address,
            userAddress: foundCredit.userAddress,
            blockchain: foundCredit.blockchain,
            tokenAddress: foundCredit.tokenAddress,
            balanceChange: BigNumber.from(0).sub(price).toString(),
        });
        foundCredit.amountConsumed = BigNumber.from(foundCredit.amountConsumed.toString())
                                                .add(price).toString();
        await foundCredit.save();
        await newBalanceChange.save();
        return next();
    }
    return next(new AppError('Cannot find user credit data'));
};
