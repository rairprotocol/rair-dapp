import { ApiCallResponse, tokenNumberData } from './commonTypes';
import { Contract } from './databaseTypes';

import { CollectionTokens } from '../redux/tokenSlice';

// api/nft/network/:network/:contract/:product/numbers
export interface tokenNumbersResponse extends ApiCallResponse {
  tokens: Array<tokenNumberData>;
}

// api/tokens/id/:id
export interface SingleTokenResponse extends ApiCallResponse {
  tokenData: CollectionTokens;
}

// api/contract/:id
export interface SingleContractResponse extends ApiCallResponse {
  contract?: Contract;
}
