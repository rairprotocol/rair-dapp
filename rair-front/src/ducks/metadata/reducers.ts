import { TMetadataActions, TMetadataInitialType } from './metadata.types';
import * as types from './types';

const InitialState: TMetadataInitialType = {
  showSidebar: true,
  errorMessage: null
};

export default function metadataStore(
  state: TMetadataInitialType = InitialState,
  action: TMetadataActions
) {
  switch (action.type) {
    case types.SHOW_SIDEBAR_TRUE:
      return {
        ...state,
        showSidebar: true
      };
    case types.SHOW_SIDEBAR_FALSE:
      return {
        ...state,
        showSidebar: false
      };
    case types.UPDATE_TOKEN_METADATA_ERROR:
      return {
        ...state,
        error_message: action.errorMessage
      };
    // case types.UPDATE_TOKEN_METADATA:
    // 	return {
    // 		...state,

    // 	}
    default:
      return state;
  }
}
