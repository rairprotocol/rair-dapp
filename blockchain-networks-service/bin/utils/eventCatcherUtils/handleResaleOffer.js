const { MintedToken, ResaleTokenOffer } = require('../../models');
const { findContractFromAddress, log } = require('./eventsCommonUtils');

module.exports = async (
  dbModels,
  chainId,
  transactionReceipt,
  diamondEvent,
  operator,
  tokenAddress,
  tokenId,
  price,
  status,
  tradeid,
) => {
  const contract = await findContractFromAddress(
    tokenAddress,
    chainId,
    transactionReceipt,
  );

  if (!contract) {
    return;
  }

  const token = await MintedToken.findOne({
    contract: contract._id,
    uniqueIndexInContract: tokenId,
  });

  if (!token) {
    return;
  }

  let resaleOffer = await ResaleTokenOffer.findOne({
    contract: contract._id,
    tokenId,
    tradeid,
    status: 0,
  });

  if (resaleOffer) {
    switch (status.toString()) {
      case '1':
        log.info('OFFER CLOSED');
        token.ownerAddress = operator.toLowerCase();
        break;
      case '2':
        log.info('OFFER CANCELLED');
        break;
      default:
        log.info('Unsupported status', status);
        return;
    }
    resaleOffer.status = status;
  } else {
    resaleOffer = await new dbModels.ResaleTokenOffer({
      operator,
      contract: contract._id,
      tokenId,
      price,
      status,
      tradeid,
    });
  }
  await token.save();
  await resaleOffer.save();
};
