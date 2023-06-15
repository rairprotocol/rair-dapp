import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { utils } from 'ethers';

import { BuySellButton } from './BuySellButton';

import { TUserResponse } from '../../../../axios.responseTypes';
import { UserType } from '../../../../ducks/users/users.types';
import defaultImage from '../../../UserProfileSettings/images/defaultUserPictures.png';
import { ImageLazy } from '../../ImageLazy/ImageLazy';
import { ISellButton } from '../../mockupPage.types';

const SellButton: React.FC<ISellButton> = ({
  currentUser,
  tokenData,
  selectedToken,
  sellingPrice,
  isInputPriceExist,
  setIsInputPriceExist,
  setInputSellValue
}) => {
  const [accountData, setAccountData] = useState<UserType | null>(null);

  const handleClickSellButton = useCallback(() => {
    setInputSellValue('');
    setIsInputPriceExist(false);
  }, [setInputSellValue, setIsInputPriceExist]);

  const openInputField = useCallback(() => {
    setIsInputPriceExist(true);
  }, [setIsInputPriceExist]);

  const shrinkSellPrice = useMemo(() => {
    const limit = 5;
    if (
      sellingPrice?.toString()?.length &&
      sellingPrice?.toString()?.length > limit
    ) {
      return `${sellingPrice?.slice(0, limit)}... `;
    }
    return sellingPrice;
  }, [sellingPrice]);

  const getInfoFromUser = useCallback(async () => {
    // find user
    if (
      selectedToken &&
      tokenData?.[selectedToken]?.ownerAddress &&
      utils.isAddress(tokenData?.[selectedToken]?.ownerAddress)
    ) {
      try {
        const result = await axios
          .get<TUserResponse>(
            `/api/users/${tokenData?.[selectedToken]?.ownerAddress}`
          )
          .then((res) => res.data);

        if (result.success) {
          setAccountData(result.user);
        }
      } catch (e) {
        setAccountData(null);
      }
    }
  }, [selectedToken, setAccountData, tokenData]);

  useEffect(() => {
    getInfoFromUser();
  }, [getInfoFromUser]);

  const sellButton = useCallback(() => {
    if (
      selectedToken &&
      currentUser === tokenData?.[selectedToken]?.ownerAddress &&
      tokenData?.[selectedToken]?.isMinted
    ) {
      return (
        <BuySellButton
          title={
            isInputPriceExist && sellingPrice?.trim()
              ? `Sell for ${shrinkSellPrice} ETH`
              : 'Sell'
          }
          handleClick={
            isInputPriceExist ? handleClickSellButton : openInputField
          }
          isColorPurple={false}
          disabled={isInputPriceExist && !sellingPrice?.trim()}
        />
      );
    } else {
      return (
        <div className="container-sell-button-user">
          Owned by{' '}
          <div className="block-user-creator">
            <ImageLazy
              src={accountData?.avatar ? accountData.avatar : defaultImage}
              alt="User Avatar"
            />
            {selectedToken && (
              <NavLink to={`/${tokenData?.[selectedToken]?.ownerAddress}`}>
                <h5>
                  {(accountData &&
                  accountData.nickName &&
                  accountData.nickName.length > 20
                    ? accountData.nickName.slice(0, 5) +
                      '....' +
                      accountData.nickName.slice(length - 4)
                    : accountData && accountData.nickName) ||
                    (tokenData?.[selectedToken]?.ownerAddress &&
                      tokenData?.[selectedToken]?.ownerAddress.slice(0, 4) +
                        '....' +
                        tokenData?.[selectedToken]?.ownerAddress.slice(
                          length - 4
                        ))}
                </h5>
              </NavLink>
            )}
          </div>
        </div>
      );
    }
  }, [
    currentUser,
    handleClickSellButton,
    openInputField,
    sellingPrice,
    selectedToken,
    tokenData,
    isInputPriceExist,
    shrinkSellPrice,
    accountData
  ]);

  return sellButton();
};

export default React.memo(SellButton);
