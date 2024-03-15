import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import { teamSimDogsArray } from './AboutUsTeam';
import { BackStorySimDogs } from './InformationText';

import { TFileType, TNftFilesResponse } from '../../../axios.responseTypes';
import RairFavicon from '../../../components/MockUpPage/assets/rair_favicon.ico';
import { RootState } from '../../../ducks';
import { setRealChain } from '../../../ducks/contracts/actions';
import { setInfoSEO } from '../../../ducks/seo/actions';
import { TInfoSeo } from '../../../ducks/seo/seo.types';
import useConnectUser from '../../../hooks/useConnectUser';
import { useOpenVideoPlayer } from '../../../hooks/useOpenVideoPlayer';
import useSwal from '../../../hooks/useSwal';
import {
  donationGridData,
  splashData
} from '../../../utils/infoSplashData/simDogs';
import MetaTags from '../../SeoTags/MetaTags';
import { SimDogs0 } from '../images/simDogs/simDogs';
import NotCommercialTemplate from '../NotCommercial/NotCommercialTemplate';
import { ICustomButtonBlock, ISplashPageProps } from '../splashPage.types';
import SplashCardButton from '../SplashPageConfig/CardBlock/CardButton/SplashCardButton';
import CardParagraphText from '../SplashPageConfig/CardParagraphText/CardParagraphText';
import { handleReactSwal } from '../SplashPageConfig/utils/reactSwalModal';
import UnlockableVideosWrapper from '../SplashPageConfig/VideoBlock/UnlockableVideosWrapper/UnlockableVideosWrapper';
import SplashVideoWrapper from '../SplashPageConfig/VideoBlock/VideoBlockWrapper/SplashVideoWrapper';
import SplashVideoText from '../SplashPageConfig/VideoBlock/VideoText/SplashVideoText';
import SplashVideoTextBlock from '../SplashPageConfig/VideoBlock/VideoTextBlock/SplashVideoTextBlock';
/* importing Components*/
import AuthorCard from '../SplashPageTemplate/AuthorCard/AuthorCard';
import AuthorCardButton from '../SplashPageTemplate/AuthorCard/AuthorCardButton';
import DonationGrid from '../SplashPageTemplate/DonationSquares/DonationGrid';
import ModalHelp from '../SplashPageTemplate/ModalHelp';
/* importing Components*/
import TeamMeet from '../TeamMeet/TeamMeetList';

/* importing Components*/
import favion_SimDogs from './../images/favicons/favicon-simdogs.ico';

import '../SplashPageTemplate/AuthorCard/AuthorCard.css';
import '../../AboutPage/AboutPageNew/AboutPageNew.css';
import './SimDogs.css';
import '../SplashPageTemplate/AuthorCard/AuthorCard.css';
// Google Analytics
//const TRACKING_ID = 'UA-209450870-5'; // YOUR_OWN_TRACKING_ID
//ReactGA.initialize(TRACKING_ID);

const SimDogsSplashPage: React.FC<ISplashPageProps> = ({ setIsSplashPage }) => {
  const dispatch = useDispatch();
  const seo = useSelector<RootState, TInfoSeo>((store) => store.seoStore);
  const reactSwal = useSwal();
  /* UTILITIES FOR NFT PURCHASE */
  /* UTILITIES FOR VIDEO PLAYER VIEW */
  const [productsFromOffer, setProductsFromOffer] = useState<TFileType[]>([]);
  const [selectVideo, setSelectVideo] = useState<TFileType>();
  const [openVideoplayer, setOpenVideoPlayer, handlePlayerClick] =
    useOpenVideoPlayer();

  const mainChain = '0x1';

  const { connectUserData } = useConnectUser();

  useEffect(() => {
    dispatch(
      setInfoSEO({
        title: 'Sim Dogs',
        ogTitle: 'Sim Dogs',
        twitterTitle: 'Sim Dogs',
        contentName: 'author',
        content: '',
        description: 'BUY A DOG, WIN A LAWSUIT & END SIM SWAP CRIME!',
        ogDescription: 'BUY A DOG, WIN A LAWSUIT & END SIM SWAP CRIME!',
        twitterDescription: 'BUY A DOG, WIN A LAWSUIT & END SIM SWAP CRIME!',
        image: SimDogs0,
        favicon: RairFavicon,
        faviconMobile: RairFavicon
      })
    );
    //eslint-disable-next-line
  }, []);

  //an option for custom button arrangment

  const getProductsFromOffer = useCallback(async () => {
    const response = await axios.get<TNftFilesResponse>(
      `/api/nft/network/0x1/0xA5A823294AF53B983969BB48cAA3cDb28545828F/0/files`
    );
    setProductsFromOffer(response.data.files);
    setSelectVideo(response.data.files[0]);
  }, []);

  //an option for custom button arrangment
  const CustomButtonBlock: React.FC<ICustomButtonBlock> = ({ splashData }) => {
    const { button1, button2, button3 } = splashData;
    return (
      <div className="button-wrapper">
        <div className="button-row-0">
          <AuthorCardButton buttonData={button1} whatSplashPage={'col-0'} />
          <AuthorCardButton buttonData={button2} whatSplashPage={'col-1'} />
        </div>
        <div className="button-row-1">
          <AuthorCardButton buttonData={button3} whatSplashPage={''} />
        </div>
      </div>
    );
  };

  const customButtonBlock = <CustomButtonBlock splashData={splashData} />;

  const primaryColor = useSelector<RootState, string>(
    (store) => store.colorStore.primaryColor
  );

  /* UTILITIES FOR NFT PURCHASE */
  const [openCheckList /*setOpenCheckList*/] = useState<boolean>(false);
  const [purchaseList, setPurchaseList] = useState<boolean>(true);

  const togglePurchaseList = () => {
    setPurchaseList((prev) => !prev);
  };

  useEffect(() => {
    dispatch(
      setInfoSEO({
        title: 'Sim Dogs',
        ogTitle: 'Sim Dogs',
        twitterTitle: 'Sim Dogs',
        contentName: 'author',
        content: '',
        description: 'BUY A DOG, WIN A LAWSUIT & END SIM SWAP CRIME!',
        ogDescription: 'BUY A DOG, WIN A LAWSUIT & END SIM SWAP CRIME!',
        twitterDescription: 'BUY A DOG, WIN A LAWSUIT & END SIM SWAP CRIME!',
        image: SimDogs0,
        favicon: favion_SimDogs,
        faviconMobile: favion_SimDogs
      })
    );
  }, [dispatch]);

  useEffect(() => {
    getProductsFromOffer();
  }, [getProductsFromOffer]);

  useEffect(() => {
    setIsSplashPage?.(true);
  }, [setIsSplashPage]);

  useEffect(() => {
    dispatch(setRealChain(mainChain));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="wrapper-splash-page simdogs">
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
        <AuthorCard
          {...{
            splashData,
            connectUserData,
            customButtonBlock
          }}
        />
        <div className="btn-submit-with-form need-help">
          {/* <button
            className="genesis-font"
            onClick={() =>
              reactSwal.fire({
                title:
                  'Watch out for sign requests that look like this. There are now gasless attack vectors that can set permissions to drain your wallet',
                html: (
                  <WarningModal
                    className="simdogs"
                    bad="bad-simdogs"
                    good="good-simdogs"
                  />
                ),
                customClass: {
                  popup: `bg-${primaryColor} genesis-radius simdog-resp `,
                  title: 'text-simdogs'
                },
                showConfirmButton: false
              })
            }>
            Need Help
          </button> */}
        </div>
        <DonationGrid donationGridArray={donationGridData} />
        {productsFromOffer && productsFromOffer.length > 0 && (
          <SplashVideoWrapper>
            <SplashVideoTextBlock>
              <SplashVideoText
                className="video-text-kohler"
                text={'SUPPORTER ONLY CONTENT'}
              />
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
              primaryColor={primaryColor}
            />
          </SplashVideoWrapper>
        )}
        <CardParagraphText
          fontFamilyTitle={`'Acme', sans-serif`}
          fontWeight={'900'}
          fontAlign={'left'}
          arrayParagragh={BackStorySimDogs}
          title={'BACKSTORY'}
        />
        <TeamMeet
          titleHeadFirst="TEAM"
          classNameHead="splashpage-subtitle above-meet-team"
          arraySplash={'sim-dogs'}
          teamArray={teamSimDogsArray}
        />
        <NotCommercialTemplate primaryColor={primaryColor} NFTName={'NFT'} />
      </div>
    </div>
  );
};

export default SimDogsSplashPage;
