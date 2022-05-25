
import React from 'react';
import { NavLink } from 'react-router-dom';
import NftImage from './../../assets/grayman-matrix.png';
import Nft_1 from './../../assets/monster.jpeg';
import Nft_2 from './../../assets/coin-agenda_2.png';
import Nft_3 from './../../assets/nutcracher-nft-photo.png';
import Nft_4 from './../../assets/coin-agenda_1.jpeg';
import MobileCarouselNfts from './MobileCarouselNfts';

const ExclusiveNfts = () => {
    return (
        <div className="exclusive-nfts">
            <div className="title-nft">
                <h3>View our <span className="change-color-text">projects</span></h3>
            </div>
            <div className="nfts-select">
                <div className="main-nft" style={{
                    background: `url(${NftImage}) no-repeat`,
                    backgroundSize: "cover",
                    backgroundPosition: "center center"
                }}>
                    <div className="btn-open-store">
                        <NavLink to="/greyman-splash">
                            <span>View drop page</span> <i className="fas fa-arrow-right"></i>
                        </NavLink>
                    </div>
                </div>
                <div className="block-nfts">
                    <div className="box-nft">
                        <img src={Nft_4} alt="img" />
                        <img src={Nft_2} alt="img" />
                    </div>
                    <div className="box-nft">
                        <img src={Nft_3} alt="img" />
                        <img src={Nft_1} alt="img" />
                    </div>
                </div>
            </div>
            <MobileCarouselNfts>
                <img src={NftImage} alt="img" />
                <img src={Nft_4} alt="img" />
                <img src={Nft_2} alt="img" />
                <img src={Nft_3} alt="img" />
                <img src={Nft_1} alt="img" />
            </MobileCarouselNfts>
        </div>
    )
}

export default ExclusiveNfts
