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
import { ReactComponent as MarkKohlerImage } from '../assets/MarkKohlerImage.svg';
import { ISplashPageProps } from '../splashPage.types';
import { TSplashDataType } from '../splashPage.types';
import ButtonContainerMainBlock from '../SplashPageConfig/MainBlock/ButtonContainerMainBlock';
import ButtonMainBlockWrapper from '../SplashPageConfig/MainBlock/ButtonMainBlockWrapper';
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
  titleColor: '#DF76DF',
  description: 'THURSDAY DECEMBER 8TH 10AM-6PM ET AN NFT GATED EVENT',
  buttonLabel: 'Connect Wallet',
  backgroundImage: <MarkKohlerImage />,
  button2: {
    buttonLabel: 'Email Updates',
    buttonAction: () => window.open('https://discord.gg/pSTbf2yz7V')
  },
  button1: {
    buttonLabel: 'Mint for .27',
    buttonAction: () => window.open('https://twitter.com/SIMDogsXYZ')
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
  // const whatSplashPage = 'genesis-font';

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
              paddingLeft="85px">
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
                  margin={'81px 0 0 70px'}
                  height="191px"
                  width="244px"
                  gap="16px"
                  flexDirection="column">
                  <ButtonMainBlockWrapper height="92px">
                    <ButtonMainBlock
                      width="112.23px"
                      borderRadius="1rem"
                      background="#2351a1"
                      buttonData={splashData.button1}
                      buttonImageHeight="auto"
                      buttonImageWidth="47%"
                      buttonImageMarginRight="0px"
                    />
                    <ButtonMainBlock
                      width="112.23px"
                      borderRadius="1rem"
                      background="#2351a1"
                      buttonData={splashData.button2}
                      buttonImageHeight="auto"
                      buttonImageWidth="47%"
                      buttonImageMarginRight="0px"
                    />
                  </ButtonMainBlockWrapper>
                  <ButtonMainBlock
                    borderRadius="1rem"
                    background="rgb(85, 207, 255)"
                    buttonData={splashData.button3}
                    fontFamily={"'Acme', sans-serif"}
                    fontWeight={'400'}
                    lineHeight={'36px'}
                    fontSize={'36px'}
                    height="83px"
                    width="100%"
                  />
                </ButtonContainerMainBlock>
              </MainBlockInfoText>
              {splashData.backgroundImage && (
                <ImageMainBlock
                  heightDiff="538px"
                  widthDiff="538px"
                  image={splashData.backgroundImage}
                  imageMargin="0px 35px 0px 20px"
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
