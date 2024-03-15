//@ts-nocheck
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import { teamRAIRBasicArray } from './AboutUsTeam';

import { TNftFilesResponse } from '../../../axios.responseTypes';
import { RootState } from '../../../ducks';
import { setInfoSEO } from '../../../ducks/seo/actions';
import { TInfoSeo } from '../../../ducks/seo/seo.types';
import { useOpenVideoPlayer } from '../../../hooks/useOpenVideoPlayer';
import useSwal from '../../../hooks/useSwal';
import { useSplashData } from '../../../utils/infoSplashData/rairGenesis';
import { TEmbeddedParams, TModeType } from '../../MockUpPage/mockupPage.types';
import { NftDataCommonLink } from '../../MockUpPage/NftList/NftData/NftDataCommonLink';
import MetaTags from '../../SeoTags/MetaTags';
import NFTNYC_favicon from '../images/favicons/NFTNYX_TITLE.ico';
import { Genesis_TV, GenesisMember } from '../images/rairGenesis/rairGenesis';
import NotCommercialTemplate2 from '../NotCommercial-2/NotCommercialTemplate-2';
import { INumberedCircle, ISplashPageProps } from '../splashPage.types';
import SplashCardButton from '../SplashPageConfig/CardBlock/CardButton/SplashCardButton';
import { handleReactSwal } from '../SplashPageConfig/utils/reactSwalModal';
import UnlockableVideosWrapper from '../SplashPageConfig/VideoBlock/UnlockableVideosWrapper/UnlockableVideosWrapper';
import SplashVideoWrapper from '../SplashPageConfig/VideoBlock/VideoBlockWrapper/SplashVideoWrapper';
import SplashVideoTextBlock from '../SplashPageConfig/VideoBlock/VideoTextBlock/SplashVideoTextBlock';
import AuthorCard from '../SplashPageTemplate/AuthorCard/AuthorCard';
import ModalHelp from '../SplashPageTemplate/ModalHelp';
/* importing Components*/
import TeamMeet from '../TeamMeet/TeamMeetList';

import '../SplashPageTemplate/AuthorCard/AuthorCard.css';
import '../../AboutPage/AboutPageNew/AboutPageNew.css';
import './RAIRGenesis.css';
// Google Analytics
//const TRACKING_ID = 'UA-209450870-5'; // YOUR_OWN_TRACKING_ID
//ReactGA.initialize(TRACKING_ID);

const NumberedCircle: React.FC<INumberedCircle> = ({ index, primaryColor }) => {
  return (
    <div
      className="numbered-circle"
      style={{ color: `${primaryColor === 'rhyno' ? '#000000' : '#FFFFFF'}` }}>
      {index}
    </div>
  );
};

const RAIRGenesisSplashPage: React.FC<ISplashPageProps> = ({
  connectUserData
}) => {
  const dispatch = useDispatch();
  const seo = useSelector<RootState, TInfoSeo>((store) => store.seoStore);
  const { splashData } = useSplashData(connectUserData);
  const primaryColor = useSelector<RootState, string>(
    (store) => store.colorStore.primaryColor
  );
  const reactSwal = useSwal();
  const [openVideoplayer, setOpenVideoPlayer, handlePlayerClick] =
    useOpenVideoPlayer();

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

  useEffect(() => {
    dispatch(
      setInfoSEO({
        title: 'RAIR Genesis Pass',
        ogTitle: 'RAIR Genesis Pass',
        twitterTitle: 'RAIR Genesis Pass',
        contentName: 'author',
        content: 'RAIR Genesis Pass',
        description:
          'Claim your NFT to unlock encrypted streams from the NFTLA conference',
        ogDescription:
          'Claim your NFT to unlock encrypted streams from the NFTLA conference',
        twitterDescription:
          'Claim your NFT to unlock encrypted streams from the NFTLA conference',
        image: Genesis_TV,
        favicon: NFTNYC_favicon,
        faviconMobile: NFTNYC_favicon
      })
    );
    //eslint-disable-next-line
  }, []);

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
  }, [splashData]);

  useEffect(() => {
    getProductsFromOffer();
  }, [getProductsFromOffer]);

  const whatSplashPage = 'genesis-font';
  /**** */

  return (
    <div className="wrapper-splash-page genesis">
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
        <div style={{ height: '32px' }} />
        <SplashVideoWrapper>
          <SplashVideoTextBlock>
            <h1 className="splashpage-subtitle">
              <div style={{ color: '#AA82d5' }}>Streaming &nbsp;</div>
              <div>Player</div>
            </h1>
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

        <h1 className="splashpage-subtitle" style={{ marginTop: '150px' }}>
          <div>Marketplace &nbsp;</div>
          <div style={{ color: '#ee82d5' }}>Demo</div>
        </h1>
        <NftDataCommonLink embeddedParams={embeddedParams} />
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
            alt="Genesis Member"
          />
        </div>
        <h1
          className="splashpage-subtitle"
          style={{ marginTop: '150px', marginBottom: '16px' }}>
          {' '}
          About{' '}
        </h1>
        <TeamMeet
          primaryColor={primaryColor}
          arraySplash={'rair-basic-2'}
          teamArray={teamRAIRBasicArray}
        />
        <NotCommercialTemplate2
          primaryColor={primaryColor}
          NFTName={splashData.NFTName}
        />
      </div>
    </div>
  );
};

export default RAIRGenesisSplashPage;
