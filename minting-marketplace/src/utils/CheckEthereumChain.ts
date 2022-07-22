//@ts-nocheck
import Swal from 'sweetalert2';

const switchEthereumChain = async (chainData) => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainData.chainId }]
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [chainData]
        });
      } catch (addError) {
        console.error(addError);
      }
    } else {
      console.error(switchError);
    }
  }
};

const CheckEthereumChain = async (blockchain) => {
  switch (blockchain) {
    case '0x61':
      switchEthereumChain({
        chainId: '0x61',
        chainName: 'Binance Testnet'
      });
      break;

    case '0x3e9':
      switchEthereumChain({
        chainId: '0x3e9',
        chainName: 'Klaytn Baobab'
      });
      break;

    case '0x13881':
      switchEthereumChain({
        chainId: '0x13881',
        chainName: 'Matic Testnet Mumbai'
      });
      break;

    case '0x89':
      switchEthereumChain({
        chainId: '0x89',
        chainName: 'Matic(Polygon) Mainnet'
      });
      break;

    case '0x3':
      switchEthereumChain({
        chainId: '0x3',
        chainName: 'Ropsten (Ethereum)'
      });
      break;

    case '0x5':
      switchEthereumChain({
        chainId: '0x5',
        chainName: 'Goerli (Ethereum)'
      });
      break;

    default:
      Swal.fire(
        'Error',
        ' This chain has not been added to MetaMask, yet',
        'error'
      );
  }
};
export { CheckEthereumChain };
