import { TPagesActionsType, TPagesInitialState } from './pages.types';
import * as types from './types';

const InitialState: TPagesInitialState = {
  currentPage: 1,
  loading: null
};

export default function getPageStore(
  state: TPagesInitialState = InitialState,
  action: TPagesActionsType
): TPagesInitialState {
  switch (action.type) {
    case types.GET_CURRENT_PAGE_START:
      return {
        ...state,
        currentPage: action.currentPage,
        loading: true
      };
    case types.GET_CURRENT_PAGE_COMPLETE:
      return {
        ...state,
        currentPage: action.currentPage,
        loading: false
      };
    case types.GET_CURRENT_PAGE_END:
      return {
        ...state,
        currentPage: 1,
        loading: true
      };
    case types.GET_CURRENT_NULL:
      return {
        ...state,
        currentPage: 1
      };
    default:
      return state;
  }
}
