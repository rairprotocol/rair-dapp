import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

import { TFileType, TNftFilesResponse } from '../../../axios.responseTypes';
import { TUseGetProductsReturn } from '../../SplashPage/splashPage.types';
import { TUseGetProductsGeneralArguments } from '../types/mainpage.types';

export const useGetProductsGeneral = (
  input: TUseGetProductsGeneralArguments
): TUseGetProductsReturn => {
  const [productsFromOffer, setProductsFromOffer] = useState<TFileType[]>([]);
  const [selectVideo, setSelectVideo] = useState<TFileType>();

  const getProductsFromOffer = useCallback(async () => {
    const response = await axios.get<TNftFilesResponse>(
      `/api/nft/network/${input.blockchain}/${input.contract}/${input.product}/files`
    );
    setProductsFromOffer(response.data.files);
    setSelectVideo(response.data.files[0]);
  }, [input.blockchain, input.contract, input.product]);

  useEffect(() => {
    getProductsFromOffer();
  }, [getProductsFromOffer]);

  return [productsFromOffer, selectVideo, setSelectVideo];
};
