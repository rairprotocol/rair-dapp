//@ts-nocheck
import Swal from 'sweetalert2';
import { rFetch } from './rFetch';

// 2 for the transaction catcher, 1 for speed
const confirmationsRequired = 2;

const handleError = (errorMessage, defaultError = undefined) => {
	//console.log('Reason:', errorMessage.reason)
	//console.log('Code', errorMessage.code)
	//console.log('Error', errorMessage.error)
	//console.log('Method', errorMessage.method)
	//console.log('Transaction', errorMessage.transaction);

	let cleanError;

	if (errorMessage.cancelled) {
		cleanError = "The transaction has been cancelled!";
	} else if (errorMessage.receipt) {
		//console.log('Repriced');
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
			cleanError = errorMessage?.toString()?.split('"message":"execution reverted: ')?.at(1)?.split('"')?.at(0);
		}
	}

	// Last Attempt: Default Error Message
	if (!cleanError || cleanError?.includes('=') || cleanError?.includes('0x')) {
		cleanError = defaultError ? defaultError : 'An unexpected error has ocurred on your transaction, please try again later.';
	}

	Swal.fire('Error', cleanError, 'error');
	return false;
}

const metamaskCall = async (transaction, fallbackFailureMessage: string | undefined = undefined): any => {
	let paramsValidation = undefined;
	try {
		paramsValidation = await transaction;
	} catch (errorMessage) {
		handleError(errorMessage, fallbackFailureMessage);
		return false;
	}
	if (paramsValidation?.wait) {
		let transactionReceipt;
		try {
			transactionReceipt = await (paramsValidation).wait(confirmationsRequired);
		} catch (errorMessage) {
			return handleError(errorMessage, fallbackFailureMessage);
		}
		if (transactionReceipt) {
			handleReceipt(transactionReceipt)
		}
		return true;
	}
	return paramsValidation;
}

const handleReceipt = async (transactionReceipt) => {
	//console.log('Handling Receipt', transactionReceipt);
	// Use window.ethereum.chainId because switching networks on Metamask cancels all transactions
	await rFetch(`/api/transaction/${window.ethereum.chainId}/${transactionReceipt.transactionHash}`, {
		method: 'POST'
	});
}

const validateInteger = (number) => {
	if (number === undefined || number === "") {
		return false;
	}
	let stringified = number.toString();
	return ['e', ',', '.'].reduce((previous, current) => {
		return previous && !stringified.includes(current);
	}, true);
}

export { metamaskCall, validateInteger };