import { FC, useEffect, useState } from 'react';

import { teamNFTNYCArray } from './AboutUsTeam';

import useConnectUser from '../../../hooks/useConnectUser';
import { useOpenVideoPlayer } from '../../../hooks/useOpenVideoPlayer';
import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxHooks';
import useSwal from '../../../hooks/useSwal';
import { setSEOInfo } from '../../../redux/seoSlice';
import { setRequestedChain } from '../../../redux/web3Slice';
import { SplashPageProps } from '../../../types/commonTypes';
import { useNFTNYC } from '../../../utils/infoSplashData/nftnyc';
import { ImageLazy } from '../../MockUpPage/ImageLazy/ImageLazy';
import CustomButton from '../../MockUpPage/utils/button/CustomButton';
import MetaTags from '../../SeoTags/MetaTags';
import NFTNYC_favicon from '../images/favicons/NFTNYX_TITLE.ico';
import { NFTNYC_TITLE, warning0 } from '../images/NFTNYC/nftnyc';
import NotCommercialTemplate from '../NotCommercial/NotCommercialTemplate';
import SplashCardButton from '../SplashPageConfig/CardBlock/CardButton/SplashCardButton';
import { handleReactSwal } from '../SplashPageConfig/utils/reactSwalModal';
import UnlockableVideosWrapper from '../SplashPageConfig/VideoBlock/UnlockableVideosWrapper/UnlockableVideosWrapper';
import SplashVideoWrapper from '../SplashPageConfig/VideoBlock/VideoBlockWrapper/SplashVideoWrapper';
import SplashVideoTextBlock from '../SplashPageConfig/VideoBlock/VideoTextBlock/SplashVideoTextBlock';
import { useGetProducts } from '../splashPageProductsHook';
import AuthorCard from '../SplashPageTemplate/AuthorCard/AuthorCard';
import ModalHelp from '../SplashPageTemplate/ModalHelp';
/* importing Components*/
import TeamMeet from '../TeamMeet/TeamMeetList';
import WarningModal from '../WarningModal/WarningModal';

import '../SplashPageTemplate/AuthorCard/AuthorCard.css';
import '../../AboutPage/AboutPageNew/AboutPageNew.css';
import './NFTNYC.css';

const NFTNYCSplashPage: FC<SplashPageProps> = ({ setIsSplashPage }) => {
  const dispatch = useAppDispatch();
  const seo = useAppSelector((store) => store.seo);
  const { primaryColor } = useAppSelector((store) => store.colors);
  const { connectUserData } = useConnectUser();
  const { splashData } = useNFTNYC(connectUserData);
  const reactSwal = useSwal();

  useEffect(() => {
    dispatch(
      setSEOInfo({
        title: 'NFTNYC X RAIR',
        ogTitle: 'NFTNYC X RAIR',
        twitterTitle: 'NFTNYC X RAIR',
        contentName: 'author',
        content: '#NFTLA',
        description:
          'Claim your NFT to unlock encrypted streams from the NFTLA conference',
        ogDescription:
          'Claim your NFT to unlock encrypted streams from the NFTLA conference',
        twitterDescription:
          'Claim your NFT to unlock encrypted streams from the NFTLA conference',
        image: NFTNYC_TITLE,
        favicon: NFTNYC_favicon,
        faviconMobile: NFTNYC_favicon
      })
    );
    //eslint-disable-next-line
  }, []);

  /* UTILITIES FOR VIDEO PLAYER VIEW (placed this functionality into custom hook for reusability)*/
  const [productsFromOffer, selectVideo, setSelectVideo] =
    useGetProducts(splashData);
  const [openVideoplayer, setOpenVideoPlayer, handlePlayerClick] =
    useOpenVideoPlayer();

  /* UTILITIES FOR NFT PURCHASE */
  const [openCheckList /*setOpenCheckList*/] = useState<boolean>(false);
  const [purchaseList, setPurchaseList] = useState<boolean>(true);
  const ukraineglitchChainId = '0x1';

  const togglePurchaseList = () => {
    setPurchaseList((prev) => !prev);
  };

  useEffect(() => {
    dispatch(setRequestedChain(ukraineglitchChainId));
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    setIsSplashPage?.(true);
  }, [setIsSplashPage]);

  const whatSplashPage = 'nftnyc-font';

  return (
    <div className="wrapper-splash-page nftnyc">
      <MetaTags seoMetaTags={seo} />
      <div className="template-home-splash-page">
        <ModalHelp
          openCheckList={openCheckList}
          purchaseList={purchaseList}
          togglePurchaseList={togglePurchaseList}
          backgroundColor={{
            darkTheme: 'rgb(3, 91, 188)',
            lightTheme: 'rgb(3, 91, 188)'
          }}
        />
        <AuthorCard {...{ splashData, connectUserData, whatSplashPage }} />
        <div style={{ height: '78px' }} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
          <h1 className="nftnyc-font">How it works</h1>
          <div
            className="nftnyc-font"
            style={{ fontSize: 'calc(.75rem + 1vw)', margin: '24px 0' }}>
            1. Export your Kred NFT to Metamask
          </div>
          <div
            className="nftnyc-font"
            style={{ fontSize: 'calc(.75rem + 1vw)' }}>
            2. OR just connect your wallet. We’ll mint an unlock NFT in the near
            future
          </div>
          <div
            className="nftnyc-font"
            style={{ fontSize: 'calc(.75rem + 1vw)', margin: '24px 0' }}>
            Click sign. We only ask for a single challenge request.
          </div>
          <ImageLazy
            className="warning-img"
            src={warning0}
            alt="Matamask Signature Request"
          />
          <div className="btn-submit-with-form">
            <CustomButton
              // width={'200px'}
              height={'4rem'}
              text={'Need Help?'}
              font={'Charriot Deluxe'}
              background={'#F15621'}
              hoverBackground={'#F15621'}
              padding={'0 10px'}
              onClick={() =>
                reactSwal.fire({
                  title:
                    'Watch out for sign requests that look like this. There are now gasless attack vectors that can set permissions to drain your wallet',
                  html: <WarningModal />,
                  customClass: {
                    popup: `bg-${primaryColor} nftnyc-radius nftnyc-resp `,
                    title: 'text-nftnyc'
                    // container: 'nftnyc-radius'
                  },
                  showConfirmButton: false
                })
              }
            />
          </div>
        </div>
        <div style={{ height: '58px' }} />
        <SplashVideoWrapper>
          <SplashVideoTextBlock>
            <SplashCardButton
              className="need-help-kohler"
              buttonAction={handleReactSwal(reactSwal)}
              buttonLabel={'Need Help'}
            />
          </SplashVideoTextBlock>
          <UnlockableVideosWrapper
            selectVideo={selectVideo}
            setSelectVideo={setSelectVideo}
            productsFromOffer={productsFromOffer}
            openVideoplayer={openVideoplayer}
            setOpenVideoPlayer={setOpenVideoPlayer}
            handlePlayerClick={handlePlayerClick}
          />
        </SplashVideoWrapper>
        {/* <VideoPlayerModule
          videoData={splashData.videoData}
        /> */}
        {/* <div style={{ height: '108px' }} /> */}
        {/* <div className="info-block">
          {' '}
          Unlockable Conferences Videos Coming Soon
        </div> */}
        <div style={{ height: '108px' }} />
        <TeamMeet
          arraySplash={'nftnyc'}
          classNameHead={'nftnyc-font nftnyc-textCenter'}
          titleHeadFirst={'About'}
          teamArray={teamNFTNYCArray}
        />
        <NotCommercialTemplate NFTName={splashData.NFTName} />
      </div>
    </div>
  );
};

export default NFTNYCSplashPage;
