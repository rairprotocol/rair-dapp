import {
  IInitialFavoritesState,
  TFavoritesReducerActionType
} from './favorites.types';

import * as types from './actionTypes/types';

export const initialFavoritesState: IInitialFavoritesState = {
  liked: false,
  currentLikeToken: null,
  loading: false
};

export const favoritesReducer = (
  state: IInitialFavoritesState,
  action: TFavoritesReducerActionType
) => {
  switch (action.type) {
    case types.ADD_ITEM_FAVORITES_START:
      return {
        ...state,
        loading: true,
        liked: false
      };
    case types.ADD_ITEM_FAVORITES_END:
      return {
        ...state,
        loading: false,
        liked: true
      };
    case types.REMOVE_ITEM_FAVORITES_END:
      return {
        ...state,
        loading: false,
        liked: false
      };
    case types.GET_CURRENT_ITEM_SUCCESS:
      return {
        ...state,
        liked: true,
        currentLikeToken: action.item
      };
    case types.GET_CURRENT_ITEM_FALSE:
      return {
        ...state,
        liked: false,
        currentLikeToken: null
      };
    case types.ERROR_FAVORITES:
      return {
        ...state,
        loading: false
      };
  }
};
