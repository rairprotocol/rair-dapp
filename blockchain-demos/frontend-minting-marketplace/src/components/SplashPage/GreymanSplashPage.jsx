import React from 'react';
import { useSelector } from 'react-redux';

import './SplashPage.css';

/* importing images*/
import Metamask from './images/metamask_logo.png';
import GreyMan from './images/greyman.png';


/* importing Components*/
import ExclusiveNft from './ExclusiveNft/ExclusiveNft';
import TeamMeet from './TeamMeet/TeamMeetList';
import TokenLeftGreyman from './TokenLeft/TokenLeftGreyman';
import AuthorBlock from './AuthorBlock/AuthorBlock';

const SplashPage = () => {
    const { primaryColor } = useSelector(store => store.colorStore);

    return (
        <div className="wrapper-splash-page greyman-page">
            <div className="home-splash--page">
                <AuthorBlock mainClass="greyman-page-author">
                    <div className="block-splash">
                        <div className="text-splash">
                            <div className="title-splash greyman-page">
                                <h3>Just another</h3>
                                <h3 className="text-gradient">Greyman</h3>
                            </div>
                            <div className="text-description">
                                <p>
                                    7,907,414,597
                                    not unique NFTs. All metadata is identical only
                                    the serial number is unique. Claim yours for .1 MATIC
                                </p>
                            </div>
                            <div className="btn-buy-metamask">
                                <button><img className="metamask-logo" src={Metamask} alt="metamask-logo" /> Mint with Matic</button>
                            </div>
                        </div>
                    </div>
                </AuthorBlock>
                <TokenLeftGreyman Metamask={Metamask} primaryColor={primaryColor} />
                <ExclusiveNft
                    Nft_1={GreyMan}
                    Nft_2={GreyMan}
                    Nft_3={GreyMan}
                    Nft_4={GreyMan}
                    NftImage={GreyMan}
                    amountTokens={"7,907,414,597"}
                />
                <div className="join-community">
                    <div className="title-join">
                        <h3><span className="text-gradient">Community</span> rewards</h3>
                    </div>
                    <div
                        className="community-description"
                        style={{ background: `${primaryColor === "rhyno" ? "#fff" : "#383637"}` }}
                    >
                        <div className="community-text">
                            <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>
                                Non-exclusive Discord server for all 7.9 Billion Graymen to converse.
                            </p>

                            <div className="btn-buy-metamask">
                                <button><img className="metamask-logo" src={Metamask} alt="metamask-logo" />Join with NFT</button>
                            </div>
                        </div>
                        <div className="join-pic">
                            <img src={GreyMan} alt="community-img" />
                        </div>
                    </div>
                </div>
                <TeamMeet primaryColor={primaryColor} arraySplash={"greyman"} />
            </div>
        </div>
    )
}

export default SplashPage
