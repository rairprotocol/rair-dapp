/*
    event ReceivedTokens(
        address userAddress,
        address tokenAddress,
        uint amount,
        uint totalTokensDeposited
    );
*/

const { BigNumber } = require('ethers');
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
  let foundCredits = await dbModels.UserCredit.findOne({
    userAddress: userAddress.toLowerCase(),
    blockchain: chainId,
    erc777Address: tokenAddress,
  });

  if (!foundCredits) {
    foundCredits = new dbModels.UserCredit({
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

  foundCredits
    .save()
    .catch(handleDuplicateKey);

  return [foundCredits];
};
