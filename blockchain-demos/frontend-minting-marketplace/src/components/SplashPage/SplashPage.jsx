import React from 'react';

import './SplashPage.css';

/* importing images*/
import logoAuthor from './images/nispsey-hussle.png';
import Nft_1 from './images/special-offer_1.jpeg';
import Nft_2 from './images/special-offer_3.jpeg';
import Nft_3 from './images/img-left-tokens.jpeg';
import NftImage from './images/nft-img.jpeg';

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
            <div className="left-tokens">
                <div className="block-left-tokens">

                </div>
                <div className="left-tokens-content">
                    <div className="title-tokens">
                        <h3>Sold <span className="text-gradient">1000 copies</span> for<br /> $100 in 2013</h3>
                    </div>
                    <div className="tokens-description">
                        <p>
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                            dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                            proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                            dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                            proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                            dolore eu fugiat nulla pariatur. Excepteur sint occaecat.
                        </p>
                    </div>
                    <div className="btn-buy-metamask">
                        <button>Buy with Metamask</button>
                    </div>
                </div>
            </div>
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
            <div className="exclusive-nfts">
                <div className="title-nft">
                    <h3>Explore <span className="text-gradient">1000</span> exclusive NFTs</h3>
                </div>
                <div className="nfts-select">
                    <div className="main-nft" style={{
                        background: `url(${NftImage}) no-repeat`,
                        backgroundSize: "cover"
                    }}>
                        <div className="btn-open-store">
                            <span>Open in Store</span> <i class="fas fa-arrow-right"></i>
                        </div>
                    </div>
                    <div className="block-nfts">
                        <div className="box-nft">
                            <img src={Nft_3} alt="img" />
                            <img src={Nft_1} alt="img" />
                        </div>
                        <div className="box-nft">
                            <img src={Nft_1} alt="img" />
                            <img src={Nft_2} alt="img" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="unlockble-video">
                <div className="title-gets">
                    <h3>What <span className="text-gradient">you</span> get?</h3>
                </div>
            </div>
        </div>
    )
}

export default SplashPage
