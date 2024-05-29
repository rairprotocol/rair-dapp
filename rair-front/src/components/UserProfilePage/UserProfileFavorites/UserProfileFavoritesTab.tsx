import React, { useCallback, useEffect, useState } from 'react';

import { TDocData } from '../../../axios.responseTypes';
import useWindowDimensions from '../../../hooks/useWindowDimensions';
import { rFetch } from '../../../utils/rFetch';
import LoadingComponent from '../../common/LoadingComponent';
import MyfavoriteItem from '../../nft/PersonalProfile/PersonalProfileFavoritesTab/MyfavoriteItem/MyfavoriteItem';

interface IUserProfileFavoritesTab {
  userAddress: string | undefined;
  titleSearch: string;
}

const UserProfileFavoritesTab: React.FC<IUserProfileFavoritesTab> = ({
  userAddress,
  titleSearch
}) => {
  const [userFavotites, setUserFavorites] = useState<
    TDocData | null | undefined
  >(undefined);

  const { width } = useWindowDimensions();

  const getFavotiteData = useCallback(async () => {
    if (userAddress) {
      const userAddressChanged = userAddress.toLowerCase();
      try {
        const response = await rFetch(
          `/api/favorites/${userAddressChanged}`,
          undefined,
          undefined,
          false
        );
        if (response.success) {
          setUserFavorites(response);
        } else {
          setUserFavorites(null);
        }
      } catch (e) {
        setUserFavorites(null);
      }
    }
  }, [userAddress]);

  const removeFavotite = async (currentLikeToken) => {
    if (userAddress) {
      if (userAddress) {
        try {
          await rFetch(`/api/favorites/${currentLikeToken}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(() => {
            getFavotiteData();
          });
        } catch (e) {
          // console.info(e);
        }
      }
    }
  };

  useEffect(() => {
    getFavotiteData();
  }, [getFavotiteData]);

  if (userFavotites === undefined) {
    return <LoadingComponent />;
  }

  return (
    <div className="gen">
      <div className={`list-button-wrapper-grid-template favorite`}>
        {userFavotites && userFavotites.result.length > 0 ? (
          userFavotites.result &&
          userFavotites.result
            .filter((el) =>
              el.token.metadata.name
                .toLowerCase()
                .includes(titleSearch.toLowerCase())
            )
            .map((item) => {
              return (
                <MyfavoriteItem
                  removeFavotite={removeFavotite}
                  userPage={true}
                  item={item}
                  key={item._id}
                />
              );
            })
        ) : (
          <p>This user doesn`t have any favorites</p>
        )}
      </div>
    </div>
  );
};

export default UserProfileFavoritesTab;
