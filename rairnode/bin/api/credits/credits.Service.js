const { Contract, getBytes } = require('ethers');
const { Alchemy, Wallet } = require('alchemy-sdk');
const { UserCredit } = require('../../models');
const AppError = require('../../utils/errors/AppError');
const { alchemy } = require('../../config');
const { creditHandlerAbi } = require('../../integrations/smartContracts');

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
    const config = {
      apiKey: alchemy.apiKey,
      network: alchemy.networkMapping[blockchain],
    };

    const userData = await UserCredit.findOne({
      userAddress: req.session.userData.publicAddress,
      blockchain,
      erc777Address: tokenAddress,
    });

    if (!userData) {
      return next(new AppError('Invalid withdraw request'));
    }
    const balance = BigInt(userData.amountOnChain) - BigInt(userData.amountConsumed);
    if (balance < BigInt(amount)) {
      return next(new AppError('Cannot withdraw that amount'));
    }

    const alchemySdk = new Alchemy(config);

    if (!process.env.WITHDRAWER_PRIVATE_KEY) {
      return next(new AppError('Cannot process withdrawals at the moment'));
    }
    const wallet = new Wallet(process.env.WITHDRAWER_PRIVATE_KEY, alchemySdk);

    const creditSystemInstance = new Contract(
      addressMapping[blockchain],
      creditHandlerAbi,
      wallet,
    );

    const withdrawHash = await creditSystemInstance.getWithdrawHash(
      req.session.userData.publicAddress,
      tokenAddress,
      amount,
    );

    if (!withdrawHash) {
      return next(new AppError('Invalid signature'));
    }

    const signedWithdrawHash = await wallet.signMessage(getBytes(withdrawHash));

    return res.json({ success: true, hash: signedWithdrawHash });
    } catch (err) {
    return next(err);
  }
};
