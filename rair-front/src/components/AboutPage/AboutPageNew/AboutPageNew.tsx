import { FC, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Hex } from 'viem';

import useConnectUser from '../../../hooks/useConnectUser';
import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxHooks';
import useSwal from '../../../hooks/useSwal';
import { metaMaskIcon, RairLogoBlue } from '../../../images';
import { setSEOInfo } from '../../../redux/seoSlice';
import { SplashPageProps } from '../../../types/commonTypes';
import PurchaseTokenButton from '../../common/PurchaseToken';
import { rairAdvisorsTeam, teamAboutRair } from '../../MainPage/AboutUsTeam';
import MetaTags from '../../SeoTags/MetaTags';
import TeamMeet from '../../SplashPage/TeamMeet/TeamMeetList';

import setDocumentTitle from './../../../utils/setTitle';
import CompareAbout from './CompareAbout/CompareAbout';
import ExclusiveNfts from './ExclusiveNfts/ExclusiveNfts';
import LeftTokenAbout from './LeftTokenAbout/LeftTokenAbout';
import MainBlock from './MainBlock/MainBlock';
import PlatformAbout from './PlatformAbout/PlatformAbout';
import RairOffer from './RairOffer/RairOffer';
import RoadMap from './RoadMapAbout/RoadMapAbout';
import StreamsAbout from './StreamsAbout/StreamsAbout';

import './AboutPageNew.css';

const AboutPageNew: FC<SplashPageProps> = ({ setIsSplashPage }) => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const seo = useAppSelector((store) => store.seo);
  const { primaryColor } = useAppSelector((store) => store.colors);
  const rSwal = useSwal();

  const connectUserData = useConnectUser();

  useEffect(() => {
    dispatch(setSEOInfo());
  }, [dispatch]);

  const termsText =
    'I understand this a test NFT designed to unlock RAIR streams';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setDocumentTitle('About Page');
  }, []);

  useEffect(() => {
    setIsSplashPage(true);
  }, [setIsSplashPage]);

  const switchToNetwork: Hex = '0x38';
  const aboutPageAddress: Hex = '0xb6163454da87e9f3fd63683c5d476f7d067f75a2';
  const offerIndexInMarketplace = '1';

  const purchaseButton = (
    <PurchaseTokenButton
      {...{
        customWrapperClassName: 'btn-buy-metamask',
        img: metaMaskIcon,
        contractAddress: aboutPageAddress,
        requiredBlockchain: switchToNetwork,
        offerIndex: [offerIndexInMarketplace],
        connectUserData,
        buttonLabel: 'Closed Beta Now Live',
        presaleMessage: termsText,
        diamond: true,
        customSuccessAction: (nextToken) =>
          rSwal.fire('Success', `You own token #${nextToken}!`, 'success')
      }}
    />
  );

  return (
    <>
      <div className="wrapper-about-page">
        <MetaTags seoMetaTags={seo} />
        <div className="home-about--page">
          <MainBlock
            RairLogo={RairLogoBlue}
            Metamask={metaMaskIcon}
            termsText={termsText}
            purchaseButton={purchaseButton}
          />
          <LeftTokenAbout />
          <PlatformAbout />
          <RairOffer />
          <ExclusiveNfts />
          <StreamsAbout
            Metamask={metaMaskIcon}
            primaryColor={primaryColor}
            purchaseButton={purchaseButton}
          />
          {/* <Tokenomics Metamask={Metamask} /> */}
          <RoadMap />
          <CompareAbout />
          <div className="about-page--team">
            <TeamMeet
              arraySplash={'rair'}
              titleHeadFirst={'Meet the'}
              titleHeadSecond={'Team'}
              classNameHeadSpan={'text-gradient'}
              teamArray={teamAboutRair}
              classNameGap={true}
            />
          </div>
          <div className="about-page--team">
            <TeamMeet
              arraySplash={'rair-advisors'}
              titleHeadFirst={'Meet the'}
              titleHeadSecond={'Advisors'}
              classNameHeadSpan={'text-gradient'}
              teamArray={rairAdvisorsTeam}
              classNameGap={true}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPageNew;
