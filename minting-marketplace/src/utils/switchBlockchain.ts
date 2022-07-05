import chainData from './blockchainData';

const web3Switch = async (chainId: BlockchainType | undefined) => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainId && chainData[chainId]?.chainId }]
    });
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [chainId && chainData[chainId]?.addChainData]
        });
      } catch (addError) {
        console.error(addError);
      }
    } else {
      console.error(switchError);
    }
  }
};

export { web3Switch };
