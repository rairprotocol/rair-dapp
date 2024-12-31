import { useCallback, useEffect, useReducer } from 'react';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CircularProgress } from '@mui/material';
import axios from 'axios';

import { TAxiosFavoriteData } from '../../../../axios.responseTypes';
import { useAppSelector } from '../../../../hooks/useReduxHooks';
import { TooltipBox } from '../../../common/Tooltip/TooltipBox';
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
  const { currentUserAddress } = useAppSelector((store) => store.web3);

  const addFavorite = async (tokenBody: string | undefined) => {
    const token = {
      token: tokenBody
    };

    if (currentUserAddress) {
      dispatch(addItemFavoriteStart());
      try {
        await axios
          .post<TAxiosFavoriteData>('/api/favorites', token, {
            headers: {
              'Content-Type': 'application/json'
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
    if (currentUserAddress) {
      if (currentLikeToken) {
        try {
          dispatch(addItemFavoriteStart());
          await axios
            .delete(`/api/favorites/${currentLikeToken[0]?._id}`, {
              headers: {
                'Content-Type': 'application/json'
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
  }, [currentLikeToken, currentUserAddress]);

  const getFavotiteData = useCallback(async () => {
    try {
      const { data: result } = await axios.get('/api/favorites', {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result && result.result) {
        const check = result.result.filter((el) => el.token._id === tokenId);
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
        <>
          <TooltipBox
            title={`${liked ? 'Remove from Favorites' : 'Add to Favorites'}`}>
            <div
              className={likeButtonStyle}
              onClick={() => {
                if (liked) {
                  removeFavotite();
                } else {
                  addFavorite(tokenId);
                }
              }}>
              <FontAwesomeIcon
                icon={liked ? faHeart : farHeart}
                className="like-button"
              />
            </div>
          </TooltipBox>
        </>
      )}
    </>
  );
};

export default LikeButton;
