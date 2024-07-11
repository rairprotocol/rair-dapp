import { TSearchDataObject } from './search.types';
import * as types from './types';

const getDataAllStart = (titleSearchDemo: string) =>
  ({
    type: types.GET_DATA_ALL_START,
    titleSearchDemo
  }) as const;
const getDataAllComplete = (data: TSearchDataObject) =>
  ({
    type: types.GET_DATA_ALL_COMPLETE,
    data
  }) as const;
const getDataAllEmpty = (message: string) =>
  ({
    type: types.GET_DATA_ALL_EMPTY,
    message
  }) as const;
const getDataAllClear = () =>
  ({
    type: types.GET_DATA_ALL_CLEAR
  }) as const;

export {
  getDataAllClear,
  getDataAllComplete,
  getDataAllEmpty,
  getDataAllStart
};
