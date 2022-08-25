//@ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../SplashPageTemplate/AuthorCard/AuthorCard.css';
import '../../AboutPage/AboutPageNew/AboutPageNew.css';
import './CoinAgenda2021.css';

import warning1 from '../images/warning_1.png';
import warning2 from '../images/warning_2.png';

/* importing Components*/
import TeamMeet from '../TeamMeet/TeamMeetList';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ModalHelp from '../SplashPageTemplate/ModalHelp';
import VideoPlayerView from '../../MockUpPage/NftList/NftData/UnlockablesPage/VideoPlayerView';

import axios from 'axios';
import MetaTags from '../../SeoTags/MetaTags';
import NotCommercialTemplate from '../NotCommercial/NotCommercialTemplate';
import AuthorCardButton from '../SplashPageTemplate/AuthorCard/AuthorCardButton';

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

const CoinAgenda2021SplashPage = ({ connectUserData, setIsSplashPage }) => {
  const { currentUserAddress } = useSelector((store) => store.contractStore);
  const splashData = {
    seoInformation: {
      title: 'CoinAGENDA 2021',
      contentName: 'author',
      content: 'CoinAGENDA 2021',
      description: null,
      favicon: null,
      image: null
    },
    NFTName: '#coinagenda NFT',
    videoPlayerParams: {
      contract: '0x551213286900193ff3882a3f3d0441aadd32d42d',
      product: '0',
      blockchain: '0x61'
    },
    button2: {
      buttonTextColor: '#FFFFFF',
      buttonColor: '#f69220',
      buttonLabel: 'REGISTER FOR GLOBAL',
      buttonImg: null,
      buttonLink:
        'https://www.eventbrite.com/e/coinagenda-global-2022-feat-bitangels-tickets-297407703447'
    },
    button1: {
      buttonTextColor: '#FFFFFF',
      buttonColor: '#f69220',
      buttonLabel: 'VIEW ON OPENSEA',
      buttonImg: null,
      buttonLink: 'https://opensea.io/collection/coinagenda'
    }
  };

  const { primaryColor } = useSelector((store) => store.colorStore);

  // this conditionally hides the search bar in header
  useEffect(() => {
    setIsSplashPage(true);
  }, [setIsSplashPage]);

  /* UTILITIES FOR NFT PURCHASE */
  const [openCheckList /*setOpenCheckList*/] = useState(false);
  const [purchaseList, setPurchaseList] = useState(true);
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
      `/api/nft/network/${splashData.videoPlayerParams.blockchain}/${splashData.videoPlayerParams.contract}/${splashData.videoPlayerParams.product}/files`
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
    <div className="wrapper-splash-page coinagenda">
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
        <div className="splashpage-title">BEST OF COINAGENDA 2021</div>
        <div className="splashpage-description">
          Check out some of the featured content from the CoinAgenda 2021 series
          in Dubai, Monaco, Las Vegas and Puerto Rico.
        </div>
        <VideoPlayerView
          productsFromOffer={productsFromOffer}
          primaryColor={primaryColor}
          selectVideo={selectVideo}
          setSelectVideo={setSelectVideo}
          whatSplashPage={whatSplashPage}
        />
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
        <div className="coinagenda-button-container">
          <AuthorCardButton buttonData={splashData.button1} />
          <AuthorCardButton buttonData={splashData.button2} />
        </div>
        <TeamMeet primaryColor={primaryColor} arraySplash={'coinagenda'} />
        <NotCommercialTemplate
          primaryColor={primaryColor}
          NFTName={splashData.NFTName}
        />
      </div>
    </div>
  );
};

export default CoinAgenda2021SplashPage;
