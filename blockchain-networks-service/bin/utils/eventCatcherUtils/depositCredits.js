/*
    event ReceivedTokens(
        address userAddress,
        address tokenAddress,
        uint amount,
        uint totalTokensDeposited
    );
*/
const { BigNumber } = require('ethers');
const { UserCreditMovement, UserCredit } = require('../../models');
const {
  handleDuplicateKey,
  log,
} = require('./eventsCommonUtils');

module.exports = async (
  dbModels,
  chainId,
  transactionReceipt,
  diamondEvent,
  userAddress,
  tokenAddress,
  amount,
  totalTokensDeposited,
) => {
  let foundCredits = await UserCredit.findOne({
    userAddress: userAddress.toLowerCase(),
    blockchain: chainId,
    erc777Address: tokenAddress,
  });

  if (!foundCredits) {
    foundCredits = new UserCredit({
      userAddress: userAddress.toLowerCase(),
      blockchain: chainId,
      erc777Address: tokenAddress,
    });
  }

  let currentCredits = BigNumber.from(foundCredits.amountOnChain.toString());
  currentCredits = currentCredits.add(amount);

  foundCredits.amountOnChain = currentCredits.toString();

  if (!currentCredits.eq(foundCredits.amountOnChain.toString())) {
    log.error(`Balance of credits for ${userAddress} in ${chainId}:${tokenAddress} doesn't match on database, have ${foundCredits.amountOnChain.toString()}, blockchain says ${totalTokensDeposited.toString()}`);
  }

  const balanceChange = new UserCreditMovement({
    userAddress: userAddress.toLowerCase(),
    blockchain: chainId,
    erc777Address: tokenAddress,
    balanceChange: amount.toString(),
  });
  balanceChange.save().catch(handleDuplicateKey);

  foundCredits
    .save()
    .catch(handleDuplicateKey);

  return [foundCredits];
};
