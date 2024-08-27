import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { isAddress, ZeroAddress } from 'ethers';

import { FavoriteItem, UserFavoriteItemInfo } from './MyFavoriteStyledItems';

import { TUserResponse } from '../../../../../axios.responseTypes';
import { useAppSelector } from '../../../../../hooks/useReduxHooks';
import { User } from '../../../../../types/databaseTypes';
import { rFetch } from '../../../../../utils/rFetch';
import { ImageLazy } from '../../../../MockUpPage/ImageLazy/ImageLazy';
import BtnMyFavorite from '../BtnMyFavorite/BtnMyFavorite';
import { IMyfavoriteItem } from '../myFavorites.types';

import defaultAvatar from './../../../../UserProfileSettings/images/defaultUserPictures.png';

const MyfavoriteItem: React.FC<IMyfavoriteItem> = ({
  item,
  removeFavotite,
  userPage = false
}) => {
  const [profileData, setprofileData] = useState<User | undefined>(undefined);
  const { isLoggedIn, publicAddress } = useAppSelector((store) => store.user);

  const navigate = useNavigate();

  const location = useLocation();
  const currentAddress = location.pathname.split('/').pop();
  const userPublicAddress = publicAddress || undefined;
  const isCurrentUser = isLoggedIn && userPublicAddress === currentAddress;

  const getInfoFromUser = useCallback(async () => {
    // find user
    if (
      item.token.ownerAddress &&
      isAddress(item.token.ownerAddress) &&
      item.token.ownerAddress !== ZeroAddress
    ) {
      await axios
        .get<TUserResponse>(`/api/users/${item.token.ownerAddress}`)
        .then((res) => {
          if (res.data && res.data.user) {
            setprofileData(res.data.user);
          }
        });
    }
  }, [item]);

  const goToTokenLink = async (contract) => {
    const contractData = await rFetch(`/api/contracts/${contract}`);
    if (contractData.success) {
      navigate(
        `/tokens/${contractData.contract.blockchain}/${contractData.contract.contractAddress}/0/${item.token.token}`
      );
    }
  };

  const handleClick = (event) => {
    const isButtonClicked =
      event.target.tagName.toLowerCase() === 'i' ||
      event.target.classList.contains('like-button');

    if (isButtonClicked) {
      return;
    }

    if (!userPage) {
      return null;
    } else {
      goToTokenLink(item.token.contract);
    }
  };

  useEffect(() => {
    getInfoFromUser();
  }, [getInfoFromUser]);

  return (
    <FavoriteItem
      className="nft-item-collection grid-item"
      image={item.token.metadata.image}>
      <div
        style={{
          cursor: 'pointer'
        }}
        onClick={handleClick}>
        <ImageLazy
          src={item.token.metadata.image}
          alt={`My favorite NFT ${item.token.metadata.name}`}
          cover={true}
          className={`my-items-pict h-100 w-100 ${
            !userPage && 'row'
          } zoom-event zoom-event`}
          width={'100%'}
          height={'100%'}
        />
        <div className="w-100 bg-my-items">
          {isCurrentUser && (
            <BtnMyFavorite
              removeFavotite={() => removeFavotite && removeFavotite(item._id)}
            />
          )}
          <div className="col my-items-description-wrapper my-items-pic-description-wrapper">
            <div
              className="container-blue-description"
              style={{ color: '#fff' }}>
              <span className="description-title">
                {item.token.metadata ? (
                  <>
                    <span>{item.token.metadata.name}</span>
                  </>
                ) : (
                  <b> No metadata available </b>
                )}
                <br />
              </span>
              <div className="container-blockchain-info">
                <UserFavoriteItemInfo>
                  {profileData && (
                    <img
                      src={
                        profileData.avatar ? profileData.avatar : defaultAvatar
                      }
                      alt="user"
                    />
                  )}
                  {profileData && (
                    <span className="description">
                      {profileData.nickName
                        ? profileData.nickName.length > 16
                          ? profileData.nickName.slice(0, 5) +
                            '...' +
                            profileData.nickName.slice(
                              profileData.nickName.length - 4
                            )
                          : profileData.nickName
                        : profileData?.publicAddress?.slice(0, 5) +
                          '...' +
                          profileData?.publicAddress?.slice(
                            profileData.publicAddress.length - 4
                          )}
                    </span>
                  )}
                </UserFavoriteItemInfo>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FavoriteItem>
  );
};

export default MyfavoriteItem;
