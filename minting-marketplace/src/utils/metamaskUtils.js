import Swal from 'sweetalert2';

const handleError = (errorMessage, defaultError = undefined) => {
	//console.log('Reason:', errorMessage.reason)
	//console.log('Code', errorMessage.code)
	//console.log('Error', errorMessage.error)
	//console.log('Method', errorMessage.method)
	//console.log('Transaction', errorMessage.transaction);

	// Attempt #1: Smart Contract Error
	// Will have a readable revert message for the user
	let cleanError = errorMessage?.error?.message;

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
}

const metamaskCall = async (transaction, fallbackFailureMessage = undefined) => {
	let paramsValidation = undefined;
	try {
		paramsValidation = await transaction;
	} catch (errorMessage) {
		handleError(errorMessage, fallbackFailureMessage);
		return false;
	}
	if (paramsValidation?.wait) {
		try {
			await (paramsValidation).wait();
		} catch (errorMessage) {
			handleError(errorMessage, fallbackFailureMessage);
			return false;
		}
		return true;
	}
	return paramsValidation;
}

const validateInteger = (number) => {
	let stringified = number.toString();
	return ['e',',','.'].reduce((previous, current) => {
		return previous && !stringified.includes(current);
	}, true);
}

export { metamaskCall, validateInteger };