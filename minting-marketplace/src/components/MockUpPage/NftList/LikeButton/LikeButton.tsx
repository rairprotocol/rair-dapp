import { useCallback, useEffect, useReducer } from 'react';
import { CircularProgress, Tooltip } from '@mui/material';
import axios from 'axios';

import { TAxiosFavoriteData } from '../../../../axios.responseTypes';
import { ILikeButton } from '../../mockupPage.types';

import {
  addItemFavoriteEnd,
  addItemFavoriteStart,
  errorFavorites,
  getCurrentItemFalse,
  getCurrentItemSuccess,
  removeItemFavoriteEnd
} from './favoritesReducer/actions/actionFavorites';
import {
  favoritesReducer,
  initialFavoritesState
} from './favoritesReducer/favoritesReducers';

import './LikeButton.css';

const LikeButton: React.FC<ILikeButton> = ({
  likeButtonStyle,
  tokenId,
  selectedToken
}) => {
  const [{ loading, liked, currentLikeToken }, dispatch] = useReducer(
    favoritesReducer,
    initialFavoritesState
  );

  const addFavorite = async (tokenBody: string | undefined) => {
    const token = {
      token: tokenBody
    };

    if (localStorage.token) {
      dispatch(addItemFavoriteStart());
      try {
        await axios
          .post<TAxiosFavoriteData>('/api/v2/favorites', token, {
            headers: {
              'Content-Type': 'application/json',
              'x-rair-token': localStorage.token
            }
          })
          .then((res) => {
            if (res.data && res.status) {
              dispatch(addItemFavoriteEnd());
            }
          });
      } catch (e) {
        dispatch(errorFavorites());
      }
    }
  };

  const removeFavotite = useCallback(async () => {
    if (localStorage.token) {
      if (currentLikeToken) {
        try {
          dispatch(addItemFavoriteStart());
          await axios
            .delete(`/api/v2/favorites/${currentLikeToken[0]?._id}`, {
              headers: {
                'Content-Type': 'application/json',
                'x-rair-token': localStorage.token
              }
            })
            .then((res) => {
              if (res.data === '') {
                dispatch(removeItemFavoriteEnd());
              }
            });
        } catch (e) {
          dispatch(errorFavorites());
        }
      }
    }
  }, [currentLikeToken]);

  const getFavotiteData = useCallback(async () => {
    try {
      const {
        data: { data }
      } = await axios.get('/api/v2/favorites', {
        headers: {
          'Content-Type': 'application/json',
          'x-rair-token': localStorage.token
        }
      });

      if (data) {
        const check = data.doc.filter((el) => el.token._id === tokenId);
        if (check.length > 0) {
          dispatch(getCurrentItemSuccess(check));
        } else {
          dispatch(getCurrentItemFalse());
        }
      }
    } catch (e) {
      dispatch(errorFavorites());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedToken, loading]);

  useEffect(() => {
    getFavotiteData();
  }, [getFavotiteData]);

  return (
    <>
      {loading ? (
        <CircularProgress sx={{ color: '#E882D5' }} size={40} thickness={4} />
      ) : (
        <Tooltip arrow title={`${liked ? 'Unfavorite' : 'Favorite'}`}>
          {liked ? (
            <div
              className={likeButtonStyle}
              onClick={() => {
                removeFavotite();
              }}>
              <i className="fas fa-heart like-button" />
            </div>
          ) : (
            <div
              className={likeButtonStyle}
              onClick={() => {
                addFavorite(tokenId);
              }}>
              <i className="far fa-heart like-button" />
            </div>
          )}
        </Tooltip>
      )}
    </>
  );
};

export default LikeButton;
