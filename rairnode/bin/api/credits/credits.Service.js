const { getBytes } = require('ethers');
const { UserCredit } = require('../../models');
const AppError = require('../../utils/errors/AppError');
const { creditHandlerAbi } = require('../../integrations/smartContracts');
const { getContractRunner, getInstance } = require('../../integrations/ethers/contractInstances');
const log = require('../../utils/logger')(module);

const addressMapping = {
  '0x5': '0xad78463579Ff43bdC917674c64749c35c7E325f5',
  '0x250': '0x6C9Ca38fFb93756a52f0072B72eA3C6769f87892',
};

exports.getUserCredits = async (req, res, next) => {
  try {
    const { blockchain, tokenAddress } = req.params;
    const foundCredit = await UserCredit.findOne({
      userAddress: req.session.userData.publicAddress,
      blockchain,
      erc777Address: tokenAddress,
    });

    let balance = 0;
    if (foundCredit) {
      balance = BigInt(foundCredit.amountOnChain) - BigInt(foundCredit.amountConsumed);
    }

    return res.json({ success: true, credits: balance.toString() });
  } catch (err) {
    return next(err);
  }
};

exports.generateWithdrawRequest = async (req, res, next) => {
  try {
    const { blockchain, tokenAddress, amount } = req.body;

    const userData = await UserCredit.findOne({
      userAddress: req.user.publicAddress,
      blockchain,
      erc777Address: tokenAddress,
    });

    if (!userData) {
      return next(new AppError('Invalid withdraw request', 400));
    }
    const balance = BigInt(userData.amountOnChain) - BigInt(userData.amountConsumed);
    if (balance < BigInt(amount)) {
      return next(new AppError('Cannot withdraw that amount', 403));
    }

    if (!process.env.WITHDRAWER_PRIVATE_KEY) {
      return next(new AppError('Cannot process withdrawals at the moment', 500));
    }

    let withdrawHash;
    try {
      const wallet = await getContractRunner(
        blockchain,
        blockchain === '0x250',
        true,
      );
      const creditSystemInstance = await getInstance(
        blockchain,
        addressMapping[blockchain],
        creditHandlerAbi,
        true,
        true,
      );
      withdrawHash = await creditSystemInstance.getWithdrawHash(
        req.user.publicAddress,
        tokenAddress,
        amount,
      );
      if (!withdrawHash) {
        return next(new AppError('Invalid signature', 500));
      }
      const signedWithdrawHash = await wallet.signMessage(getBytes(withdrawHash));
      return res.json({ success: true, hash: signedWithdrawHash });
    } catch (err) {
      log.error(err);
      return next(new AppError('An error has ocurred', 500));
    }
    } catch (err) {
    return next(err);
  }
};
