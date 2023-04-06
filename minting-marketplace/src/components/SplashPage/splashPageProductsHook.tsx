import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

import { TSplashDataType, TUseGetProductsReturn } from './splashPage.types';

import { TFileType, TNftFilesResponse } from '../../axios.responseTypes';
import { RootState } from '../../ducks';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';

export const useGetProducts = (
  splashData: TSplashDataType
): TUseGetProductsReturn => {
  const [productsFromOffer, setProductsFromOffer] = useState<TFileType[]>([]);
  const [selectVideo, setSelectVideo] = useState<TFileType>();

  const { currentUserAddress } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );

  const getProductsFromOffer = useCallback(async () => {
    if (currentUserAddress) {
      const responseIfUserConnect = await axios.get<TNftFilesResponse>(
        `/api/nft/network/${splashData.videoPlayerParams?.blockchain}/${splashData.videoPlayerParams?.contract}/${splashData.videoPlayerParams?.product}/files`,
        {
          headers: {
            Accept: 'application/json'
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
    currentUserAddress
  ]);

  useEffect(() => {
    getProductsFromOffer();
  }, [getProductsFromOffer]);

  return [productsFromOffer, selectVideo, setSelectVideo];
};
