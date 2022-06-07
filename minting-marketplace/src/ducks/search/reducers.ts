import * as types from "./types";

const InitialState = {
  titleSearchDemo: "",
  dataAll: null,
  message: "",
  loading: null,
};

export default function getAllInformationFromSearch(
  state = InitialState,
  action
) {
  switch (action.type) {
    case types.GET_DATA_ALL_START:
      return {
        ...state,
        dataAll: null,
        loading: true,
        message: "",
      };
    case types.GET_DATA_ALL_COMPLETE:
      return {
        ...state,
        dataAll: action.payload,
        loading: false,
        message: "",
      };
    case types.GET_DATA_ALL_CLEAR:
      return {
        ...state,
        dataAll: null,
        loading: false,
        message: "f",
      };
    case types.GET_DATA_ALL_EMPTY:
      return {
        ...state,
        dataAll: null,
        loading: false,
        message: "Nothing",
      };
    default:
      return state;
  }
}
