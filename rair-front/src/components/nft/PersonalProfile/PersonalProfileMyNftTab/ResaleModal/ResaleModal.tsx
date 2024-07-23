import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CloseIcon from '@mui/icons-material/Close';
import { formatEther, formatUnits, parseEther } from 'ethers/lib/utils';

import { RootState } from '../../../../../ducks';
import { ColorStoreType } from '../../../../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../../../../ducks/contracts/contracts.types';
import useSwal from '../../../../../hooks/useSwal';
import useWeb3Tx from '../../../../../hooks/useWeb3Tx';
import { rFetch } from '../../../../../utils/rFetch';
import InputField from '../../../../common/InputField';
import { TooltipBox } from '../../../../common/Tooltip/TooltipBox';
import { ImageLazy } from '../../../../MockUpPage/ImageLazy/ImageLazy';
import { BuySellButton } from '../../../../MockUpPage/NftList/NftData/BuySellButton';
import SellButton from '../../../../MockUpPage/NftList/NftData/SellButton';

import chainData from './../../../../../utils/blockchainData';

import './ResaleModal.css';

interface IResaleModal {
  item: any;
  textColor: any;
  singleTokenPage?: boolean;
  reloadFunction?: () => void;
  getMyNft?: (num: number, page: number) => void;
  totalNft?: any;
}

const ResaleModal: React.FC<IResaleModal> = ({
  item,
  textColor,
  singleTokenPage,
  reloadFunction,
  getMyNft,
  totalNft
}) => {
  const { diamondMarketplaceInstance, currentUserAddress, coingeckoRates } =
    useSelector<RootState, ContractsInitialType>(
      (state) => state.contractStore
    );

  const { primaryColor, primaryButtonColor } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);

  const [resaleData, setResaleData] = useState<any>();
  const [resaleOffer, setResaleOffer] = useState<any>(undefined);
  const [isInputPriceExist, setIsInputPriceExist] = useState<boolean>(false);
  const [inputSellValue, setInputSellValue] = useState<string>('');
  const [commissionFee, setCommissionFee] = useState<any>(undefined);
  const reactSwal = useSwal();

  const xMIN = Number(0.0001);
  const yMAX = item?.contract?.blockchain === '0x1' ? 10 : 10000.0;

  const { web3Switch, correctBlockchain, web3TxHandler } = useWeb3Tx();

  const handleInputClear = useCallback(() => {
    if (inputSellValue) {
      setInputSellValue('');
    } else {
      setIsInputPriceExist(false);
    }
  }, [inputSellValue]);

  const fetchRoyalties = useCallback(async () => {
    if (
      diamondMarketplaceInstance &&
      item &&
      correctBlockchain(item.contract.blockchain)
    ) {
      const nodeFee = await web3TxHandler(
        diamondMarketplaceInstance,
        'getNodeFee'
      );

      const treasuryFee = await web3TxHandler(
        diamondMarketplaceInstance,
        'getTreasuryFee'
      );
      const result = await web3TxHandler(
        diamondMarketplaceInstance,
        'getRoyalties',
        [item.contract.contractAddress]
      );

      const calculationNodeFee = formatUnits(nodeFee.nodeFee, nodeFee.decimals);
      const calculationTreasuryFee = formatUnits(
        treasuryFee.treasuryFee,
        treasuryFee.decimals
      );

      const calculationGetRoyalties =
        result.length > 0
          ? formatUnits(result[0].percentage, nodeFee.decimals)
          : false;

      const objFee = {
        nodeFee: calculationNodeFee,
        treasuryFee: calculationTreasuryFee,
        creatorFee: calculationGetRoyalties
      };

      setCommissionFee(objFee);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diamondMarketplaceInstance]);

  const getResaleData = useCallback(async () => {
    if (item) {
      if (!diamondMarketplaceInstance) {
        return;
      }
      const contractResponse = await rFetch(
        `/api/contracts?contractAddress=${item.contract.contractAddress}&blockchain=${item.contract.blockchain}`
      );
      if (!contractResponse.success) {
        return;
      }
      const contractData = contractResponse?.result?.at(0);
      if (!contractData) {
        return;
      }
      setResaleData(undefined);
      const resaleResponse = await rFetch(
        `/api/resales/open?contract=${item.contract.contractAddress}&blockchain=${item.contract.blockchain}&index=${item.uniqueIndexInContract}`
      );
      if (!resaleResponse.success) {
        return;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const [resaleData] = resaleResponse?.data;
      if (!resaleData) {
        return;
      }
      const userResponse = await rFetch(
        `/api/users/${resaleData.seller.toLowerCase()}`
      );
      if (userResponse.success) {
        resaleData.seller = userResponse.user.nickName;
      }
    }
    setResaleData(resaleData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diamondMarketplaceInstance]);

  const removeResaleOffer = async (tokenId) => {
    const response = await rFetch(`/api/resales/delete/${tokenId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });
    if (response.success) {
      return;
    }
  };

  const updateResaleOffer = async (price, id) => {
    const response = await rFetch(`/api/resales/update`, {
      method: 'PUT',
      body: JSON.stringify({
        id: id,
        price: parseEther(price).toString()
      }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });

    if (response.success) {
      reactSwal.fire({
        title: 'Updated!',
        html: 'Your price has been updated.',
        icon: 'success'
      });
      getResaleData();
      reloadFunction && reloadFunction();

      if (!singleTokenPage && totalNft) {
        getMyNft && getMyNft(Number(totalNft), 1);
      }
    }
  };

  const removeVideoAlert = (tokenId) => {
    reactSwal
      .fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      })
      .then((result) => {
        if (result.isConfirmed) {
          reactSwal.fire(
            'Deleted!',
            'Your resale offer has been deleted.',
            'success'
          );
          reloadFunction && reloadFunction();
          removeResaleOffer(tokenId);
          if (!singleTokenPage && totalNft) {
            getMyNft && getMyNft(Number(totalNft), 1);
            if (!singleTokenPage && totalNft) {
              getMyNft && getMyNft(Number(totalNft), 1);
            }
          }
        }
      });
  };

  const getResalesInfo = useCallback(async () => {
    if (item) {
      const resaleResponse = await rFetch(
        `/api/resales/open?contract=${item.contract.contractAddress}&blockchain=${item.contract.blockchain}&index=${item.uniqueIndexInContract}`
      );
      if (resaleResponse.success) {
        setResaleOffer(resaleResponse.data);
        if (resaleResponse.data.length > 0) {
          setInputSellValue(formatEther(resaleResponse.data[0].price));
        }
      }
    }
  }, [item]);

  useEffect(() => {
    getResalesInfo();
  }, [getResalesInfo]);

  useEffect(() => {
    fetchRoyalties();
  }, [fetchRoyalties]);

  return (
    <div
      className="container-resale-modal"
      style={{
        backgroundColor: `${
          primaryColor === '#dedede' ? 'rgb(222, 222, 222)' : `${primaryColor}`
        }`
      }}>
      <div className="resale-modal-image">
        {item && item.metadata && (
          <ImageLazy src={item.metadata.image} alt={item.metadata.name} />
        )}
      </div>
      <div className="resale-modal-blockchain-container">
        <div>{item && item.metadata && item.metadata.name}</div>
        <div className="resale-modal-blockchain-block">
          {item.contract.blockchain in chainData ? (
            <>
              <div>{chainData[item.contract.blockchain].symbol}</div>
              <img
                src={chainData[item.contract.blockchain].image}
                alt="blockchain"
              />
            </>
          ) : (
            ''
          )}
        </div>
      </div>
      {!correctBlockchain(item.contract.blockchain) ? (
        <div className="resale-switch-network-btn">
          <BuySellButton
            handleClick={() => web3Switch(item.contract.blockchain)}
            isColorPurple={true}
            title={`Switch network`}
          />
        </div>
      ) : (
        <>
          <div className="resale-modal-group-btns">
            <div className="nft-data-sell-button">
              <div className="input-sell-container">
                <InputField
                  type="number"
                  getter={inputSellValue}
                  setter={setInputSellValue}
                  customClass={`input-sell-value text-${textColor}`}
                  placeholder="Your price"
                  min={Number(xMIN)}
                  max={Number(yMAX)}
                />
                <CloseIcon
                  className="input-sell-close-icon"
                  fontSize="small"
                  onClick={handleInputClear}
                />
              </div>
            </div>
            {resaleOffer && resaleOffer.length > 0 ? (
              <>
                <button
                  style={{
                    color: textColor,
                    background: `${
                      primaryColor === '#dedede'
                        ? import.meta.env.VITE_TESTNET === 'true'
                          ? 'var(--hot-drops)'
                          : 'linear-gradient(to right, #e882d5, #725bdb)'
                        : import.meta.env.VITE_TESTNET === 'true'
                          ? primaryButtonColor ===
                            'linear-gradient(to right, #e882d5, #725bdb)'
                            ? 'var(--hot-drops)'
                            : primaryButtonColor
                          : primaryButtonColor
                    }`
                  }}
                  className={`btn-update-resale ${
                    !inputSellValue ||
                    Number(inputSellValue) < Number(xMIN) ||
                    Number(inputSellValue) > Number(yMAX)
                      ? 'disabled-resale-btn'
                      : ''
                  }`}
                  onClick={() => {
                    if (inputSellValue) {
                      updateResaleOffer(inputSellValue, resaleOffer[0]._id);
                    }
                  }}
                  disabled={
                    !inputSellValue ||
                    Number(inputSellValue) < Number(xMIN) ||
                    Number(inputSellValue) > Number(yMAX)
                  }>
                  Update
                </button>{' '}
                <TooltipBox title="Remove offer resale">
                  <button
                    onClick={() => removeVideoAlert(resaleOffer[0]._id)}
                    className="btn-remove-resale">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </TooltipBox>
              </>
            ) : (
              <SellButton
                currentUser={currentUserAddress}
                // tokenData={[item]}
                item={item}
                sellingPrice={inputSellValue}
                isInputPriceExist={isInputPriceExist}
                setIsInputPriceExist={setIsInputPriceExist}
                setInputSellValue={setInputSellValue}
                refreshResaleData={() => {
                  getResaleData();
                  reloadFunction && reloadFunction();
                }}
                singleTokenPage={true}
              />
            )}
          </div>

          <div>
            <div className="resale-modal-infotmation-title">
              <div>Summary</div>
              <div className="resale-modal-infotmation-subtitle">
                <div className="resale-modal-infotmation-subtitle-usd">USD</div>
                <div>
                  <div>{chainData[item.contract.blockchain].symbol}</div>
                </div>
              </div>
            </div>
            <div className="resale-modal-information amount-titles">
              <div>
                <div className="resale-modal-information-amount-node-total">
                  <div>Amount to creator</div>
                  <div>Node and treasury:</div>
                  <div>Total:</div>
                </div>
              </div>
              <div>
                <div className="resale-modal-information-box">
                  <div>
                    {' '}
                    $
                    {commissionFee &&
                    coingeckoRates &&
                    commissionFee.creatorFee &&
                    commissionFee.creatorFee.length > 0
                      ? (
                          ((Number(inputSellValue) *
                            Number(commissionFee.creatorFee)) /
                            100) *
                          coingeckoRates[item.contract.blockchain]
                        ).toFixed(2)
                      : '0'}
                  </div>
                </div>
                <div className="resale-modal-information-box">
                  <div>
                    {inputSellValue.length <= 10 &&
                      commissionFee &&
                      coingeckoRates && (
                        <div>
                          $
                          {(
                            ((Number(inputSellValue) *
                              (Number(commissionFee.nodeFee) +
                                Number(commissionFee.treasuryFee))) /
                              100) *
                            coingeckoRates[item.contract.blockchain]
                          ).toFixed(2)}
                        </div>
                      )}
                  </div>
                </div>
                <div className="resale-modal-information-box">
                  <div>
                    $
                    {inputSellValue.length <= 10 &&
                    commissionFee &&
                    coingeckoRates &&
                    correctBlockchain(item.contract.blockchain)
                      ? (
                          (Number(inputSellValue) -
                            (Number(inputSellValue) *
                              (Number(commissionFee.creatorFee) +
                                (Number(commissionFee.nodeFee) +
                                  (commissionFee.treasuryFee
                                    ? Number(commissionFee.treasuryFee)
                                    : 0)))) /
                              100) *
                          coingeckoRates[item.contract.blockchain]
                        ).toFixed(2)
                      : '0'}
                  </div>
                </div>
              </div>
              <div>
                <div className="resale-modal-information-box">
                  <div>
                    {inputSellValue.length <= 10 &&
                    commissionFee &&
                    commissionFee.creatorFee &&
                    commissionFee.creatorFee.length > 0
                      ? (
                          (Number(inputSellValue) *
                            Number(commissionFee.creatorFee)) /
                          100
                        ).toFixed(2)
                      : '0'}
                  </div>
                </div>
                <div className="resale-modal-information-box">
                  {inputSellValue.length <= 10 && commissionFee && (
                    <div>
                      {(
                        (Number(inputSellValue) *
                          (Number(commissionFee.nodeFee) +
                            Number(commissionFee.treasuryFee))) /
                        100
                      ).toFixed(2)}
                    </div>
                  )}
                </div>
                <div className="resale-modal-information-box">
                  <div>
                    {inputSellValue.length <= 10 &&
                    commissionFee &&
                    correctBlockchain(item.contract.blockchain)
                      ? (
                          Number(inputSellValue) -
                          (Number(inputSellValue) *
                            (Number(commissionFee.creatorFee) +
                              (Number(commissionFee.nodeFee) +
                                (commissionFee.treasuryFee
                                  ? Number(commissionFee.treasuryFee)
                                  : 0)))) /
                            100
                        ).toFixed(2)
                      : '0'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ResaleModal;
