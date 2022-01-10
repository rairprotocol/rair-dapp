import React from 'react';
import NftImage from './../../assets/greymanNew.png';
import Nft_1 from './../../assets/exclusive_1.jpeg';
import Nft_2 from './../../assets/exclusive_2.jpeg';
import Nft_3 from './../../assets/exclusive_3.jpeg';
import Nft_4 from './../../assets/greyman.png';

const ExclusiveNfts = () => {
    return (
        <div className="exclusive-nfts">
            <div className="title-nft">
                <h3>View our <span className="change-color-text">projects</span></h3>
            </div>
            <div className="nfts-select">
                <div className="main-nft" style={{
                    background: `url(${NftImage}) no-repeat`,
                    backgroundSize: "contain",
                    backgroundPosition: "center center"
                }}>
                    <div className="btn-open-store">
                        <span>Open in Store</span> <i className="fas fa-arrow-right"></i>
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
        </div>
    )
}

export default ExclusiveNfts
