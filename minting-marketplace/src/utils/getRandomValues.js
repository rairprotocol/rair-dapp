//@ts-nocheck
export const getRandomValues = () => {
    let array = new Uint32Array(10);
	window.crypto.getRandomValues(array);
    let random = null
	for (let i = 0; i < array.length; i++) {
		random = array[i];
	}
    return random
}