import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { utils } from 'ethers';

import { erc721Abi } from '../../../../../contracts';
import { RootState } from '../../../../../ducks';
import { ColorStoreType } from '../../../../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../../../../ducks/contracts/contracts.types';
import useSwal from '../../../../../hooks/useSwal';
import useWeb3Tx from '../../../../../hooks/useWeb3Tx';
import blockchainData from '../../../../../utils/blockchainData';
import { validateInteger } from '../../../../../utils/metamaskUtils';
import InputField from '../../../../common/InputField';
import { SvgKeyForModalItem } from '../../../NftList/SvgKeyForModalItem';
import { IModalItem } from '../../filteringBlock.types';
import Modal from '../../modal';

import './ModalItemResponsive.css';

const ModalItem: React.FC<IModalItem> = ({
  isOpenBlockchain,
  setIsOpenBlockchain,
  setIsCreatedTab,
  selectedData,
  defaultImg,
  primaryColor,
  isCreatedTab
}) => {
  const { web3TxHandler, correctBlockchain, web3Switch } = useWeb3Tx();

  const [price, setPrice] = useState<number>(0);
  const [isApproved, setIsApproved] = useState<boolean | undefined>(undefined);
  const {
    currentChain,
    currentUserAddress,
    contractCreator,
    diamondMarketplaceInstance
  } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );
  const { textColor, primaryButtonColor } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);
  const instance = contractCreator?.(selectedData?.contractAddress, erc721Abi);
  const [onMyChain, setOnMyChain] = useState<boolean>(
    correctBlockchain(selectedData?.blockchain as BlockchainType)
  );

  const reactSwal = useSwal();

  useEffect(() => {
    setOnMyChain(currentChain === selectedData?.blockchain);
  }, [currentChain, selectedData]);

  const onCloseModal = useCallback(() => {
    setIsCreatedTab(false);
    setIsOpenBlockchain(false);
    setPrice(0);
  }, [setIsOpenBlockchain, setIsCreatedTab]);

  useEffect(() => {
    setOnMyChain(currentChain === selectedData?.blockchain);
  }, [currentChain, selectedData?.blockchain]);

  const createResaleOffer = async () => {
    if (onMyChain && isApproved) {
      if (!validateInteger(price) || !diamondMarketplaceInstance) {
        return;
      }
      reactSwal.fire({
        title: `Putting token #${selectedData?.uniqueIndexInContract} up for sale`,
        html: 'Please wait...',
        icon: 'info',
        showConfirmButton: false
      });
      if (
        await web3TxHandler(diamondMarketplaceInstance, 'createResaleOffer', [
          selectedData?.uniqueIndexInContract,
          price,
          selectedData?.contractAddress,
          currentUserAddress
        ])
      ) {
        reactSwal.fire({
          title: 'Success',
          html: 'The offer has been created',
          icon: 'success'
        });
      }
    }
  };

  const approveToken = async () => {
    if (!isApproved && instance) {
      reactSwal.fire({
        title: 'Approving token',
        html: 'Please wait...',
        icon: 'info',
        showConfirmButton: false
      });
      if (
        await web3TxHandler(instance, 'approve', [
          diamondMarketplaceInstance?.address,
          selectedData?.uniqueIndexInContract
        ])
      ) {
        reactSwal.fire({
          title: 'Success',
          html: 'The token has been approved for sale',
          icon: 'success'
        });
      }
      checkStatusContract();
    }
  };

  const checkStatusContract = useCallback(async () => {
    if (onMyChain && instance && diamondMarketplaceInstance) {
      const approved =
        (await web3TxHandler(instance, 'getApproved', [
          selectedData?.uniqueIndexInContract
        ])) === diamondMarketplaceInstance.address ||
        (await web3TxHandler(instance, 'isApprovedForAll', [
          currentUserAddress,
          diamondMarketplaceInstance.address
        ]));
      setIsApproved(approved);
    }
  }, [
    onMyChain,
    instance,
    currentUserAddress,
    diamondMarketplaceInstance,
    selectedData,
    web3TxHandler
  ]);

  useEffect(() => {
    checkStatusContract();
  }, [checkStatusContract]);

  function bidFirstLetter(string) {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }

  return (
    <Modal onClose={onCloseModal} open={isOpenBlockchain}>
      <div className="modal-content-metadata modal-item-metadata">
        <div className="block-close">
          <button onClick={onCloseModal}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="modal-main-content">
          <div
            className="bg-my-items p-2"
            style={{
              backgroundImage: `url(${
                selectedData?.metadata?.image || defaultImg
              })`,
              backgroundColor: `var(--${primaryColor}-transparent)`
            }}></div>
          <div className="modal-number-tokenContent">
            <span className="modal-item-title">
              {bidFirstLetter(selectedData?.title)}
            </span>
            {/*There is no user inside selectedData object*/}
            {/* <span className="modal-item-user">{selectedData?.user}</span> */}
            <div style={{ display: 'flex' }}>
              <SvgKeyForModalItem />
              <span className="modal-item-token description">
                Token : {selectedData?.uniqueIndexInContract}
              </span>
            </div>
          </div>
        </div>
        <hr />
        <div className="modal-item-footer-wrapper modal-filtering-btn">
          {onMyChain && isApproved === true && (
            <>
              <div className="border-stimorol rounded-rair">
                {validateInteger(price) && (
                  <>
                    {utils.formatEther(price)}{' '}
                    {selectedData?.blockchain &&
                      blockchainData[selectedData.blockchain]?.symbol}
                  </>
                )}
                <InputField
                  labelClass="w-100 text-start"
                  customClass="form-control rounded-rair"
                  min="0"
                  type="number"
                  getter={price}
                  setter={setPrice}
                />
              </div>
            </>
          )}

          <div>
            {isCreatedTab ? (
              <span>
                Price for this NFT on the marketplace :{' '}
                {utils.formatEther(Number(selectedData?.offer?.price))}{' '}
                {selectedData?.blockchain &&
                  blockchainData[selectedData.blockchain]?.symbol}
              </span>
            ) : (
              <button
                className="btn rair-button"
                style={{
                  background: primaryButtonColor,
                  color: textColor
                }}
                onClick={() => {
                  if (onMyChain && diamondMarketplaceInstance) {
                    if (isApproved === false) {
                      approveToken();
                    } else if (isApproved === true) {
                      createResaleOffer();
                    }
                  } else {
                    web3Switch(selectedData?.blockchain as BlockchainType);
                  }
                }}>
                {onMyChain
                  ? diamondMarketplaceInstance
                    ? isApproved === undefined
                      ? 'Please wait...'
                      : isApproved
                        ? 'Sell'
                        : 'Approve the marketplace for this token'
                    : 'The marketplace is not available for this blockchain'
                  : `Switch to ${
                      selectedData?.blockchain &&
                      blockchainData[selectedData?.blockchain]?.name
                    }`}
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalItem;
