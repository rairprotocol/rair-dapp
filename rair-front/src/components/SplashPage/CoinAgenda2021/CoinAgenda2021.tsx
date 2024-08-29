import { FC, useEffect, useState } from 'react';

import { teamCoinAgendaArray } from './AboutUsTeam';

import { useOpenVideoPlayer } from '../../../hooks/useOpenVideoPlayer';
import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxHooks';
import useSwal from '../../../hooks/useSwal';
import { setSEOInfo } from '../../../redux/seoSlice';
import { setRequestedChain } from '../../../redux/web3Slice';
import { SplashPageProps } from '../../../types/commonTypes';
import { splashData } from '../../../utils/infoSplashData/coicAgenda2021';
import MetaTags from '../../SeoTags/MetaTags';
import NotCommercialTemplate from '../NotCommercial/NotCommercialTemplate';
import SplashCardButton from '../SplashPageConfig/CardBlock/CardButton/SplashCardButton';
import { handleReactSwal } from '../SplashPageConfig/utils/reactSwalModal';
import UnlockableVideosWrapper from '../SplashPageConfig/VideoBlock/UnlockableVideosWrapper/UnlockableVideosWrapper';
import SplashVideoWrapper from '../SplashPageConfig/VideoBlock/VideoBlockWrapper/SplashVideoWrapper';
import SplashVideoTextBlock from '../SplashPageConfig/VideoBlock/VideoTextBlock/SplashVideoTextBlock';
import { useGetProducts } from '../splashPageProductsHook';
import AuthorCardButton from '../SplashPageTemplate/AuthorCard/AuthorCardButton';
import ModalHelp from '../SplashPageTemplate/ModalHelp';
/* importing Components*/
import TeamMeet from '../TeamMeet/TeamMeetList';

/* importing Components*/
import favicon_CoinAgenda21 from './../images/favicons/coinagenda.ico';

import '../SplashPageTemplate/AuthorCard/AuthorCard.css';
import '../../AboutPage/AboutPageNew/AboutPageNew.css';
import './CoinAgenda2021.css';

const CoinAgenda2021SplashPage: FC<SplashPageProps> = ({ setIsSplashPage }) => {
  const dispatch = useAppDispatch();
  const seo = useAppSelector((store) => store.seo);
  const [openVideoplayer, setOpenVideoPlayer, handlePlayerClick] =
    useOpenVideoPlayer();

  const reactSwal = useSwal();

  useEffect(() => {
    dispatch(
      setSEOInfo({
        title: 'CoinAGENDA 2021',
        ogTitle: 'CoinAGENDA 2021',
        twitterTitle: 'CoinAGENDA 2021',
        contentName: 'author',
        content: '',
        description: 'BEST OF COINAGENDA 2021',
        ogDescription: 'BEST OF COINAGENDA 2021',
        twitterDescription: 'BEST OF COINAGENDA 2021',
        image: `${
          import.meta.env.VITE_IPFS_GATEWAY
        }/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW`,
        favicon: favicon_CoinAgenda21,
        faviconMobile: favicon_CoinAgenda21
      })
    );
  }, []);

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
    dispatch(setRequestedChain(ukraineglitchChainId));
  }, [dispatch]);

  const togglePurchaseList = () => {
    setPurchaseList((prev) => !prev);
  };

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
        <SplashVideoWrapper>
          <div className="splashpage-title">BEST OF COINAGENDA 2021</div>
          <SplashVideoTextBlock>
            <div className="splashpage-description">
              Check out some of the featured content from the CoinAgenda 2021
              series in Dubai, Monaco, Las Vegas and Puerto Rico.
            </div>
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
        <div className="coinagenda-button-container">
          <AuthorCardButton buttonData={splashData.button1} />
          <AuthorCardButton buttonData={splashData.button2} />
        </div>
        <TeamMeet arraySplash={'coinagenda'} teamArray={teamCoinAgendaArray} />
        <NotCommercialTemplate NFTName={splashData.NFTName} />
      </div>
    </div>
  );
};

export default CoinAgenda2021SplashPage;
