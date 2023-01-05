import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { teamCoinAgendaArray } from './AboutUsTeam';

import { RootState } from '../../../ducks';
import { ColorChoice } from '../../../ducks/colors/colorStore.types';
import { setRealChain } from '../../../ducks/contracts/actions';
import { setInfoSEO } from '../../../ducks/seo/actions';
import { TInfoSeo } from '../../../ducks/seo/seo.types';
import { splashData } from '../../../utils/infoSplashData/coicAgenda2021';
import { reactSwal } from '../../../utils/reactSwal';
import VideoPlayerView from '../../MockUpPage/NftList/NftData/UnlockablesPage/VideoPlayerView';
import MetaTags from '../../SeoTags/MetaTags';
import NotCommercialTemplate from '../NotCommercial/NotCommercialTemplate';
import { ISplashPageProps } from '../splashPage.types';
import { useGetProducts } from '../splashPageProductsHook';
import AuthorCardButton from '../SplashPageTemplate/AuthorCard/AuthorCardButton';
import ModalHelp from '../SplashPageTemplate/ModalHelp';
/* importing Components*/
import TeamMeet from '../TeamMeet/TeamMeetList';
/* importing Components*/
import WarningModal from '../WarningModal/WarningModal';

import favicon_CoinAgenda21 from './../images/favicons/coinagenda.ico';

import '../SplashPageTemplate/AuthorCard/AuthorCard.css';
import '../../AboutPage/AboutPageNew/AboutPageNew.css';
import './CoinAgenda2021.css';

const CoinAgenda2021SplashPage: React.FC<ISplashPageProps> = ({
  setIsSplashPage
}) => {
  const dispatch = useDispatch();
  const seo = useSelector<RootState, TInfoSeo>((store) => store.seoStore);

  useEffect(() => {
    dispatch(
      setInfoSEO({
        title: 'CoinAGENDA 2021',
        ogTitle: 'CoinAGENDA 2021',
        twitterTitle: 'CoinAGENDA 2021',
        contentName: 'author',
        content: '',
        description: 'BEST OF COINAGENDA 2021',
        ogDescription: 'BEST OF COINAGENDA 2021',
        twitterDescription: 'BEST OF COINAGENDA 2021',
        image:
          'https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW',
        favicon: favicon_CoinAgenda21,
        faviconMobile: favicon_CoinAgenda21
      })
    );
    //eslint-disable-next-line
  }, []);

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
        <TeamMeet arraySplash={'coinagenda'} teamArray={teamCoinAgendaArray} />
        <NotCommercialTemplate
          primaryColor={primaryColor}
          NFTName={splashData.NFTName}
        />
      </div>
    </div>
  );
};

export default CoinAgenda2021SplashPage;
