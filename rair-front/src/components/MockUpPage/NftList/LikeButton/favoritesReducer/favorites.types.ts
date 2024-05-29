import { TTokenData } from '../../../../../axios.responseTypes';

import {
  addItemFavoriteEnd,
  addItemFavoriteStart,
  errorFavorites,
  getCurrentItemFalse,
  getCurrentItemSuccess,
  removeItemFavoriteEnd
} from './actions/actionFavorites';

export interface IInitialFavoritesState {
  liked: boolean;
  currentLikeToken: TTokenData | null;
  loading: boolean;
}

export type TAddItemFavoriteStart = ReturnType<typeof addItemFavoriteStart>;
export type TAddItemFavoriteEnd = ReturnType<typeof addItemFavoriteEnd>;
export type TRemoveItemFavoritesEnd = ReturnType<typeof removeItemFavoriteEnd>;
export type TGetCurrentItemSuccess = ReturnType<typeof getCurrentItemSuccess>;
export type TgetCurrentItemFalse = ReturnType<typeof getCurrentItemFalse>;
export type TErrorFavorites = ReturnType<typeof errorFavorites>;

export type TFavoritesReducerActionType =
  | TAddItemFavoriteStart
  | TAddItemFavoriteEnd
  | TRemoveItemFavoritesEnd
  | TGetCurrentItemSuccess
  | TgetCurrentItemFalse
  | TErrorFavorites;
