//@ts-nocheck
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { isAddress, ZeroAddress } from 'ethers';

import { FavoriteItem } from './MyFavoriteStyledItems';

import { TUserResponse } from '../../../../../axios.responseTypes';
import { useAppSelector } from '../../../../../hooks/useReduxHooks';
import { User } from '../../../../../types/databaseTypes';
import { rFetch } from '../../../../../utils/rFetch';
import { ImageLazy } from '../../../../MockUpPage/ImageLazy/ImageLazy';
import BtnMyFavorite from '../BtnMyFavorite/BtnMyFavorite';
import { IMyfavoriteItem } from '../myFavorites.types';

import defaultAvatar from './../../../../UserProfileSettings/images/defaultUserPictures.png';
import useWindowDimensions from '../../../../../hooks/useWindowDimensions';

const MyfavoriteItem: React.FC<IMyfavoriteItem> = ({
  item,
  removeFavotite,
  userPage = false
}) => {
  const [profileData, setprofileData] = useState<User | undefined>(undefined);
  const { isLoggedIn, publicAddress } = useAppSelector((store) => store.user);
  const { width } = useWindowDimensions();
  const isMobileDesign = width < 600;

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
          cursor: 'pointer',
          zIndex: '5',
          height: '100%'
        }}>
        <ImageLazy
          src={item.token.metadata.image}
          alt={`My favorite NFT ${item.token.metadata.name}`}
          cover={true}
          className={`my-items-pict h-100 w-100 zoom-event`}
          width={'100%'}
          height={'100%'}
        />
        <div
          className="w-100 bg-my-items"
          style={{
            zIndex: '10'
          }}>
          {isCurrentUser && (
            <BtnMyFavorite
              removeFavotite={() => removeFavotite && removeFavotite(item._id)}
            />
          )}
          <div
            onClick={handleClick}
            className="description-wrapper pic-description-wrapper wrapper-for-collection-view"
            style={{
              background: `linear-gradient(0deg, 0%, rgba(34,32,33,0.7357536764705883) 5%, rgba(34,32,33,0.671327906162465) 30%, rgba(255,255,255,0) 100%)`
            }}>
            <div className="description-title">
              <div
                className="description-item-name"
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start'
                }}>
                {item.token.metadata?.name !== 'none' &&
                isMobileDesign &&
                item.token.metadata?.name.length > 16
                  ? item.token.metadata?.name.slice(0, 16) + '...'
                  : item.token.metadata?.name.length > 22
                    ? item.token.metadata?.name.slice(0, 22) + '...'
                    : item.token.metadata?.name}
                <div
                  className="brief-infor-nftItem"
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    maxHeight: '40px'
                  }}>
                  <div>
                    {item?.token.isMinted && item?.token?.ownerAddress && (
                      <div className="collection-block-user-creator">
                        <img src={defaultAvatar} alt="User Avatar" />
                        <h5 style={{ wordBreak: 'break-all' }}>
                          {profileData && (
                            <>
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
                            </>
                          )}
                        </h5>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="description-big">
              <span className="description-more">View item</span>
            </div>
          </div>
        </div>
      </div>
    </FavoriteItem>
  );
};

export default MyfavoriteItem;
