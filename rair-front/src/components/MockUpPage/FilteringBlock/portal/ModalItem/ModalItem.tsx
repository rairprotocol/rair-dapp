import { useCallback, useEffect, useState } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatEther } from 'ethers';
import { Hex } from 'viem';

import { erc721Abi } from '../../../../../contracts';
import useContracts from '../../../../../hooks/useContracts';
import { useAppSelector } from '../../../../../hooks/useReduxHooks';
import useServerSettings from '../../../../../hooks/useServerSettings';
import useSwal from '../../../../../hooks/useSwal';
import useWeb3Tx from '../../../../../hooks/useWeb3Tx';
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
  isCreatedTab
}) => {
  const { web3TxHandler, correctBlockchain, web3Switch } = useWeb3Tx();
  const { getBlockchainData } = useServerSettings();

  const [price, setPrice] = useState<number>(0);
  const [isApproved, setIsApproved] = useState<boolean | undefined>(undefined);
  const { diamondMarketplaceInstance, contractCreator } = useContracts();
  const { connectedChain, currentUserAddress } = useAppSelector(
    (store) => store.web3
  );
  const { textColor, primaryButtonColor, primaryColor } = useAppSelector(
    (store) => store.colors
  );
  const instance = contractCreator?.(selectedData?.contractAddress, erc721Abi);
  const [onMyChain, setOnMyChain] = useState<boolean>(
    correctBlockchain(selectedData?.blockchain as Hex)
  );

  const reactSwal = useSwal();

  useEffect(() => {
    setOnMyChain(connectedChain === selectedData?.blockchain);
  }, [connectedChain, selectedData]);

  const onCloseModal = useCallback(() => {
    setIsCreatedTab(false);
    setIsOpenBlockchain(false);
    setPrice(0);
  }, [setIsOpenBlockchain, setIsCreatedTab]);

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
          await diamondMarketplaceInstance?.getAddress(),
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
        ])) === (await diamondMarketplaceInstance.getAddress()) ||
        (await web3TxHandler(instance, 'isApprovedForAll', [
          currentUserAddress,
          await diamondMarketplaceInstance.getAddress()
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
              backgroundColor: primaryColor
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
                    {formatEther(price)}{' '}
                    {selectedData?.blockchain &&
                      getBlockchainData(selectedData.blockchain)?.symbol}
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
                {formatEther(Number(selectedData?.offer?.price))}{' '}
                {selectedData?.blockchain &&
                  getBlockchainData(selectedData.blockchain)?.symbol}
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
                    web3Switch(selectedData?.blockchain as Hex);
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
                      getBlockchainData(selectedData?.blockchain)?.name
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
