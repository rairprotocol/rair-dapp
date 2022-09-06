//@ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../SplashPageTemplate/AuthorCard/AuthorCard.css';
import '../../AboutPage/AboutPageNew/AboutPageNew.css';
import './RAIRGenesis.css';

import warning1 from '../images/warning_1.png';
import warning2 from '../images/warning_2.png';

import MetaMaskIcon from '../images/metamask_logo.png';
import Genesis_TV from '../images/TV-RAIR-StandardColor-0.gif';
import NFTNYC_favicon from '../images/favicons/NFTNYX_TITLE.ico';
import GenesisMember from '../images/creator-flow.png';
/* importing Components*/
import TeamMeet from '../TeamMeet/TeamMeetList';
import AuthorCard from '../SplashPageTemplate/AuthorCard/AuthorCard';
import { NftDataCommonLink } from '../../MockUpPage/NftList/NftData/NftDataCommonLink';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ModalHelp from '../SplashPageTemplate/ModalHelp';
import VideoPlayerView from '../../MockUpPage/NftList/NftData/UnlockablesPage/VideoPlayerView';

import axios from 'axios';
import MetaTags from '../../SeoTags/MetaTags';
import NotCommercialTemplate2 from '../NotCommercial-2/NotCommercialTemplate-2';
import { RootState } from '../../../ducks';
import { INumberedCircle, IRAIRGenesisSplashPage } from '../splashPage.types';
import { TEmbeddedParams, TModeType } from '../../MockUpPage/mockupPage.types';
import { ColorChoice } from '../../../ducks/colors/colorStore.types';
// Google Analytics
//const TRACKING_ID = 'UA-209450870-5'; // YOUR_OWN_TRACKING_ID
//ReactGA.initialize(TRACKING_ID);

const reactSwal = withReactContent(Swal);

const WarningModal = () => {
  return (
    <div className="main-wrapper-nyc">
      <div className="bad">
        <h3>Bad don&#8219;t sign</h3>
        <img src={warning1} alt="Bad don&#8219;t sign" />
      </div>
      <div className="good">
        <h3>Good safe to sign</h3>
        <img src={warning2} alt="Good safe to sign" />
      </div>
    </div>
  );
};

const NumberedCircle: React.FC<INumberedCircle> = ({ index, primaryColor }) => {
  return (
    <div
      className="numbered-circle"
      style={{ color: `${primaryColor === 'rhyno' ? '#000000' : '#FFFFFF'}` }}>
      {index}
    </div>
  );
};

const RAIRGenesisSplashPage: React.FC<IRAIRGenesisSplashPage> = ({
  connectUserData
}) => {
  const currentUserAddress = useSelector<RootState, string | undefined>(
    (store) => store.contractStore.currentUserAddress
  );
  const splashData = {
    NFTName: 'Genesis Pass artwork',
    title: 'RAIR Genesis Pass',
    titleColor: '#000000',
    description: 'The future of streaming. 222 spots. 222m RAIR tokens',
    textDescriptionCustomStyles: connectUserData
      ? { paddingTop: '3vw' }
      : undefined,
    seoInformation: {
      title: 'RAIR Genesis Pass',
      contentName: 'author',
      content: 'RAIR Genesis Pass',
      description:
        'Claim your NFT to unlock encrypted streams from the NFTLA conference',
      favicon: NFTNYC_favicon,
      image: Genesis_TV
    },
    videoPlayerParams: {
      contract: '0x09926100eeab8ca2d636d0d77d1ccef323631a73',
      product: '0',
      blockchain: '0x5'
    },
    marketplaceDemoParams: {
      contract: '0x09926100eeab8ca2d636d0d77d1ccef323631a73',
      product: '0',
      blockchain: '0x5'
    },
    purchaseButton: {
      requiredBlockchain: '0x38',
      contractAddress: '0x03041d4fd727eae0337529e11287f6b499d48a4f'
    },
    /*  this block needs to be changed */
    buttonLabel: 'Connect Wallet',
    buttonBackgroundHelp: 'rgb(3, 91, 188)',
    backgroundImage: Genesis_TV,
    button1: currentUserAddress === undefined && {
      buttonLabel: 'Connect wallet',
      buttonImg: MetaMaskIcon,
      buttonAction: connectUserData
    },
    button2: {
      buttonMarginTop: currentUserAddress === undefined ? 0 : '2vw',
      buttonMarginBottom: currentUserAddress === undefined ? 0 : '6vw',
      buttonBorder: '3px solid #77B9F3',
      buttonTextColor: '#000000',
      buttonColor: '#FFFFFF',
      buttonLabel: 'View on Opensea',
      buttonImg: null,
      buttonLink: 'https://opensea.io/collection/swagnftnyc'
    },
    exclusiveNft: {
      title: 'NFTs',
      titleColor: 'rgb(3, 91, 188)'
    }
  };

  const primaryColor = useSelector<RootState, ColorChoice>(
    (store) => store.colorStore.primaryColor
  );

  /* UTILITIES FOR MARKETPLACE DEMO */
  const [mode, setMode] = useState<TModeType>('collection');
  const [tokenId, setTokenId] = useState<string>('0');

  const embeddedParams: TEmbeddedParams = {
    ...splashData.marketplaceDemoParams,
    mode: mode,
    setMode: setMode,
    tokenId: tokenId,
    setTokenId: setTokenId
  };

  /* UTILITIES FOR NFT PURCHASE */
  const [openCheckList /*setOpenCheckList*/] = useState<boolean>(false);
  const [purchaseList, setPurchaseList] = useState<boolean>(true);
  const ukraineglitchChainId = '0x1';
  const dispatch = useDispatch();

  const togglePurchaseList = () => {
    setPurchaseList((prev) => !prev);
  };

  useEffect(() => {
    dispatch({ type: 'SET_REAL_CHAIN', payload: ukraineglitchChainId });
    //eslint-disable-next-line
  }, []);

  /* UTILITIES FOR VIDEO PLAYER VIEW */
  const [productsFromOffer, setProductsFromOffer] = useState([]);
  const [selectVideo, setSelectVideo] = useState();

  const getProductsFromOffer = useCallback(async () => {
    const response = await axios.get<TNftFilesResponse>(
      `/api/nft/network/${splashData.marketplaceDemoParams.blockchain}/${splashData.marketplaceDemoParams.contract}/${splashData.marketplaceDemoParams.product}/files`
    );
    setProductsFromOffer(response.data.files);
    setSelectVideo(response.data.files[0]);
  }, []);

  useEffect(() => {
    getProductsFromOffer();
  }, [getProductsFromOffer]);

  const whatSplashPage = 'genesis-font';
  /**** */

  return (
    <div className="wrapper-splash-page genesis">
      <MetaTags seoMetaTags={splashData.seoInformation} />
      <div className="template-home-splash-page">
        <ModalHelp
          openCheckList={openCheckList}
          purchaseList={purchaseList}
          togglePurchaseList={togglePurchaseList}
          // toggleCheckList={toggleCheckList}
          backgroundColor={{
            darkTheme: 'rgb(3, 91, 188)',
            lightTheme: 'rgb(3, 91, 188)'
          }}
        />
        <AuthorCard {...{ splashData, connectUserData, whatSplashPage }} />
        <div style={{ height: '32px' }} />
        <div className="btn-submit-with-form need-help">
          <button
            className="genesis-font"
            onClick={() =>
              reactSwal.fire({
                title:
                  'Watch out for sign requests that look like this. There are now gasless attack vectors that can set permissions to drain your wallet',
                html: <WarningModal />,
                customClass: {
                  popup: `bg-${primaryColor} genesis-radius genesis-resp `,
                  title: 'text-genesis'
                },
                showConfirmButton: false
              })
            }>
            Need Help?
          </button>
        </div>
        <h1 className="splashpage-subtitle">
          <div style={{ color: '#AA82d5' }}>Streaming &nbsp;</div>
          <div>Player</div>
        </h1>
        <VideoPlayerView
          productsFromOffer={productsFromOffer}
          primaryColor={primaryColor}
          selectVideo={selectVideo}
          setSelectVideo={setSelectVideo}
          whatSplashPage={whatSplashPage}
        />
        <h1 className="splashpage-subtitle" style={{ marginTop: '150px' }}>
          <div>Marketplace &nbsp;</div>
          <div style={{ color: '#ee82d5' }}>Demo</div>
        </h1>
        <NftDataCommonLink
          userData={connectUserData}
          embeddedParams={embeddedParams}
        />
        <h1 className="splashpage-subtitle" style={{ marginTop: '150px' }}>
          {' '}
          <div> Membership </div>
        </h1>
        <div className="membership-block">
          <div className="membership-block-text">
            {[
              'Genesis holders use our tools first',
              'Mint NFTs + manage metadata + onchain royalties',
              'Add video to any 0x NFT',
              'Embeddable player'
            ].map((row, i) => (
              <div key={i} className="membership-block-text-row">
                <NumberedCircle index={i} primaryColor={primaryColor} />
                <div>&nbsp;</div>
                <p style={{ width: '70%' }}>{row}</p>
              </div>
            ))}
          </div>
          <img
            className="membership-block-image"
            style={{
              borderRadius: '16px',
              border: '4px solid #BB73D7',
              boxShadow: '4px -4px #8C63DA'
            }}
            src={GenesisMember}
          />
        </div>
        <h1
          className="splashpage-subtitle"
          style={{ marginTop: '150px', marginBottom: '16px' }}>
          {' '}
          About{' '}
        </h1>
        <TeamMeet primaryColor={primaryColor} arraySplash={'rair-basic-2'} />
        <NotCommercialTemplate2
          primaryColor={primaryColor}
          NFTName={splashData.NFTName}
        />
      </div>
    </div>
  );
};

export default RAIRGenesisSplashPage;
