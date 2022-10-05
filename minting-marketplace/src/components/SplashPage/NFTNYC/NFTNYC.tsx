import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { RootState } from '../../../ducks';
import { ColorChoice } from '../../../ducks/colors/colorStore.types';
import { setRealChain } from '../../../ducks/contracts/actions';
import { ContractsInitialType } from '../../../ducks/contracts/contracts.types';
import { setInfoSEO } from '../../../ducks/seo/actions';
import { TInfoSeo } from '../../../ducks/seo/seo.types';
import { metaMaskIcon } from '../../../images';
import { ImageLazy } from '../../MockUpPage/ImageLazy/ImageLazy';
import VideoPlayerView from '../../MockUpPage/NftList/NftData/UnlockablesPage/VideoPlayerView';
import MetaTags from '../../SeoTags/MetaTags';
import NFTNYC_favicon from '../images/favicons/NFTNYX_TITLE.ico';
import { NFTNYC_TITLE, warning0 } from '../images/NFTNYC/nftnyc';
import NotCommercialTemplate from '../NotCommercial/NotCommercialTemplate';
import { ISplashPageProps, TSplashDataType } from '../splashPage.types';
import { useGetProducts } from '../splashPageProductsHook';
import AuthorCard from '../SplashPageTemplate/AuthorCard/AuthorCard';
import ModalHelp from '../SplashPageTemplate/ModalHelp';
/* importing Components*/
import TeamMeet from '../TeamMeet/TeamMeetList';
import WarningModal from '../WarningModal';

import '../SplashPageTemplate/AuthorCard/AuthorCard.css';
import '../../AboutPage/AboutPageNew/AboutPageNew.css';
import './NFTNYC.css';

const reactSwal = withReactContent(Swal);

const NFTNYCSplashPage: React.FC<ISplashPageProps> = ({
  connectUserData,
  setIsSplashPage
}) => {
  const dispatch = useDispatch();
  const seo = useSelector<RootState, TInfoSeo>((store) => store.seoStore);
  const primaryColor = useSelector<RootState, ColorChoice>(
    (store) => store.colorStore.primaryColor
  );
  const { currentUserAddress } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );

  const splashData: TSplashDataType = {
    NFTName: 'NFT',
    title: 'NFTNYC X RAIR',
    titleColor: '#F15621',
    description: [
      'Connect your wallet to receive a free airdrop. Unlock exclusive encrypted streams'
    ],
    videoPlayerParams: {
      blockchain: '0x89',
      contract: '0xb41660b91c8ebc19ffe345726764d4469a4ab9f8',
      product: '0'
    },
    purchaseButton: {
      requiredBlockchain: '0x89',
      contractAddress: '0xb41660b91c8ebc19ffe345726764d4469a4ab9f8'
    },
    /*  this block needs to be changed */
    buttonLabel: 'Connect Wallet',
    buttonBackgroundHelp: 'rgb(3, 91, 188)',
    backgroundImage: NFTNYC_TITLE,
    button1: currentUserAddress
      ? {
          buttonColor: '#F15621',
          buttonLabel: 'Connect wallet',
          buttonImg: metaMaskIcon,
          buttonAction: connectUserData
        }
      : {},
    button2: {
      buttonColor: '#000000',
      buttonLabel: 'View on Opensea',
      buttonImg: null,
      buttonLink: 'https://opensea.io/collection/swagnftnyc'
    },
    exclusiveNft: {
      title: 'NFTs',
      titleColor: 'rgb(3, 91, 188)'
    },
    videoData: {
      video: null,
      videoTitle: '',
      videoModuleDescription:
        'NFT owners can learn more about the project by signing with metamask to unlock an encrypted stream ',
      videoModuleTitle: 'Exclusive 1: Degen Toonz Cartoon',
      demo: true
    }
  };

  useEffect(() => {
    dispatch(
      setInfoSEO({
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

  /* UTILITIES FOR NFT PURCHASE */
  const [openCheckList /*setOpenCheckList*/] = useState<boolean>(false);
  const [purchaseList, setPurchaseList] = useState<boolean>(true);
  const ukraineglitchChainId = '0x1';

  const togglePurchaseList = () => {
    setPurchaseList((prev) => !prev);
  };

  useEffect(() => {
    dispatch(setRealChain(ukraineglitchChainId));
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
            <button
              className="nftnyc-font"
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
              style={{
                background: '#F15621'
              }}>
              Need Help?
            </button>
          </div>
        </div>
        <div style={{ height: '58px' }} />
        {/* <VideoPlayerModule
          videoData={splashData.videoData}
        /> */}
        {/* <div style={{ height: '108px' }} /> */}
        {/* <div className="info-block">
          {' '}
          Unlockable Conferences Videos Coming Soon
        </div> */}
        <VideoPlayerView
          productsFromOffer={productsFromOffer}
          primaryColor={primaryColor}
          selectVideo={selectVideo}
          setSelectVideo={setSelectVideo}
          whatSplashPage={whatSplashPage}
        />
        <div style={{ height: '108px' }} />
        <TeamMeet arraySplash={'nftnyc'} />
        <NotCommercialTemplate
          primaryColor={primaryColor}
          NFTName={splashData.NFTName}
        />
      </div>
    </div>
  );
};

export default NFTNYCSplashPage;
