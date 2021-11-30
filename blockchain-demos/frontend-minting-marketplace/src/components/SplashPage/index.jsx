import React from 'react';
import { useSelector } from 'react-redux';

import './SplashPage.css';

/* importing images*/
import Metamask from './images/metamask_logo.png';
import logoAuthor from './images/colab.png';
import Nft_1 from './images/exclusive_1.jpeg';
import Nft_2 from './images/exclusive_2.jpeg';
import Nft_3 from './images/exclusive_3.jpeg';
import Nft_4 from './images/image_3.png';
import NftImage from './images/circle_nipsey.png';
import UnlockableVideo from './images/unlockbleVideo.png';
import JoinCommunity from './images/join_com.jpeg';


/* importing Components*/
import TokenLeft from './TokenLeft/TokenLeft';
import ExclusiveNft from './ExclusiveNft/ExclusiveNft';
import UnlockVideos from './UnlockVideos/UnlockVideos';
import TeamMeet from './TeamMeet/TeamMeetList';
import JoinCom from './JoinCom/JoinCom';

const SplashPage = () => {
    const { primaryColor } = useSelector(store => store.colorStore);

    return (
        <div className="wrapper-splash-page">
            <div className="home-splash--page">
                <div className="information-author">
                    <div className="block-splash">
                        <div className="text-splash">
                            <div className="title-splash">
                                <h3>Enter the</h3>
                                <span>Nipseyverse</span>
                            </div>
                            <div className="text-description">
                                <p>
                                    1000 Unique NFTs unlock exlusive streaming for the final
                                    Nipsey Hussle album. Proceeds directly benefit the Airmiess
                                    Asghedom estate on chain.
                                </p>
                            </div>
                            <div className="btn-buy-metamask">
                                <button><img className="metamask-logo" src={Metamask} alt="metamask-logo" /> Preorder with ETH</button>
                            </div>
                            <div className="logo-author">
                                {/* <img src={logoDigital} alt="southwest digital" /> */}
                                <img src={logoAuthor} alt="logo-author" />
                            </div>
                        </div>
                    </div>
                </div>
                <TokenLeft primaryColor={primaryColor} />
                <div className="special-offer">
                    <div className="offer-desp">
                        <div className="offer-title">
                            <h3><span className="text-gradient">Proud</span> to pay</h3>
                        </div>

                        <div className="text-offer">
                            <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>
                                Nipsey invented Proud to Pay, a movement adopted and expanded by the NFT
                                community. Your NFT is access and ownership in an eclusive community of
                                like minded fans, artists, and industry veterans.
                            </p>
                            <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>
                                Now is your opportunity to own a unique piece of internet history.
                                Mint today and receive unique streaming NFT artwork at launch.
                            </p>
                        </div>
                        <div className="btn-buy-metamask">
                            <button><img className="metamask-logo" src={Metamask} alt="metamask-logo" /> Preorder with ETH</button>
                        </div>
                    </div>
                    <div className="offer-fans">
                        <div className="offer-1"></div>
                        <div className="offer-2"></div>
                        <div className="offer-3"></div>
                    </div>
                </div>
                <ExclusiveNft
                    Nft_1={Nft_1}
                    Nft_2={Nft_2}
                    Nft_3={Nft_3}
                    Nft_4={Nft_4}
                    NftImage={NftImage}
                    amountTokens={1000}
                />
                <UnlockVideos
                    primaryColor={primaryColor}
                    UnlockableVideo={UnlockableVideo}
                />
                <JoinCom
                    Metamask={Metamask}
                    JoinCommunity={JoinCommunity}
                    primaryColor={primaryColor}
                />
                <TeamMeet primaryColor={primaryColor} arraySplash={"nipsey"} />
            </div>
        </div>
    )
}

export default SplashPage
