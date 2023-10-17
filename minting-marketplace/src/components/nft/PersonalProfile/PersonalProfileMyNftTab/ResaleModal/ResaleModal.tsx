import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import { formatEther, formatUnits, parseEther } from 'ethers/lib/utils';

import { RootState } from '../../../../../ducks';
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
}

const ResaleModal: React.FC<IResaleModal> = ({
  item,
  textColor,
  singleTokenPage
}) => {
  const { diamondMarketplaceInstance, currentUserAddress } = useSelector<
    RootState,
    ContractsInitialType
  >((state) => state.contractStore);

  const [resaleData, setResaleData] = useState<any>();
  const [resaleOffer, setResaleOffer] = useState<any>(undefined);
  const [isInputPriceExist, setIsInputPriceExist] = useState<boolean>(false);
  const [inputSellValue, setInputSellValue] = useState<string>('');
  const [commissionFee, setCommissionFee] = useState<any>(undefined);
  const reactSwal = useSwal();

  const { web3Switch, correctBlockchain, web3TxHandler } = useWeb3Tx();

  const hotDropsVar = process.env.REACT_APP_HOTDROPS;

  const handleInputClear = useCallback(() => {
    if (inputSellValue) {
      setInputSellValue('');
    } else {
      setIsInputPriceExist(false);
    }
  }, [inputSellValue]);

  const testReqeust = useCallback(async () => {
    if (diamondMarketplaceInstance && item) {
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
        `/api/v2/contracts?contractAddress=${item.contract.contractAddress}&blockchain=${item.contract.blockchain}`
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
      const [resaleData] = resaleResponse?.data;
      if (!resaleData) {
        return;
      }
      const userResponse = await rFetch(
        `/api/v2/users/${resaleData.seller.toLowerCase()}`
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
      reactSwal
        .fire({
          title: 'Updated!',
          html: 'Your price has been updated.',
          icon: 'success'
        })
        .then((result) => {
          if ((singleTokenPage && result.isConfirmed) || result.dismiss) {
            location.reload();
          }
        });
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
          reactSwal
            .fire('Deleted!', 'Your resale offer has been deleted.', 'success')
            .then((res) => {
              if (singleTokenPage && res.isConfirmed) {
                location.reload();
              }
            });
          removeResaleOffer(tokenId);
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
    testReqeust();
  }, [testReqeust]);

  return (
    <div className="container-resale-modal">
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
        <div className="resale-modal-group-btns">
          <div className="nft-data-sell-button">
            <div className="input-sell-container">
              <InputField
                type="eth"
                getter={inputSellValue}
                setter={setInputSellValue}
                customClass={`input-sell-value text-${textColor}`}
                placeholder="Your price"
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
                className={`btn-update-resale ${
                  hotDropsVar === 'true' ? 'hotdrops' : ''
                }`}
                onClick={() => {
                  updateResaleOffer(inputSellValue, resaleOffer[0]._id);
                }}>
                Update
              </button>{' '}
              <TooltipBox title="Remove offer resale">
                <button
                  onClick={() => removeVideoAlert(resaleOffer[0]._id)}
                  className="btn-remove-resale">
                  <i className="fas fa-trash"></i>
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
              refreshResaleData={getResaleData}
              singleTokenPage={true}
            />
          )}
        </div>
      )}

      <div className="resale-modal-information">
        <div className="resale-modal-information-title">Summary</div>
        <div className="resale-modal-information-box">
          <div>Amount to creator</div>
          <div>
            {commissionFee &&
            commissionFee.creatorFee &&
            commissionFee.creatorFee.length > 0
              ? (
                  (Number(inputSellValue) * Number(commissionFee.creatorFee)) /
                  100
                ).toFixed(3)
              : '0'}
          </div>
        </div>
        <div className="resale-modal-information-box">
          <div>Node and treasury:</div>
          {commissionFee && (
            <div>
              {(
                (Number(inputSellValue) *
                  (Number(commissionFee.nodeFee) +
                    Number(commissionFee.treasuryFee))) /
                100
              ).toFixed(3)}
            </div>
          )}
        </div>
        <div className="resale-modal-information-box">
          <div>Total:</div>
          <div>
            {commissionFee && correctBlockchain(item.contract.blockchain)
              ? (
                  Number(inputSellValue) -
                  (Number(inputSellValue) *
                    (Number(commissionFee.creatorFee) +
                      (Number(commissionFee.nodeFee) +
                        (commissionFee.treasuryFee
                          ? Number(commissionFee.treasuryFee)
                          : 0)))) /
                    100
                ).toFixed(3)
              : '0'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResaleModal;
