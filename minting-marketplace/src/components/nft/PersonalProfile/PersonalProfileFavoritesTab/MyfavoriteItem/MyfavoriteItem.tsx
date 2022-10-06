//@ts-nocheck
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

import { FavoriteItem, UserFavoriteItemInfo } from './MyFavoriteStyledItems';

import { TUserResponse } from '../../../../../axios.responseTypes';
import BtnMyFavorite from '../BtnMyFavorite/BtnMyFavorite';
import { IMyfavoriteItem } from '../myFavorites.types';

import defaultAvatar from './../../../../UserProfileSettings/images/defaultUserPictures.png';

const MyfavoriteItem: React.FC<IMyfavoriteItem> = ({
  item,
  removeFavotite
}) => {
  const [userData, setUserData] = useState(null);

  const getInfoFromUser = useCallback(async () => {
    // find user
    if (item.token.ownerAddress) {
      await axios
        .get<TUserResponse>(`/api/users/${item.token.ownerAddress}`)
        .then((res) => {
          if (res.data && res.data.user) {
            setUserData(res.data.user);
          }
        });
    }
  }, [item]);

  useEffect(() => {
    getInfoFromUser();
  }, [getInfoFromUser]);

  return (
    <FavoriteItem
      className="col-2 my-item-element"
      image={item.token.metadata.image}>
      <div className="w-100 bg-my-items">
        <BtnMyFavorite removeFavotite={() => removeFavotite(item._id)} />
        <div className="col my-items-description-wrapper my-items-pic-description-wrapper">
          <div className="container-blue-description" style={{ color: '#fff' }}>
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
                {userData && (
                  <img
                    src={userData.avatar ? userData.avatar : defaultAvatar}
                    alt="user"
                  />
                )}
                {userData && (
                  <span className="description">
                    {userData.nickName
                      ? userData.nickName.length > 16
                        ? userData.nickName.slice(0, 5) +
                          '...' +
                          userData.nickName.slice(userData.nickName.length - 4)
                        : userData.nickName
                      : userData.slice(0, 5) +
                        '...' +
                        userData.publicAddress.slice(
                          userData.publicAddress.length - 4
                        )}
                  </span>
                )}
              </UserFavoriteItemInfo>
              {/* <small className="description">
                {item.token.contract.slice(0, 5) +
                  '....' +
                  item.token.contract.slice(item.token.contract.length - 4)}
              </small> */}
              <div className="description-small">
                {/* <img
                            className="my-items-blockchain-img"
                            src={
                              item.blockchain
                                ? `${chainData[item.token.blockchain]?.image}`
                                : ''
                            }
                            alt=""
                          /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </FavoriteItem>
  );
};

export default MyfavoriteItem;
