import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../../../ducks';
import { ColorChoice } from '../../../../ducks/colors/colorStore.types';
import { setRealChain } from '../../../../ducks/contracts/actions';
import { ContractsInitialType } from '../../../../ducks/contracts/contracts.types';
import { TMainContractType } from '../../splashPage.types';
import { useGetProducts } from '../../splashPageProductsHook';
import SplashPageMainBlock from '../MainBlock/SplashPageMainBlock';
import { ISplashPageWrapper } from '../splashConfig.types';
import { StyledSplashPageWrapperContainer } from '../styles/StyledWrapperContainers.styled';

const mainContract: TMainContractType = {
  contractAddress: '0xbd034e188f35d920cf5dedfb66f24dcdd90d7804',
  requiredBlockchain: '0x1',
  offerIndex: ['0', '1']
};
// test contract
const testContract: TMainContractType = {
  contractAddress: '0x971ee6dd633cb6d8cc18e5d27000b7dde30d8009',
  requiredBlockchain: '0x5',
  offerIndex: ['52', '0']
};

const contract =
  process.env.REACT_APP_TEST_CONTRACTS === 'true'
    ? testContract.contractAddress
    : mainContract.contractAddress;
const blockchain =
  process.env.REACT_APP_TEST_CONTRACTS === 'true'
    ? testContract.requiredBlockchain
    : mainContract.requiredBlockchain;

const SplashPageWrapper: React.FC<ISplashPageWrapper> = ({
  // splashData,
  // loginDone,
  // setIsSplashPage,
  // connectUserData,
  children
}) => {
  // /* UTILITIES FOR VIDEO PLAYER VIEW (placed this functionality into custom hook for reusability)*/
  // const [productsFromOffer, selectVideo, setSelectVideo] =
  //   useGetProducts(splashData);

  // /* UTILITIES FOR CAROUSEL */
  // const carousel_match = window.matchMedia('(min-width: 900px)');
  // const [carousel, setCarousel] = useState<boolean>(carousel_match.matches);

  // /* UTILITIES FOR NFT PURCHASE */
  // const [soldCopies, setSoldCopies] = useState<number>(0);
  // const { currentChain, minterInstance } = useSelector<
  //   RootState,
  //   ContractsInitialType
  // >((store) => store.contractStore);
  // const [openCheckList, setOpenCheckList] = useState<boolean>(false);
  // const [purchaseList, setPurchaseList] = useState<boolean>(true);

  // const primaryColor = useSelector<RootState, ColorChoice>(
  //   (store) => store.colorStore.primaryColor
  // );
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   setIsSplashPage?.(true);
  // }, [setIsSplashPage]);
  // // const whatSplashPage = 'genesis-font';

  // useEffect(() => {
  //   window.addEventListener('resize', () =>
  //     setCarousel(carousel_match.matches)
  //   );
  //   return () =>
  //     window.removeEventListener('resize', () =>
  //       setCarousel(carousel_match.matches)
  //     );
  // }, [carousel_match.matches]);

  // useEffect(() => {
  //   dispatch(setRealChain(blockchain));
  //   //eslint-disable-next-line
  // }, []);

  // const togglePurchaseList = () => {
  //   setPurchaseList((prev) => !prev);
  // };
  // const toggleCheckList = () => {
  //   setOpenCheckList((prev) => !prev);
  // };
  // const getAllProduct = useCallback(async () => {
  //   if (loginDone) {
  //     if (currentChain === splashData.purchaseButton?.requiredBlockchain) {
  //       setSoldCopies(
  //         (
  //           await minterInstance?.getOfferRangeInfo(
  //             ...(splashData.purchaseButton?.offerIndex || [])
  //           )
  //         ).tokensAllowed.toString()
  //       );
  //     } else {
  //       setSoldCopies(0);
  //     }
  //   }
  // }, [
  //   setSoldCopies,
  //   loginDone,
  //   currentChain,
  //   minterInstance,
  //   splashData.purchaseButton?.offerIndex,
  //   splashData.purchaseButton?.requiredBlockchain
  // ]);

  // useEffect(() => {
  //   getAllProduct();
  // }, [getAllProduct]);
  return (
    <StyledSplashPageWrapperContainer>
      {children}
    </StyledSplashPageWrapperContainer>
  );
};

export default SplashPageWrapper;
