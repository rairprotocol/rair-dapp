import { BigNumber, ethers } from 'ethers';

import { rFetch } from './rFetch';

// Deprecated, use web3TxHandler from useWeb3Tx (custom hook)
/*
// 2 for the transaction catcher, 1 for speed
const confirmationsRequired = 2;

const handleError = (
  errorMessage: any,
  defaultError: string | undefined = undefined
) => {
  //console.log('Reason:', errorMessage.reason)
  //console.log('Code', errorMessage.code)
  //console.log('Error', errorMessage.error)
  //console.log('Method', errorMessage.method)
  //console.log('Transaction', errorMessage.transaction);

  let cleanError = '';

  if (errorMessage.cancelled) {
    cleanError = 'The transaction has been cancelled!';
  } else if (
    errorMessage?.transaction?.blockNumber === null &&
    errorMessage?.receipt?.status === 0
  ) {
    cleanError = 'The transaction has failed on the blockchain';
  } else if (errorMessage.receipt) {
    //console.info('Repriced');
    handleReceipt(errorMessage.receipt);
    return true;
  }

  // Attempt #1: Smart Contract Error
  // Will have a readable revert message for the user
  if (!cleanError) {
    cleanError = errorMessage?.error?.message;
  }
  if (!cleanError) {
    cleanError = errorMessage?.data?.message;
  }

  // Attempt #2: Frontend Error
  // An error from sending the data to the blockchain
  if (!cleanError) {
    cleanError = errorMessage.reason;
  }

  // Attempt #3: Mid-Processing Error
  // Huge message that needs to be cleaned up
  if (!cleanError) {
    cleanError = errorMessage?.message;
    if (!cleanError) {
      cleanError = errorMessage
        ?.toString()
        ?.split("'message':'execution reverted: ")
        ?.at(1)
        ?.split("'")
        ?.at(0);
    }
  }

  // Last Attempt: Default Error Message
  if (!cleanError || cleanError?.includes('=') || cleanError?.includes('0x')) {
    cleanError = defaultError
      ? defaultError
      : 'An unexpected error has ocurred on your transaction, please try again later.';
  }

  Swal.fire('Error', cleanError, 'error');
  return false;
};

const metamaskCall = async (
  transaction: Promise<ethers.ContractTransaction>,
  fallbackFailureMessage: string | undefined = undefined,
  gotoNextStep: (() => void) | undefined = undefined
) => {
  // return type any
  // return type any
  // return type any
  // to get ContractReceipt if we have it we just return it if not we try to get it (throw in wait func(arg: number - number of confrim))
  // wait method exists only in Contract Transaction type
  let paramsValidation: any = undefined;
  try {
    paramsValidation = await transaction;
  } catch (errorMessage) {
    handleError(errorMessage, fallbackFailureMessage);
    return false;
  }
  if (paramsValidation?.wait) {
    let transactionReceipt: ethers.ContractReceipt;
    try {
      transactionReceipt = await paramsValidation.wait(confirmationsRequired);
    } catch (errorMessage) {
      return handleError(errorMessage, fallbackFailureMessage);
    }
    if (transactionReceipt && transactionReceipt.blockNumber) {
      handleReceipt(transactionReceipt, gotoNextStep);
    }
    return true;
  }
  return paramsValidation;
};*/

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
