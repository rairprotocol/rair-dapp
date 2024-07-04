import * as types from './types';

const getListResalesStart = () =>
  ({
    type: types.GET_RESALES_LIST_START
  }) as const;

const getResalesListComplete = (resaleList: any | null) =>
  ({ type: types.GET_RESALES_LIST_COMPLETE, resaleList }) as const;

const getResalesListTotalClear = () =>
  ({
    type: types.GET_RESALES_LIST_TOTAL_CLEAR
  }) as const;

const getResalesListTotal = (totalNumberVideo: number) =>
  ({ type: types.GET_RESALES_LIST_TOTAL, totalNumberVideo }) as const;

const refreshAction = (refresh: boolean) =>
  ({
    type: types.REFRESH_RESALES_LIST,
    refresh
  }) as const;

const getListResalesError = (error: string | null) =>
  ({ type: types.GET_RESALES_LIST_ERROR, error }) as const;

export {
  getListResalesError,
  getListResalesStart,
  getResalesListComplete,
  getResalesListTotal,
  getResalesListTotalClear,
  refreshAction
};
