import * as types from "./types";

const getDataAllStart = () => ({
  type: types.GET_DATA_ALL_START,
});
const getDataAllComplete = (payload) => ({
  type: types.GET_DATA_ALL_COMPLETE,
  payload: { payload },
});
const getDataAllEmpty = () => ({
  type: types.GET_DATA_ALL_EMPTY,
});
const getDataAllClear = () => ({
  type: types.GET_DATA_ALL_CLEAR,
});

export { getDataAllStart, getDataAllComplete, getDataAllEmpty, getDataAllClear };
