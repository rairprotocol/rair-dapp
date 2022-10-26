import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

import { TSplashDataType, TUseGetProductsReturn } from './splashPage.types';

import { TFileType, TNftFilesResponse } from '../../axios.responseTypes';
import { RootState } from '../../ducks';

export const useGetProducts = (
  splashData: TSplashDataType
): TUseGetProductsReturn => {
  const [productsFromOffer, setProductsFromOffer] = useState<TFileType[]>([]);
  const [selectVideo, setSelectVideo] = useState<TFileType>();
  const [userToken, setUserToken] = useState<string | null>();

  const currentUserAddress = useSelector<RootState, string | null | undefined>(
    (state) => state.contractStore.currentUserAddress
  );

  const checkUserConnect = useCallback(() => {
    if (currentUserAddress) {
      setUserToken(localStorage.getItem('token'));
    }
  }, [currentUserAddress]);

  useEffect(() => {
    checkUserConnect();
  }, [checkUserConnect]);

  const getProductsFromOffer = useCallback(async () => {
    if (userToken) {
      const responseIfUserConnect = await axios.get<TNftFilesResponse>(
        `/api/nft/network/${splashData.videoPlayerParams?.blockchain}/${splashData.videoPlayerParams?.contract}/${splashData.videoPlayerParams?.product}/files`,
        {
          headers: {
            Accept: 'application/json',
            'X-rair-token': userToken
          }
        }
      );
      setProductsFromOffer(responseIfUserConnect.data.files);
    } else {
      const response = await axios.get<TNftFilesResponse>(
        `/api/nft/network/${splashData.videoPlayerParams?.blockchain}/${splashData.videoPlayerParams?.contract}/${splashData.videoPlayerParams?.product}/files`
      );
      setProductsFromOffer(response.data.files);
    }
  }, [
    splashData.videoPlayerParams?.blockchain,
    splashData.videoPlayerParams?.contract,
    splashData.videoPlayerParams?.product,
    userToken
  ]);

  useEffect(() => {
    getProductsFromOffer();
  }, [getProductsFromOffer]);

  return [productsFromOffer, selectVideo, setSelectVideo];
};
