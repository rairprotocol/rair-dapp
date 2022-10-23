import { TTokenData } from '../../../../axios.responseTypes';

export const currentTokenData = (tokenData: TTokenData[]) =>
  tokenData &&
  tokenData.map((p) => {
    return {
      value: p.metadata.name,
      id: p._id,
      token: p.token,
      sold: p.isMinted
    };
  });
