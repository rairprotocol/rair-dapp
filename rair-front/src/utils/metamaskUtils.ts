import { BigNumber, ethers } from 'ethers';

import { rFetch } from './rFetch';

const handleReceipt = async (
  transactionReceipt: ethers.ContractReceipt,
  gotoNextStep?: (() => void) | undefined
) => {
  //console.log('Handling Receipt', transactionReceipt);
  // Use window.ethereum.chainId because switching networks on Metamask cancels all transactions
  try {
    await rFetch(
      `/api/transaction/${window.ethereum.chainId}/${transactionReceipt.transactionHash}`,
      {
        method: 'POST'
      }
    );
    gotoNextStep && gotoNextStep();
  } catch (error) {
    console.error(error);
  }
};

const validateInteger = (number: string | number) => {
  if (
    number === undefined ||
    number.toString() === '' ||
    Number.isNaN(number)
  ) {
    return false;
  }
  try {
    BigNumber.from(number);
  } catch (err) {
    return false;
  }
  return true;
};

export { handleReceipt, validateInteger };
