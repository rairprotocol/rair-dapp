import React, { useCallback, useEffect, useState } from 'react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CloseIcon from '@mui/icons-material/Close';
import { formatUnits, parseEther } from 'ethers';
import { Hex } from 'viem';

import useContracts from '../../../../../hooks/useContracts';
import {
  useAppDispatch,
  useAppSelector
} from '../../../../../hooks/useReduxHooks';
import useServerSettings from '../../../../../hooks/useServerSettings';
import useSwal from '../../../../../hooks/useSwal';
import useWeb3Tx from '../../../../../hooks/useWeb3Tx';
import {
  CollectionTokens,
  reloadTokenData
} from '../../../../../redux/tokenSlice';
import { NftItemToken } from '../../../../../types/commonTypes';
import { rFetch } from '../../../../../utils/rFetch';
import InputField from '../../../../common/InputField';
import { TooltipBox } from '../../../../common/Tooltip/TooltipBox';
import { ImageLazy } from '../../../../MockUpPage/ImageLazy/ImageLazy';
import { BuySellButton } from '../../../../MockUpPage/NftList/NftData/BuySellButton';
import SellButton from '../../../../MockUpPage/NftList/NftData/SellButton';

import './ResaleModal.css';

interface IResaleModal {
  item: NftItemToken | CollectionTokens;
  singleTokenPage?: boolean;
  getMyNft?: (num: number, page: number) => void;
  totalNft?: any;
}

const ResaleModal: React.FC<IResaleModal> = ({
  item,
  singleTokenPage,
  getMyNft,
  totalNft
}) => {
  const { currentCollectionMetadata } = useAppSelector((store) => store.tokens);
  const { currentUserAddress, exchangeRates } = useAppSelector(
    (state) => state.web3
  );

  const [contractAddress] = useState<string | undefined>(
    typeof item?.contract === 'string'
      ? currentCollectionMetadata?.contract?.contractAddress
      : item?.contract?.contractAddress
  );
  const [blockchain] = useState<Hex | undefined>(
    typeof item?.contract === 'string'
      ? currentCollectionMetadata?.contract?.blockchain
      : item?.contract?.blockchain
  );

  const { diamondMarketplaceInstance } = useContracts();

  const { primaryColor, primaryButtonColor, textColor, isDarkMode } =
    useAppSelector((store) => store.colors);

  const { getBlockchainData } = useServerSettings();
  const dispatch = useAppDispatch();

  const [resaleOffer, setResaleOffer] = useState<any>(undefined);
  const [isInputPriceExist, setIsInputPriceExist] = useState<boolean>(false);
  const [inputSellValue, setInputSellValue] = useState<string>('');
  const [commissionFee, setCommissionFee] = useState<any>(undefined);
  const reactSwal = useSwal();

  const xMIN = Number(0.0001);
  const yMAX = blockchain === '0x1' ? 10 : 10000.0;

  const { web3Switch, correctBlockchain, web3TxHandler } = useWeb3Tx();

  const handleInputClear = useCallback(() => {
    if (inputSellValue) {
      setInputSellValue('');
    } else {
      setIsInputPriceExist(false);
    }
  }, [inputSellValue]);

  const fetchRoyalties = useCallback(async () => {
    if (diamondMarketplaceInstance && item && correctBlockchain(blockchain)) {
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
        [contractAddress]
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
    setResaleOffer(undefined);
    const token = item.uniqueIndexInContract;
    if (!contractAddress || !blockchain || !token) {
      return;
    }
    const { success, data } = await rFetch(
      `/api/resales/open?contract=${contractAddress}&blockchain=${blockchain}&index=${token}`
    );
    if (!success) {
      return;
    }
    const [resaleData] = data;
    if (!resaleData) {
      return;
    }
    setResaleOffer(resaleData);
  }, [item, contractAddress, blockchain]);

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

  const removeResaleOfferBlockchain = useCallback(
    async (id) => {
      if (!id || !diamondMarketplaceInstance) {
        return;
      }
      if (
        await web3TxHandler(diamondMarketplaceInstance, 'deleteGasTokenOffer', [
          id
        ])
      ) {
        reactSwal.fire({
          title: 'Deleted',
          html: 'Your resale offer has been deleted.',
          icon: 'success'
        });
        if (!singleTokenPage && totalNft) {
          getMyNft && getMyNft(Number(totalNft), 1);
          if (!singleTokenPage && totalNft) {
            getMyNft && getMyNft(Number(totalNft), 1);
          }
        }
      }
    },
    [
      diamondMarketplaceInstance,
      getMyNft,
      reactSwal,
      singleTokenPage,
      totalNft,
      web3TxHandler
    ]
  );

  const updateResaleOfferBlockchain = useCallback(
    async (price: string, id: string) => {
      if (!diamondMarketplaceInstance || !price || !id) {
        return;
      }
      if (
        await web3TxHandler(diamondMarketplaceInstance, 'updateGasTokenOffer', [
          id,
          parseEther(price)
        ])
      ) {
        reactSwal.fire({
          title: 'Updated!',
          html: "The offer's price has been updated.",
          icon: 'success'
        });
        getResaleData();
        dispatch(reloadTokenData({ tokenId: item._id }));

        if (!singleTokenPage && totalNft) {
          getMyNft && getMyNft(Number(totalNft), 1);
        }
      }
    },
    [
      diamondMarketplaceInstance,
      dispatch,
      getMyNft,
      getResaleData,
      item._id,
      reactSwal,
      singleTokenPage,
      totalNft,
      web3TxHandler
    ]
  );

  const updateResaleOfferDatabase = async (price, id) => {
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
      dispatch(reloadTokenData({ tokenId: item._id }));

      if (!singleTokenPage && totalNft) {
        getMyNft && getMyNft(Number(totalNft), 1);
      }
    }
  };

  const confirmDatabaseResaleDeletion = (tokenId) => {
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
          dispatch(reloadTokenData({ tokenId: item._id }));
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

  useEffect(() => {
    getResaleData();
  }, [getResaleData]);

  useEffect(() => {
    fetchRoyalties();
  }, [fetchRoyalties]);

  const chainData = getBlockchainData(blockchain);

  return (
    <div
      className="container-resale-modal"
      style={{
        backgroundColor: `${!isDarkMode ? 'rgb(222, 222, 222)' : primaryColor}`
      }}>
      <div className="resale-modal-image">
        {item && item.metadata && (
          <ImageLazy src={item.metadata.image} alt={item.metadata.name} />
        )}
      </div>
      <div className="resale-modal-blockchain-container">
        <div>{item && item.metadata && item.metadata.name}</div>
        <div
          className="resale-modal-blockchain-block"
          style={{
            backgroundColor: `${
              isDarkMode
                ? 'var(--rhyno)'
                : `color-mix(in srgb, ${primaryColor}, #2D2D2D)`
            }`
          }}>
          {chainData && (
            <>
              <div>{chainData?.viem?.nativeCurrency?.symbol}</div>
              <img src={chainData.image} alt="blockchain" />
            </>
          )}
        </div>
      </div>
      {!correctBlockchain(blockchain) ? (
        <div className="resale-switch-network-btn">
          <BuySellButton
            handleClick={() => web3Switch(blockchain)}
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
            {resaleOffer ? (
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
                      if (resaleOffer.blockchainOfferId) {
                        return updateResaleOfferBlockchain(
                          inputSellValue,
                          resaleOffer.blockchainOfferId
                        );
                      }
                      updateResaleOfferDatabase(
                        inputSellValue,
                        resaleOffer._id
                      );
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
                    onClick={() => {
                      if (resaleOffer.blockchainOfferId) {
                        removeResaleOfferBlockchain(
                          resaleOffer.blockchainOfferId
                        );
                      } else {
                        confirmDatabaseResaleDeletion(resaleOffer._id);
                      }
                    }}
                    className="btn-remove-resale">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </TooltipBox>
              </>
            ) : (
              <SellButton
                currentUser={currentUserAddress}
                item={{
                  ...item,
                  contract: item.contract || currentCollectionMetadata
                }}
                sellingPrice={inputSellValue}
                isInputPriceExist={isInputPriceExist}
                setIsInputPriceExist={setIsInputPriceExist}
                setInputSellValue={setInputSellValue}
                refreshResaleData={() => {
                  getResaleData();
                  //dispatch();
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
                  <div>{chainData?.symbol}</div>
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
              {blockchain && (
                <div>
                  <div className="resale-modal-information-box">
                    <div>
                      {' '}
                      $
                      {commissionFee &&
                      exchangeRates &&
                      commissionFee.creatorFee &&
                      commissionFee.creatorFee.length > 0
                        ? (
                            ((Number(inputSellValue) *
                              Number(commissionFee.creatorFee)) /
                              100) *
                            exchangeRates[blockchain]
                          ).toFixed(2)
                        : '0'}
                    </div>
                  </div>
                  <div className="resale-modal-information-box">
                    <div>
                      {inputSellValue.length <= 10 &&
                        commissionFee &&
                        exchangeRates && (
                          <div>
                            $
                            {(
                              ((Number(inputSellValue) *
                                (Number(commissionFee.nodeFee) +
                                  Number(commissionFee.treasuryFee))) /
                                100) *
                              exchangeRates[blockchain]
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
                      exchangeRates &&
                      correctBlockchain(blockchain)
                        ? (
                            (Number(inputSellValue) -
                              (Number(inputSellValue) *
                                (Number(commissionFee.creatorFee) +
                                  (Number(commissionFee.nodeFee) +
                                    (commissionFee.treasuryFee
                                      ? Number(commissionFee.treasuryFee)
                                      : 0)))) /
                                100) *
                            exchangeRates[blockchain]
                          ).toFixed(2)
                        : '0'}
                    </div>
                  </div>
                </div>
              )}
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
                    correctBlockchain(blockchain)
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
