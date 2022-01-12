import Swal from 'sweetalert2';

const metamaskCall = async (transaction) => {
	try {
		let paramsValidation = await transaction;
		//await (paramsValidation).wait();
		return true;
	} catch (e) {
		console.error(e);
		let cleanError = e?.data?.message;
		if (!cleanError) {
			cleanError = e?.toString()?.split('"message":"execution reverted: ')?.at(1)?.split('"')?.at(0);
		}
		Swal.fire('Error', cleanError ? cleanError : e?.message, 'error');
		return false;
	}
}

export { metamaskCall };