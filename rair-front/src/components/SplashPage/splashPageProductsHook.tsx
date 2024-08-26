import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

import { TSplashDataType, TUseGetProductsReturn } from './splashPage.types';

import { TNftFilesResponse } from '../../axios.responseTypes';
import { useAppSelector } from '../../hooks/useReduxHooks';
import { CatalogVideoItem } from '../../types/commonTypes';

export const useGetProducts = (
  splashData: TSplashDataType
): TUseGetProductsReturn => {
  const [productsFromOffer, setProductsFromOffer] = useState<
    CatalogVideoItem[]
  >([]);
  const [selectVideo, setSelectVideo] = useState<CatalogVideoItem>();

  const { currentUserAddress } = useAppSelector((store) => store.web3);

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
