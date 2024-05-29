/*
    event WithdrewCredit(
        address user,
        address token,
        uint amount
    );
*/

const { BigNumber } = require('ethers');
const { UserCredit } = require('../../models');
const {
  handleDuplicateKey,
} = require('./eventsCommonUtils');

module.exports = async (
  transactionData,
  // Contains
  /*
    network,
    transactionHash,
    fromAddress,
    diamondEvent,
  */
  user,
  token,
  amount,
) => {
  const foundCredits = await UserCredit.findOne({
    userAddress: user.toLowerCase(),
    blockchain: transactionData.network,
    erc777Address: token,
  });

  if (!foundCredits) {
    return undefined;
  }

  let currentCredits = BigNumber.from(foundCredits.amountOnChain.toString());
  currentCredits = currentCredits.sub(amount);

  foundCredits.amountOnChain = currentCredits.toString();

  foundCredits
    .save()
    .catch(handleDuplicateKey);

  return [foundCredits];
};
