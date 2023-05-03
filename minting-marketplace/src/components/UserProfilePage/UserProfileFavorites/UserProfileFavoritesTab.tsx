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
          `/api/v2/favorites/${userAddressChanged}`,
          undefined,
          undefined,
          false
        );
        if (response.success) {
          setUserFavorites(response.data);
        } else {
          setUserFavorites(null);
        }
      } catch (e) {
        setUserFavorites(null);
      }
    }
  }, [userAddress]);

  useEffect(() => {
    getFavotiteData();
  }, [getFavotiteData]);

  if (userFavotites === undefined) {
    return <LoadingComponent />;
  }

  return (
    <div className="user-page-favorite-container">
      <div
        className={`my-items-product-wrapper ${
          width >= 1250 && width <= 1400 && 'row'
        } favorite`}>
        {userFavotites ? (
          userFavotites.doc &&
          userFavotites.doc
            .filter((el) =>
              el.token.metadata.name
                .toLowerCase()
                .includes(titleSearch.toLowerCase())
            )
            .map((item) => {
              return (
                <MyfavoriteItem userPage={true} item={item} key={item._id} />
              );
            })
        ) : (
          <p style={{ fontSize: '20px' }}>
            This user doesn`t have any favorites
          </p>
        )}
      </div>
    </div>
  );
};

export default UserProfileFavoritesTab;
