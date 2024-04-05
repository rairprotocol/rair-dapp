import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

import { IPersonalProfileFavoritesTab } from './myFavorites.types';

import { TDocData } from '../../../../axios.responseTypes';
import { RootState } from '../../../../ducks';
import { ContractsInitialType } from '../../../../ducks/contracts/contracts.types';
import LoadingComponent from '../../../common/LoadingComponent';

import MyfavoriteItem from './MyfavoriteItem/MyfavoriteItem';

const PersonalProfileFavoritesTab: React.FC<IPersonalProfileFavoritesTab> = ({
  titleSearch
}) => {
  const [myFavoriteItems, setMyFavoriteItems] = useState<TDocData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { currentUserAddress } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );

  const getFavotiteData = useCallback(async () => {
    setLoading(true);
    try {
      await axios
        .get('/api/favorites', {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(({ data }) => {
          setMyFavoriteItems(data);
          setLoading(false);
        });
    } catch (e) {
      setMyFavoriteItems(null);
      setLoading(false);
    }
  }, []);

  const removeFavotite = async (currentLikeToken) => {
    if (currentUserAddress) {
      if (currentLikeToken) {
        try {
          await axios
            .delete(`/api/favorites/${currentLikeToken}`, {
              headers: {
                'Content-Type': 'application/json'
              }
            })
            .then((res) => {
              if (res.data === '') {
                getFavotiteData();
              }
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

  return (
    <div className="gen">
      {loading ? (
        <LoadingComponent />
      ) : (
        <div className="my-items-product-wrapper row favorite">
          {myFavoriteItems && myFavoriteItems.result.length ? (
            myFavoriteItems.result &&
            myFavoriteItems.result
              .filter((el) =>
                el.token.metadata.name
                  .toLowerCase()
                  .includes(titleSearch.toLowerCase())
              )
              .map((item) => {
                return (
                  <MyfavoriteItem
                    item={item}
                    key={item._id}
                    removeFavotite={removeFavotite}
                  />
                );
              })
          ) : (
            <p style={{ fontSize: '20px' }}>You don`t have any favorites</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PersonalProfileFavoritesTab;
