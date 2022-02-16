const Ethers = require('ethers');

module.exports = {
	getABIData: (abi, type = 'event', eventName) => {
		const [resultingAbi] = abi.filter(item => {
			return item.type === type && item.name === eventName
		})
		const instance = new Ethers.Contract(Ethers.constants.AddressZero, abi);
		const [topic] = Object.keys(instance.filters).filter(item => item.includes(`${eventName}(`)).map(item => {
			return Ethers.utils.id(item);
		});
		return {abi: resultingAbi, topic};
	}
}
