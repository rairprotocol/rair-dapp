import React from 'react';

import './SplashPage.css';

/* importing images*/
import logoAuthor from './images/nispsey-hussle.png';
import Nft_1 from './images/special-offer_1.jpeg';
import Nft_2 from './images/special-offer_3.jpeg';
import Nft_3 from './images/img-left-tokens.jpeg';
import NftImage from './images/nft-img.jpeg';
import UnlockableVideo from './images/unlockbleVideo.png';
import Teammate_1 from './images/teammate_1.png';
import Teammate_2 from './images/teammate_2.png';
import JoinCommunity from './images/community.png';
import TokenLeft from './TokenLeft/TokenLeft';
import ExclusiveNft from './ExclusiveNft/ExclusiveNft';
import UnlockVideos from './UnlockVideos/UnlockVideos';
import TeamMeet from './TeamMeet/TeamMeet';
import JoinCom from './JoinCom/JoinCom';

const SplashPage = () => {
    return (
        <div className="home-splash--page">
            <div className="information-author">
                <div className="block-splash">
                    <div className="logo-author">
                        <img src={logoAuthor} alt="logo-author" />
                    </div>
                    <div className="text-splash">
                        <div className="title-splash">
                            <h3>Welcome to</h3>
                            <span className="text-gradient">the Nipseyverse</span>
                        </div>
                        <div className="text-description">
                            <p>
                                Duis aute irure dolor in reprehenderit in voluptate velit
                                esse cillum dolore eu fugiat nulla pariatur. Excepteur
                                sint occaecat cupidatat non proident, sunt in culpa
                                qui officia deserunt mollit anim id est laborum.
                            </p>
                        </div>
                        <div className="btn-buy-metamask">
                            <button>Buy with Metamask</button>
                        </div>
                    </div>
                </div>
                {/* <div className="block-splash-img">
                    <div className="shadow-box" />
                    <img src={pictureSplash} alt="splash" />
                </div> */}
            </div>
            <TokenLeft />
            <div className="special-offer">
                <div className="offer-desp">
                    <div className="offer-title">
                        <h3>Special <span className="text-gradient">offer</span> for fans</h3>
                    </div>

                    <div className="text-offer">
                        <p>
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                            dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                            proident, sunt in culpa qui officia deserunt mollit anim id est
                            laborum. Duis aute irure dolor in reprehenderit in voluptate velit esse
                            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                            non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                            dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                            proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.
                        </p>
                    </div>
                </div>
                <div className="offer-fans">
                    <div className="offer-1"></div>
                    <div className="offer-2"></div>
                    <div className="offer-3"></div>
                </div>
            </div>
            <ExclusiveNft Nft_1={Nft_1} Nft_2={Nft_2} Nft_3={Nft_3} NftImage={NftImage}  />
            <UnlockVideos UnlockableVideo={UnlockableVideo} />
            <TeamMeet Teammate_1={Teammate_1} Teammate_2={Teammate_2} />
           <JoinCom JoinCommunity={JoinCommunity} />
        </div>
    )
}

export default SplashPage
