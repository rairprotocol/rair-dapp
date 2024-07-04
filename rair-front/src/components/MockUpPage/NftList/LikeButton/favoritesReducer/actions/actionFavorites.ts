import { TTokenData } from '../../../../../../axios.responseTypes';

import * as types from './../actionTypes/types';

const addItemFavoriteStart = () =>
  ({
    type: types.ADD_ITEM_FAVORITES_START
  }) as const;

const addItemFavoriteEnd = () =>
  ({
    type: types.ADD_ITEM_FAVORITES_END
  }) as const;

const removeItemFavoriteEnd = () =>
  ({
    type: types.REMOVE_ITEM_FAVORITES_END
  }) as const;

const getCurrentItemSuccess = (item: TTokenData | null) =>
  ({
    type: types.GET_CURRENT_ITEM_SUCCESS,
    item
  }) as const;

const getCurrentItemFalse = () =>
  ({
    type: types.GET_CURRENT_ITEM_FALSE
  }) as const;

const errorFavorites = () =>
  ({
    type: types.ERROR_FAVORITES
  }) as const;

export {
  addItemFavoriteEnd,
  addItemFavoriteStart,
  errorFavorites,
  getCurrentItemFalse,
  getCurrentItemSuccess,
  removeItemFavoriteEnd
};
