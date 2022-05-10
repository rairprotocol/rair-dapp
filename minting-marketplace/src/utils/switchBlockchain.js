import chainData from './blockchainData';

const web3Switch = async (chainId) => {
	try {
		await window.ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: chainData[chainId]?.chainId }],
		});
	} catch (switchError) {
		// This error code indicates that the chain has not been added to MetaMask.
		if (switchError.code === 4902) {
			try {
				await window.ethereum.request({
					method: 'wallet_addEthereumChain',
					params: [chainData[chainId]?.addChainData],
				});
			} catch (addError) {
				console.error(addError);
			}
		} else {
			console.error(switchError);
		}
	}
}

const programmaticSwitch = async (chainId) => {

}

export { web3Switch, programmaticSwitch };