//@ts-nocheck
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as ethers from 'ethers';
import Swal from 'sweetalert2';
import InputField from '../../../../common/InputField';
import { SvgKeyForModalItem } from '../../../NftList/SvgKeyForModalItem';
import Modal from '../../modal';
import './ModalItemResponsive.css';
import {
  metamaskCall,
  validateInteger
} from '../../../../../utils/metamaskUtils';
import { erc721Abi } from '../../../../../contracts';
import { web3Switch } from '../../../../../utils/switchBlockchain';
import blockchainData from '../../../../../utils/blockchainData';

const ModalItem = ({
  isOpenBlockchain,
  setIsOpenBlockchain,
  selectedData,
  defaultImg,
  primaryColor
}) => {
  const [price, setPrice] = useState(0);
  const [isApproved, setIsApproved] = useState(undefined);
  const { currentChain, currentUserAddress, resaleInstance, contractCreator } =
    useSelector((store) => store.contractStore);
  const instance = contractCreator(selectedData.contractAddress, erc721Abi);
  const [onMyChain, setOnMyChain] = useState(
    currentChain === selectedData.blockchain
  );

  useEffect(() => {
    setOnMyChain(currentChain === selectedData.blockchain);
  }, [currentChain, selectedData]);

  const onCloseModal = useCallback(() => {
    setIsOpenBlockchain(false);
    setPrice(0);
  }, [setIsOpenBlockchain]);

  const createResaleOffer = async () => {
    if (onMyChain && isApproved) {
      if (!validateInteger(price)) {
        return;
      }
      Swal.fire({
        title: `Putting token #${selectedData.uniqueIndexInContract} up for sale`,
        html: 'Please wait...',
        icon: 'info',
        showConfirmButton: false
      });
      if (
        await metamaskCall(
          resaleInstance.createResaleOffer(
            selectedData.uniqueIndexInContract,
            price,
            selectedData.contractAddress,
            currentUserAddress
          )
        )
      ) {
        Swal.fire({
          title: 'Success',
          html: 'The offer has been created',
          icon: 'success'
        });
      }
    }
  };

  const approveToken = async () => {
    if (!isApproved) {
      Swal.fire({
        title: 'Approving token',
        html: 'Please wait...',
        icon: 'info',
        showConfirmButton: false
      });
      if (
        await metamaskCall(
          instance.approve(
            resaleInstance.address,
            selectedData.uniqueIndexInContract
          )
        )
      ) {
        Swal.fire({
          title: 'Success',
          html: 'The token has been approved for sale',
          icon: 'success'
        });
      }
      checkStatusContract();
    }
  };

  const checkStatusContract = useCallback(async () => {
    if (onMyChain && instance) {
      const approved =
        (await metamaskCall(
          instance.getApproved(selectedData.uniqueIndexInContract)
        )) === resaleInstance.address ||
        (await metamaskCall(
          instance.isApprovedForAll(currentUserAddress, resaleInstance.address)
        ));
      setIsApproved(approved);
    }
  }, [
    onMyChain,
    instance,
    selectedData.uniqueIndexInContract,
    resaleInstance.address,
    currentUserAddress
  ]);

  useEffect(() => {
    checkStatusContract();
  }, [checkStatusContract]);

  function bidFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <Modal
      style={{ height: 'auto !important' }}
      onClose={onCloseModal}
      open={isOpenBlockchain}>
      <div className="modal-content-metadata">
        <div className="block-close">
          <button onClick={onCloseModal}>
            <i className="fas fa-times"></i>
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
              {bidFirstLetter(selectedData.title)}
            </span>
            <span className="modal-item-user">{selectedData.user}</span>
            <div style={{ display: 'flex' }}>
              <SvgKeyForModalItem />
              <span className="modal-item-token description">
                Token : {selectedData.uniqueIndexInContract}
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
                    {ethers.utils.formatEther(price)}{' '}
                    {blockchainData[selectedData.blockchain].symbol}
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
            <button
              className="btn btn-stimorol"
              disabled={isApproved === undefined}
              onClick={() => {
                if (onMyChain) {
                  if (isApproved === false) {
                    approveToken();
                  } else if (isApproved === true) {
                    createResaleOffer();
                  }
                } else {
                  web3Switch(selectedData.blockchain);
                }
              }}>
              {onMyChain
                ? isApproved === undefined
                  ? 'Please wait...'
                  : isApproved
                  ? 'Sell'
                  : 'Approve the marketplace for this token'
                : `Switch to ${blockchainData[selectedData.blockchain].name}`}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalItem;
