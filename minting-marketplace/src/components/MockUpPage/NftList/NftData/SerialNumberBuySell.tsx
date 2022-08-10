import React from 'react';
import {
  ISerialNumberBuySell,
  TSwitchEthereumChainArgs
} from '../../mockupPage.types';
import SelectNumber from '../../SelectBox/SelectNumber/SelectNumber';
import { BuySellButton } from './BuySellButton';
import chainData from '../../../../utils/blockchainData';
import Swal from 'sweetalert2';
import { metamaskCall } from '../../../../utils/metamaskUtils';
import { RootState } from '../../../../ducks';
import { ContractsInitialType } from '../../../../ducks/contracts/contracts.types';
import { useSelector } from 'react-redux';
import SellInputButton from './SellInputButton';

const SerialNumberBuySell: React.FC<ISerialNumberBuySell> = ({
  tokenData,
  handleClickToken,
  blockchain,
  product,
  contract,
  totalCount,
  selectedToken,
  setSelectedToken,
  primaryColor,
  offerData,
  currentUser
}) => {
  const { minterInstance, currentChain } = useSelector<
    RootState,
    ContractsInitialType
  >((state) => state.contractStore);

  const switchEthereumChain = async (chainData: TSwitchEthereumChainArgs) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainData.chainId }]
      });
    } catch (error) {
      const switchError = error as any;
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

  const CheckEthereumChain = async () => {
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

  const buyContract = async () => {
    Swal.fire({
      title: 'Buying token',
      html: 'Awaiting transaction completion',
      icon: 'info',
      showConfirmButton: false
    });
    if (
      await metamaskCall(
        minterInstance?.buyToken(
          offerData.offerPool,
          offerData.offerIndex,
          selectedToken,
          {
            value: offerData.price
          }
        ),
        'Sorry your transaction failed! When several people try to buy at once - only one transaction can get to the blockchain first. Please try again!'
      )
    ) {
      Swal.fire('Success', 'Now, you are the owner of this token', 'success');
    }
  };

  const checkOwner = () => {
    const price = offerData?.price;
    const handleBuyButton = () => {
      return currentChain === blockchain
        ? buyContract
        : () => CheckEthereumChain();
    };
    return offerData && offerData.price ? (
      <BuySellButton
        handleClick={handleBuyButton()}
        disabled={!offerData?.offerPool}
        isColorPurple={true}
        title={`Buy .${(+price !== Infinity && price !== undefined
          ? price
          : 0
        ).toString()}
            ${blockchain && chainData[blockchain]?.symbol}`}
      />
    ) : (
      <></>
    );
  };

  return (
    <div className="main-tab">
      <div className="main-tab-description-serial-number">
        <div
          className="description-text serial-number-text"
          style={{
            color: `${primaryColor === 'rhyno' ? '#7A797A' : '#A7A6A6'}`
          }}>
          Serial number
        </div>
        <div>
          {tokenData.length ? (
            <SelectNumber
              blockchain={blockchain}
              product={product}
              contract={contract}
              totalCount={totalCount}
              handleClickToken={handleClickToken}
              selectedToken={selectedToken}
              setSelectedToken={setSelectedToken}
              items={
                tokenData &&
                tokenData.map((p) => {
                  return {
                    value: p.metadata.name,
                    id: p._id,
                    token: p.token,
                    sold: p.isMinted
                  };
                })
              }
            />
          ) : (
            <></>
          )}
        </div>
      </div>
      <div>
        {!tokenData[selectedToken]?.isMinted ? (
          checkOwner()
        ) : (
          <SellInputButton
            currentUser={currentUser}
            tokenData={tokenData}
            selectedToken={selectedToken}
          />
        )}
      </div>
    </div>
  );
};

export default SerialNumberBuySell;
