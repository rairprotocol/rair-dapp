import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../SplashPageTemplate/AuthorCard/AuthorCard.css';
import '../../AboutPage/AboutPageNew/AboutPageNew.css';
import './VaporverseSplash.css';
import { v1 } from 'uuid';

/* importing images*/
import {
  vaporverse_background,
  VV0,
  VV1,
  VV2,
  VV3,
  VV4,
  VV_warning_1,
  VV_warning_2,
  VV_test_transmission,
  videoBackground
} from '../images/vaporverse/vaporverse';
import favion_Vaporverse from './../images/favicons/vv_Rair_logo.ico';

/* importing Components*/
import TeamMeet from '../TeamMeet/TeamMeetList';
import AuthorCard from '../SplashPageTemplate/AuthorCard/AuthorCard';
import NotCommercialTemplate from '../NotCommercial/NotCommercialTemplate';
import VideoPlayerModule from '../SplashPageTemplate/VideoPlayer/VideoPlayerModule';
import NFTImages from '../SplashPageTemplate/NFTImages/NFTImages';
import MetaTags from '../../SeoTags/MetaTags';
import ModalHelp from '../SplashPageTemplate/ModalHelp';
import PurchaseChecklist from '../PurchaseChecklist/PurchaseChecklist';
import { setRealChain } from '../../../ducks/contracts/actions';
import {
  IInfoBlock,
  IVaporverseSplashPage,
  TSplashDataType
} from '../splashPage.types';
import { RootState } from '../../../ducks';
import { ColorChoice } from '../../../ducks/colors/colorStore.types';

const splashData: TSplashDataType = {
  title: null,
  titleColor: 'rgb(234,51,127)',
  description: null,
  cardFooter: '/utility drop for OG degens /mintpass to vaporverse',
  seoInformation: {
    title: 'Vaporverse',
    contentName: 'author',
    content: 'Vaporverse',
    description: 'Utility drop for OG degens /mintpass to vaporverse',
    favicon: favion_Vaporverse,
    image: vaporverse_background
  },
  buttonLabel: 'Mint for .1991 Eth',
  buttonBackgroundHelp: undefined,
  backgroundImage: vaporverse_background,
  purchaseButton: undefined,
  button1: {
    buttonColor: 'rgb(234,51,127)',
    buttonLabel: 'premint.xyz',
    buttonImg: null,
    buttonLink: 'https://www.premint.xyz/vaporversexyz/'
  },

  button2: {
    buttonColor: 'rgb(189,52,183)',
    buttonLabel: 'discord',
    buttonImg: null,
    buttonLink: 'https://discord.gg/pSTbf2yz7V'
  },

  button3: {
    buttonColor: 'rgb(189,52,183)',
    buttonLabel: 'twitter',
    buttonImg: null,
    buttonLink: 'https://twitter.com/rairtech'
  },
  videoDataDemo: {
    video: null,
    // 'https://storage.googleapis.com/rair-videos/tx2cV7kzqFXF9lTC5iy1VCYoXBwonyG-HcjunEI5j1rqfX/2596768157',
    videoTitle: '',
    videoModuleDescription: null,
    videoModuleTitle: 'loading...',
    baseURL: 'https://staging.rair.market/stream/',
    mediaId: '9zG0NPK0DXRpCzMQeZ2y6yQYfpDMDJS-Pc1WSewRUaspE9'
    // demo: true
  },
  videoData: {
    video: null,
    videoTitle: '',
    videoModuleDescription: null,
    videoModuleTitle: 'loading...',
    baseURL: 'https://staging.rair.market/stream/',
    mediaId: 'tx2cV7kzqFXF9lTC5iy1VCYoXBwonyG-HcjunEI5j1rqfX'
  },
  tilesTitle: null,
  NFTName: 'NFT'
};

const InfoBlock: React.FC<IInfoBlock> = ({
  infoArray,
  style,
  subclass,
  children
}) => {
  return (
    <div style={style} className={`info-block ${subclass ? subclass : ''}`}>
      {infoArray?.map((info: string) => {
        return <div key={v1()}>{info}</div>;
      })}
      {children && children}
    </div>
  );
};

const VaporverseSplashPage: React.FC<IVaporverseSplashPage> = ({
  connectUserData,
  setIsSplashPage
}) => {
  const [openCheckList, setOpenCheckList] = useState<boolean>(false);
  const primaryColor = useSelector<RootState, ColorChoice>(
    (store) => store.colorStore.primaryColor
  );
  const carousel_match = window.matchMedia('(min-width: 630px)');
  const [carousel, setCarousel] = useState(carousel_match.matches);
  const [purchaseList, setPurchaseList] = useState(true);
  const chainId = '0x1';
  const dispatch = useDispatch();

  const togglePurchaseList = () => {
    setPurchaseList((prev) => !prev);
  };

  useEffect(() => {
    window.addEventListener('resize', () =>
      setCarousel(carousel_match.matches)
    );
    return () =>
      window.removeEventListener('resize', () =>
        setCarousel(carousel_match.matches)
      );
  }, [carousel_match.matches]);

  const toggleCheckList = () => {
    setOpenCheckList((prev) => !prev);
  };

  // const getAllProduct = useCallback(async () => {
  //   if (loginDone) {
  //     if (currentChain === splashData.purchaseButton.requiredBlockchain) {
  //       setSoldCopies((await minterInstance.getOfferRangeInfo(...splashData.purchaseButton.offerIndex)).tokensAllowed.toString());
  //     } else {
  //       setSoldCopies();
  //     }
  //   }

  // }, [setSoldCopies, loginDone, currentChain, minterInstance]);

  // useEffect(() => {
  //   getAllProduct()
  // }, [getAllProduct])

  useEffect(() => {
    dispatch(setRealChain(chainId));
  }, [dispatch]);

  useEffect(() => {
    setIsSplashPage(true);
  }, [setIsSplashPage]);

  return (
    <div className="wrapper-splash-page vaporverse">
      <MetaTags seoMetaTags={splashData.seoInformation} />
      <div className="template-home-splash-page">
        <ModalHelp
          openCheckList={openCheckList}
          purchaseList={purchaseList}
          togglePurchaseList={togglePurchaseList}
          toggleCheckList={toggleCheckList}
          backgroundColor={{
            darkTheme: 'rgb(189,52,183)',
            lightTheme: 'rgb(189,52,183)'
          }}
        />
        <AuthorCard {...{ splashData, connectUserData, toggleCheckList }} />
        <PurchaseChecklist
          toggleCheckList={toggleCheckList}
          openCheckList={openCheckList}
          nameSplash={'VaporVerse'}
          backgroundColor={{
            darkTheme: 'rgb(3, 91, 188)',
            lightTheme: 'rgb(3, 91, 188)'
          }}
        />

        <div style={{ height: '5vw' }} />

        <div style={{ display: 'flex', width: '100%' }}>
          <div
            style={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
            <InfoBlock
              subclass="info-block-col"
              infoArray={[
                'must own',
                '/heavencomputer',
                '/bastardganpunksv1/v2',
                '/glitchpixx'
              ]}>
              <div style={{ color: 'RGB(189,52,182)' }} key={v1()}>
                ---Discord4FullList---
              </div>
            </InfoBlock>

            <div
              style={{
                height: '12px',
                width: '100%',
                backgroundColor: 'RGB(198,212,131)'
              }}></div>
          </div>

          <div
            style={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
            <InfoBlock
              subclass="info-block-col"
              infoArray={[
                '',
                '/snapshot date 8/19/2022',
                '/1:1 polygon claim token',
                '/convert to ETH @ ETH2.0 launch 2 save treees'
              ]}
            />
            <div
              style={{
                height: '12px',
                width: '100%',
                backgroundColor: 'white'
              }}></div>
          </div>
        </div>

        <div style={{ height: '3vw' }} />

        <InfoBlock
          infoArray={[
            'mkdir vap0rverse',
            'rmdir vaporverse',
            '//N0stalgia. A permutation. A remix. Warm feelings. The click of high heels on smooth tile.',
            '//Whispers. Whitelist on aisle 8. Tag 3 frens 4 brainchip pass. Give your grankids +80 dopamine for life.',
            '//All is claim. Claim your pass. NO BOOMER PUNKS',
            'time 2 go 2 skool...'
          ]}
        />

        <div style={{ height: '5vw' }} />
        <div className={'vaporverse-images-container'}>
          <img src={VV_warning_2} className={'vaporverse-images'} />
          <img src={VV_warning_1} className={'vaporverse-images'} />
        </div>

        <InfoBlock
          infoArray={[
            '//transmission failed??',
            'goto metamask',
            'goto opensea',
            'goto looksrare',
            '//buy supported degens',
            'loading....'
          ]}
        />

        <div style={{ height: '5vw' }} />

        <VideoPlayerModule
          backgroundImage={VV_test_transmission}
          videoData={splashData.videoDataDemo}
        />

        <div style={{ height: '7vw' }} />

        <InfoBlock
          infoArray={['//join lore', '//moar streaming vapor', 'awaits....']}
        />

        <VideoPlayerModule
          backgroundImage={videoBackground}
          videoData={splashData.videoData}
        />
        <NFTImages
          NftImage={VV0}
          Nft_1={VV1}
          Nft_2={VV2}
          Nft_3={VV3}
          Nft_4={VV4}
          noTitle={true}
          carousel={carousel}
        />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="vv_footer1"> RAIR tokens later </div>
          <br />
          <div className="vv_footer2"> !NO BOOMER PUNKS! </div>
        </div>

        <div style={{ height: '10vw' }} />

        <TeamMeet arraySplash={'vaporverse'} />
        <NotCommercialTemplate
          primaryColor={primaryColor}
          NFTName={splashData.NFTName}
        />
      </div>
    </div>
  );
};

export default VaporverseSplashPage;
