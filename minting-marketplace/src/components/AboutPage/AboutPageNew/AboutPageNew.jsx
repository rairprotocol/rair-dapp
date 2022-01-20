import React from 'react';
import './AboutPageNew.css';

// imports images
import RairLogo from '../assets/rairLogo_blue.png';
import Metamask from '../assets/metamask_logo.png';

// imports component 
import MainBlock from './MainBlock/MainBlock';
import LeftTokenAbout from './LeftTokenAbout/LeftTokenAbout';
import PlatformAbout from './PlatformAbout/PlatformAbout';
import RairOffer from './RairOffer/RairOffer';
import ExclusiveNfts from './ExclusiveNfts/ExclusiveNfts';
import StreamsAbout from './StreamsAbout/StreamsAbout';
import Tokenomics from './Tokenomics/Tokenomics';
import RoadMap from './RoadMapAbout/RoadMapAbout';
import CompareAbout from './CompareAbout/CompareAbout';
import TeamMeet from '../../SplashPage/TeamMeet/TeamMeetList';

const AboutPageNew = ({ primaryColor }) => {

    return (
        <div className="wrapper-about-page">
            <div className="home-about--page">
                <MainBlock RairLogo={RairLogo} Metamask={Metamask} />
                <LeftTokenAbout primaryColor={primaryColor} />
                <PlatformAbout />
                <RairOffer />
                <ExclusiveNfts />
                <StreamsAbout Metamask={Metamask} primaryColor={primaryColor} />
                <Tokenomics Metamask={Metamask} />
                <RoadMap RairLogo={RairLogo} />
                <CompareAbout />
                <div className="about-page--team">
                    <TeamMeet primaryColor={primaryColor} arraySplash={"rair"} />
                </div>
                <div className="about-page--team">
                    <TeamMeet primaryColor={primaryColor} arraySplash={"rair-advisors"} />
                </div>
            </div>
        </div >
    )
}

export default AboutPageNew
