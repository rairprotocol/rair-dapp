import * as types from './types';

const getCurrentPage = (currentPage: number) =>
  ({
    type: types.GET_CURRENT_PAGE_START,
    currentPage
  }) as const;

const getCurrentPageEnd = () =>
  ({
    type: types.GET_CURRENT_PAGE_END
  }) as const;

const getCurrentPageNull = () =>
  ({
    type: types.GET_CURRENT_NULL
  }) as const;

const getCurrentPageComplete = (currentPage: number) =>
  ({ type: types.GET_CURRENT_PAGE_COMPLETE, currentPage }) as const;

export {
  getCurrentPage,
  getCurrentPageComplete,
  getCurrentPageEnd,
  getCurrentPageNull
};
