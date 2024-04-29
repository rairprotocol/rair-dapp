import {
  getCurrentPage,
  getCurrentPageComplete,
  getCurrentPageEnd,
  getCurrentPageNull
} from './actions';

export type TPagesInitialState = {
  currentPage: number;
  loading: boolean | null;
};

export type TGetCurrentPageStart = ReturnType<typeof getCurrentPage>;
export type TGetCurrentPageEnd = ReturnType<typeof getCurrentPageEnd>;
export type TGetCurrentPageComplete = ReturnType<typeof getCurrentPageComplete>;
export type TGetCurrentPageNull = ReturnType<typeof getCurrentPageNull>;

export type TPagesActionsType =
  | TGetCurrentPageStart
  | TGetCurrentPageEnd
  | TGetCurrentPageComplete
  | TGetCurrentPageNull;
