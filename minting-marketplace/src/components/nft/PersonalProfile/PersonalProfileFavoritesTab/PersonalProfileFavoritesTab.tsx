import { CircularProgress } from '@mui/material';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { TDocData } from '../../../../axios.responseTypes';
import MyfavoriteItem from './MyfavoriteItem/MyfavoriteItem';
import { IPersonalProfileFavoritesTab } from './myFavorites.types';

const PersonalProfileFavoritesTab: React.FC<IPersonalProfileFavoritesTab> = ({
  titleSearch
}) => {
  const [myFavoriteItems, setMyFavoriteItems] = useState<TDocData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getFavotiteData = useCallback(async () => {
    setLoading(true);
    try {
      await axios
        .get('/api/v2/favorites', {
          headers: {
            'Content-Type': 'application/json',
            'x-rair-token': localStorage.token
          }
        })
        .then(({ data }) => {
          setMyFavoriteItems(data.data);
          setLoading(false);
        });
    } catch (e) {
      setMyFavoriteItems(null);
      setLoading(false);
    }
  }, []);

  const removeFavotite = async (currentLikeToken) => {
    if (localStorage.token) {
      if (currentLikeToken) {
        try {
          await axios
            .delete(`/api/v2/favorites/${currentLikeToken}`, {
              headers: {
                'Content-Type': 'application/json',
                'x-rair-token': localStorage.token
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
        <div className="list-wrapper-empty">
          <CircularProgress
            sx={{ color: '#E882D5' }}
            size={100}
            thickness={4.6}
          />
        </div>
      ) : (
        <div className="my-items-product-wrapper row favorite">
          {myFavoriteItems ? (
            myFavoriteItems.doc &&
            myFavoriteItems.doc
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
