import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../SplashPageTemplate/AuthorCard/AuthorCard.css';
import '../../AboutPage/AboutPageNew/AboutPageNew.css';
import './CoinAgenda2021.css';

/* importing Components*/
import TeamMeet from '../TeamMeet/TeamMeetList';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ModalHelp from '../SplashPageTemplate/ModalHelp';
import VideoPlayerView from '../../MockUpPage/NftList/NftData/UnlockablesPage/VideoPlayerView';

import MetaTags from '../../SeoTags/MetaTags';
import NotCommercialTemplate from '../NotCommercial/NotCommercialTemplate';
import AuthorCardButton from '../SplashPageTemplate/AuthorCard/AuthorCardButton';
import WarningModal from '../WarningModal';
import { ISplashPageProps, TSplashDataType } from '../splashPage.types';
import { setRealChain } from '../../../ducks/contracts/actions';
import { RootState } from '../../../ducks';
import { ColorChoice } from '../../../ducks/colors/colorStore.types';
import { useGetProducts } from '../splashPageProductsHook';

const reactSwal = withReactContent(Swal);

const CoinAgenda2021SplashPage: React.FC<ISplashPageProps> = ({
  setIsSplashPage
}) => {
  const splashData: TSplashDataType = {
    seoInformation: {
      title: 'CoinAGENDA 2021',
      contentName: 'author',
      content: 'CoinAGENDA 2021'
    },
    NFTName: '#coinagenda NFT',
    videoPlayerParams: {
      contract: '0x551213286900193ff3882a3f3d0441aadd32d42d',
      product: '0',
      blockchain: '0x89'
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

  const primaryColor = useSelector<RootState, ColorChoice>(
    (store) => store.colorStore.primaryColor
  );

  /* UTILITIES FOR VIDEO PLAYER VIEW */
  const [productsFromOffer, selectVideo, setSelectVideo] =
    useGetProducts(splashData);

  /* UTILITIES FOR NFT PURCHASE */
  const [openCheckList /*setOpenCheckList*/] = useState<boolean>(false);
  const [purchaseList, setPurchaseList] = useState<boolean>(true);
  const ukraineglitchChainId = '0x1';
  const dispatch = useDispatch();

  // this conditionally hides the search bar in header
  useEffect(() => {
    setIsSplashPage?.(true);
  }, [setIsSplashPage]);

  useEffect(() => {
    dispatch(setRealChain(ukraineglitchChainId));
    //eslint-disable-next-line
  }, []);

  const togglePurchaseList = () => {
    setPurchaseList((prev) => !prev);
  };

  const whatSplashPage = 'genesis-font';

  return (
    <div className="wrapper-splash-page coinagenda">
      <MetaTags seoMetaTags={splashData.seoInformation} />
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
        <TeamMeet arraySplash={'coinagenda'} />
        <NotCommercialTemplate
          primaryColor={primaryColor}
          NFTName={splashData.NFTName}
        />
      </div>
    </div>
  );
};

export default CoinAgenda2021SplashPage;
