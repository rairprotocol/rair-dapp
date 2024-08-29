import { ApiCallResponse, tokenNumberData } from './commonTypes';

// api/nft/network/:network/:contract/:product/numbers
export interface tokenNumbersResponse extends ApiCallResponse {
  tokens: Array<tokenNumberData>;
}
