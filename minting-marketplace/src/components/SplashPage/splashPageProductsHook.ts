import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

import { TSplashDataType, TUseGetProductsReturn } from './splashPage.types';

import { TFileType, TNftFilesResponse } from '../../axios.responseTypes';

export const useGetProducts = (
  splashData: TSplashDataType
): TUseGetProductsReturn => {
  const [productsFromOffer, setProductsFromOffer] = useState<TFileType[]>([]);
  const [selectVideo, setSelectVideo] = useState<TFileType>();

  const getProductsFromOffer = useCallback(async () => {
    const response = await axios.get<TNftFilesResponse>(
      `/api/nft/network/${splashData.videoPlayerParams?.blockchain}/${splashData.videoPlayerParams?.contract}/${splashData.videoPlayerParams?.product}/files`
    );
    setProductsFromOffer(response.data.files);
    setSelectVideo(response.data.files[0]);
  }, [
    splashData.videoPlayerParams?.blockchain,
    splashData.videoPlayerParams?.contract,
    splashData.videoPlayerParams?.product
  ]);

  useEffect(() => {
    getProductsFromOffer();
  }, [getProductsFromOffer]);

  return [productsFromOffer, selectVideo, setSelectVideo];
};
