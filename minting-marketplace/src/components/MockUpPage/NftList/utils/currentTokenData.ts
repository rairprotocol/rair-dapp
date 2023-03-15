import { TTokenData } from '../../../../axios.responseTypes';

export const currentTokenData = (tokenData: { [index: string]: TTokenData }) =>
  tokenData &&
  Object.keys(tokenData).map((index) => {
    return {
      value: tokenData[index].metadata.name,
      id: tokenData[index]._id,
      token: tokenData[index].token,
      sold: tokenData[index].isMinted
    };
  });
