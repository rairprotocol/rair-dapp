import Swal from 'sweetalert2';

const handleError = (errorMessage, defaultError = undefined) => {
	console.error(errorMessage);
	let cleanError = errorMessage?.data?.message;
	console.log(cleanError);
	if (!cleanError) {
		cleanError = errorMessage?.message;
		if (!cleanError) {
			cleanError = errorMessage?.toString()?.split('"message":"execution reverted: ')?.at(1)?.split('"')?.at(0);
		}
	}
	if (!cleanError || cleanError?.includes('=') || cleanError?.includes('0x')) {
		cleanError = defaultError ? defaultError : 'An unexpected error has ocurred on your transaction, please try again later.';
	}
	Swal.fire('Error', cleanError, 'error');
}

const metamaskCall = async (transaction, fallbackFailureMessage = undefined) => {
	console.log(transaction);
	let paramsValidation = undefined;
	try {
		paramsValidation = await transaction;
	} catch (errorMessage) {
		handleError(errorMessage, fallbackFailureMessage);
		return false;
	}
	if (paramsValidation.wait) {
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