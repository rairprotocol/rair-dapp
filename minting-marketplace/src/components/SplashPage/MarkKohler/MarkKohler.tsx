import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import RairFavicon from '../../../components/MockUpPage/assets/rair_favicon.ico';
import { RootState } from '../../../ducks';
import { ColorChoice } from '../../../ducks/colors/colorStore.types';
import { setRealChain } from '../../../ducks/contracts/actions';
import { ContractsInitialType } from '../../../ducks/contracts/contracts.types';
import { setInfoSEO } from '../../../ducks/seo/actions';
import { TInfoSeo } from '../../../ducks/seo/seo.types';
import MetaTags from '../../SeoTags/MetaTags';
import MarkKohlerImage from '../assets/MarkKohlerImage.webp';
import { ReactComponent as MetaMaskFox } from '../assets/MetaMaskFox.svg';
import { ISplashPageProps } from '../splashPage.types';
import { TSplashDataType } from '../splashPage.types';
import ButtonContainerMainBlock from '../SplashPageConfig/MainBlock/ButtonContainerMainBlock';
import ImageMainBlock from '../SplashPageConfig/MainBlock/ImageMainBlock';
import MainBlockInfoText from '../SplashPageConfig/MainBlock/MainBlockInfoText';
import MainTitleBlock from '../SplashPageConfig/MainBlock/MainTitleBlock';
import SplashPageMainBlock from '../SplashPageConfig/MainBlock/SplashPageMainBlock';
import ButtonMainBlock from '../SplashPageConfig/MainBlock/TButtonMainBlock';
import { StyledSplashPageWrapperContainer } from '../SplashPageConfig/styles/StyledWrapperContainers.styled';
import { theme } from '../SplashPageConfig/theme.styled';
import { useGetProducts } from '../splashPageProductsHook';
import ModalHelp from '../SplashPageTemplate/ModalHelp';

export const splashData: TSplashDataType = {
  title: 'TAX HACKS SUMMIT',
  description: 'THURSDAY DECEMBER 8TH 10AM-6PM ET AN NFT GATED EVENT',
  backgroundImage: MarkKohlerImage,
  button2: {
    buttonLabel: 'Email Updates',
    buttonAction: () => console.info('email updates')
  },
  button1: {
    buttonCustomLogo: <MetaMaskFox />,
    buttonLabel: 'Mint for .27',
    buttonAction: () => console.info('mint this token')
  }
};

const MarkKohler: React.FC<ISplashPageProps> = ({
  loginDone,
  connectUserData,
  setIsSplashPage,
  isSplashPage
}) => {
  const dispatch = useDispatch();
  const seo = useSelector<RootState, TInfoSeo>((store) => store.seoStore);

  const [productsFromOffer, selectVideo, setSelectVideo] =
    useGetProducts(splashData);

  const carousel_match = window.matchMedia('(min-width: 900px)');
  const [carousel, setCarousel] = useState<boolean>(carousel_match.matches);

  /* UTILITIES FOR NFT PURCHASE */
  const [soldCopies, setSoldCopies] = useState<number>(0);
  const { currentChain, minterInstance } = useSelector<
    RootState,
    ContractsInitialType
  >((store) => store.contractStore);
  const [openCheckList, setOpenCheckList] = useState<boolean>(false);
  const [purchaseList, setPurchaseList] = useState<boolean>(true);

  const primaryColor = useSelector<RootState, ColorChoice>(
    (store) => store.colorStore.primaryColor
  );

  useEffect(() => {
    dispatch(
      setInfoSEO({
        title: '#Mark Kohler',
        ogTitle: '#Mark Kohler',
        twitterTitle: '#Mark Kohler',
        contentName: 'author',
        content: '#Mark Kohler',
        description: 'THURSDAY DECEMBER 8TH 10AM-6PM ET AN NFT GATED EVENT',
        ogDescription: 'THURSDAY DECEMBER 8TH 10AM-6PM ET AN NFT GATED EVENT',
        twitterDescription:
          'THURSDAY DECEMBER 8TH 10AM-6PM ET AN NFT GATED EVENT',
        image:
          'https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW',
        favicon: RairFavicon,
        faviconMobile: RairFavicon
      })
    );
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    setIsSplashPage?.(true);
  }, [setIsSplashPage]);

  useEffect(() => {
    window.addEventListener('resize', () =>
      setCarousel(carousel_match.matches)
    );
    return () =>
      window.removeEventListener('resize', () =>
        setCarousel(carousel_match.matches)
      );
  }, [carousel_match.matches]);

  useEffect(() => {
    dispatch(setRealChain('0x5'));
    //eslint-disable-next-line
  }, []);

  const togglePurchaseList = () => {
    setPurchaseList((prev) => !prev);
  };

  return (
    <div className="wrapper-splash-page">
      <MetaTags seoMetaTags={seo} />
      <div className="template-home-splash-page">
        <ModalHelp
          openCheckList={openCheckList}
          purchaseList={purchaseList}
          togglePurchaseList={togglePurchaseList}
          templateOverride={true}
          backgroundColor={{
            darkTheme: 'rgb(3, 91, 188)',
            lightTheme: 'rgb(3, 91, 188)'
          }}
        />
        <ThemeProvider theme={theme}>
          <StyledSplashPageWrapperContainer>
            <SplashPageMainBlock
              bgColor="#FFFFFF"
              borderRadius="20px"
              paddingLeft="85px"
              widthDiff="1267px"
              heightDiff="642px">
              <MainBlockInfoText padding={'0px'}>
                <MainTitleBlock
                  color="#DF76DF"
                  fontSize="50px"
                  fontWeight={400}
                  text={splashData.title}
                  fontFamily={'Nebulosa Black Display Stencil'}
                  lineHeight={'113.7%'}
                  margin={'107px 0px 20px'}
                  width={'538px'}
                />
                <MainTitleBlock
                  color="#000000"
                  fontSize="28px"
                  fontWeight={400}
                  text={splashData.description}
                  fontFamily={'Nebulosa Black Display Stencil'}
                  lineHeight={'36px'}
                  width="485px"
                />
                <ButtonContainerMainBlock
                  margin={'63px 0 0px'}
                  height="148px"
                  width="335px"
                  gap="20px"
                  flexDirection="column">
                  <ButtonMainBlock
                    width="100%"
                    height={'64px'}
                    padding="14px 0px"
                    fontFamily="Plus Jakarta Sans"
                    borderRadius="16px"
                    fontSize={'22px'}
                    fontWeight={'700'}
                    lineHeight="28px"
                    color="#FFFFFF"
                    background={`linear-gradient(96.34deg, #035BBC 0%, #805FDA 10.31%, #8C63DA 20.63%, #9867D9 30.94%, #A46BD9 41.25%, #AF6FD8 51.56%, #AF6FD8 51.56%, #BB73D7 61.25%, #C776D7 70.94%, #D27AD6 80.62%, #DD7ED6 90.31%, #E882D5 100%)`}
                    buttonData={splashData.button1}
                    buttonLogoMarginRight="32px"
                  />
                  <ButtonMainBlock
                    borderRadius="16px"
                    background="#000000"
                    buttonData={splashData.button2}
                    fontFamily={'Plus Jakarta Sans'}
                    fontWeight={'700'}
                    lineHeight={'28px'}
                    fontSize={'22px'}
                    color={'#FFFFFF'}
                    height="64px"
                    width="100%"
                  />
                </ButtonContainerMainBlock>
              </MainBlockInfoText>
              {splashData.backgroundImage && (
                <ImageMainBlock
                  image={splashData.backgroundImage}
                  heightDiff="513px"
                  widthDiff="510px"
                  imageMargin="0px 61px 0px 20px"
                />
              )}
            </SplashPageMainBlock>
          </StyledSplashPageWrapperContainer>
        </ThemeProvider>
      </div>
    </div>
  );
};

export default MarkKohler;
