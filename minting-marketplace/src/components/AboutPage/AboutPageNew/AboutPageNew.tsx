import React, { useEffect } from 'react';
import './AboutPageNew.css';

// import images
import RairLogo from '../assets/rairLogo_blue.png';
import Metamask from '../assets/metamask_logo.png';

//import utils
import setDocumentTitle from './../../../utils/setTitle';

// import component
import MainBlock from './MainBlock/MainBlock';
import LeftTokenAbout from './LeftTokenAbout/LeftTokenAbout';
import PlatformAbout from './PlatformAbout/PlatformAbout';
import RairOffer from './RairOffer/RairOffer';
import ExclusiveNfts from './ExclusiveNfts/ExclusiveNfts';
import StreamsAbout from './StreamsAbout/StreamsAbout';
import RoadMap from './RoadMapAbout/RoadMapAbout';
import CompareAbout from './CompareAbout/CompareAbout';
import TeamMeet from '../../SplashPage/TeamMeet/TeamMeetList';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import PurchaseTokenButton from '../../common/PurchaseToken';
import { IAboutPageNew } from './aboutPage.types';
import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';

const AboutPageNew: React.FC<IAboutPageNew> = ({
  connectUserData,
  setIsSplashPage
}) => {
  const { pathname } = useLocation();
  const { primaryColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

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

  const switchToNetwork = '0x38';
  const aboutPageAddress =
    '0xb6163454da87e9f3fd63683c5d476f7d067f75a2'.toLowerCase();
  const offerIndexInMarketplace = 1;

  const purchaseButton = (
    <PurchaseTokenButton
      {...{
        customStyle: {},
        customWrapperClassName: 'btn-buy-metamask',
        img: Metamask,
        contractAddress: aboutPageAddress,
        requiredBlockchain: switchToNetwork,
        offerIndex: [offerIndexInMarketplace],
        connectUserData,
        buttonLabel: 'Test our Streaming',
        presaleMessage: termsText,
        diamond: true,
        customSuccessAction: (nextToken) =>
          Swal.fire('Success', `You own token #${nextToken}!`, 'success')
      }}
    />
  );

  return (
    <>
      <div className="wrapper-about-page">
        <div className="home-about--page">
          <MainBlock
            connectUserData={connectUserData}
            RairLogo={RairLogo}
            primaryColor={primaryColor}
            Metamask={Metamask}
            termsText={termsText}
            purchaseButton={purchaseButton}
          />
          <LeftTokenAbout primaryColor={primaryColor} />
          <PlatformAbout />
          <RairOffer primaryColor={primaryColor} />
          <ExclusiveNfts />
          <StreamsAbout
            Metamask={Metamask}
            primaryColor={primaryColor}
            purchaseButton={purchaseButton}
          />
          {/* <Tokenomics Metamask={Metamask} /> */}
          <RoadMap primaryColor={primaryColor} RairLogo={RairLogo} />
          <CompareAbout />
          <div className="about-page--team">
            <TeamMeet arraySplash={'rair'} />
          </div>
          <div className="about-page--team">
            <TeamMeet arraySplash={'rair-advisors'} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPageNew;
