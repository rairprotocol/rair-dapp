import { FC, useEffect, useState } from 'react';
import { v1 } from 'uuid';

import { teamVaporVerseArray } from './AboutUsTeam';

import useConnectUser from '../../../hooks/useConnectUser';
import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxHooks';
import { setSEOInfo } from '../../../redux/seoSlice';
import { setRequestedChain } from '../../../redux/web3Slice';
import { SplashPageProps } from '../../../types/commonTypes';
import { splashData } from '../../../utils/infoSplashData/vapoverseSplashPage';
import { ImageLazy } from '../../MockUpPage/ImageLazy/ImageLazy';
import MetaTags from '../../SeoTags/MetaTags';
/* importing images*/
import {
  vaporverse_background,
  videoBackground,
  VV_test_transmission,
  VV_warning_1,
  VV_warning_2,
  VV0,
  VV1,
  VV2,
  VV3,
  VV4
} from '../images/vaporverse/vaporverse';
import NotCommercialTemplate from '../NotCommercial/NotCommercialTemplate';
import PurchaseChecklist from '../PurchaseChecklist/PurchaseChecklist';
import { IInfoBlock } from '../splashPage.types';
import AuthorCard from '../SplashPageTemplate/AuthorCard/AuthorCard';
import ModalHelp from '../SplashPageTemplate/ModalHelp';
import NFTImages from '../SplashPageTemplate/NFTImages/NFTImages';
import VideoPlayerModule from '../SplashPageTemplate/VideoPlayer/VideoPlayerModule';
/* importing Components*/
import TeamMeet from '../TeamMeet/TeamMeetList';

import favion_Vaporverse from './../images/favicons/vv_Rair_logo.ico';

import '../SplashPageTemplate/AuthorCard/AuthorCard.css';
import '../../AboutPage/AboutPageNew/AboutPageNew.css';
import './VaporverseSplash.css';

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

const VaporverseSplashPage: FC<SplashPageProps> = ({ setIsSplashPage }) => {
  const dispatch = useAppDispatch();
  const seo = useAppSelector((store) => store.seo);
  const [openCheckList, setOpenCheckList] = useState<boolean>(false);
  const { connectUserData } = useConnectUser();
  const carousel_match = window.matchMedia('(min-width: 630px)');
  const [carousel, setCarousel] = useState(carousel_match.matches);
  const [purchaseList, setPurchaseList] = useState(true);
  const chainId = '0x1';

  const togglePurchaseList = () => {
    setPurchaseList((prev) => !prev);
  };

  useEffect(() => {
    dispatch(
      setSEOInfo({
        title: 'Vaporverse',
        ogTitle: 'Vaporverse',
        twitterTitle: 'Vaporverse',
        contentName: 'author',
        content: 'Vaporverse',
        description: 'Utility drop for OG degens /mintpass to vaporverse',
        ogDescription: 'Utility drop for OG degens /mintpass to vaporverse',
        twitterDescription:
          'Utility drop for OG degens /mintpass to vaporverse',
        image: vaporverse_background,
        favicon: favion_Vaporverse,
        faviconMobile: favion_Vaporverse
      })
    );
    //eslint-disable-next-line
  }, []);

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
  //   if (loggedIn) {
  //     if (connectedChain === splashData.purchaseButton.requiredBlockchain) {
  //       setSoldCopies((await minterInstance.getOfferRangeInfo(...splashData.purchaseButton.offerIndex)).tokensAllowed.toString());
  //     } else {
  //       setSoldCopies();
  //     }
  //   }

  // }, [setSoldCopies, loggedIn, connectedChain, minterInstance]);

  // useEffect(() => {
  //   getAllProduct()
  // }, [getAllProduct])

  useEffect(() => {
    dispatch(setRequestedChain(chainId));
  }, [dispatch]);

  useEffect(() => {
    setIsSplashPage(true);
  }, [setIsSplashPage]);

  return (
    <div className="wrapper-splash-page vaporverse">
      <MetaTags seoMetaTags={seo} />
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
          <ImageLazy
            alt="Metamask Signature Request Rair Inc. Success"
            src={VV_warning_2}
            className={'vaporverse-images'}
          />
          <ImageLazy
            alt="Metamask Approvement request Rair Inc. Incorrect"
            src={VV_warning_1}
            className={'vaporverse-images'}
          />
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

        <TeamMeet
          arraySplash={'vaporverse'}
          titleHeadFirst={'mak0r'}
          teamArray={teamVaporVerseArray}
        />
        <NotCommercialTemplate NFTName={splashData.NFTName} />
      </div>
    </div>
  );
};

export default VaporverseSplashPage;
