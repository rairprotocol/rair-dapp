import Swal from 'sweetalert2';

const handleError = (errorMessage) => {
	console.error(errorMessage);
	let cleanError = errorMessage?.data?.message;
	if (!cleanError) {
		cleanError = errorMessage?.toString()?.split('"message":"execution reverted: ')?.at(1)?.split('"')?.at(0);
	}
	Swal.fire('Error', cleanError ? cleanError : errorMessage?.message, 'error');
}

const metamaskCall = async (transaction) => {
	let paramsValidation = undefined;
	try {
		paramsValidation = await transaction;
	} catch (errorMessage) {
		handleError(errorMessage)
		return false;
	}
	try {
		await (paramsValidation).wait();
	} catch (errorMessage) {
		handleError(errorMessage)
		return false;
	}
	return true;
}

export { metamaskCall };