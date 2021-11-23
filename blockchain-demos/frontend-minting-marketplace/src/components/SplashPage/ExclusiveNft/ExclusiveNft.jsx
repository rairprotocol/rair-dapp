import React from 'react';

const ExclusiveNft = ({Nft_1, Nft_2, Nft_3, Nft_4, NftImage, amountTokens}) => {
    return (
        <div className="exclusive-nfts">
                <div className="title-nft">
                    <h3>Only <span className="text-gradient">{amountTokens}</span> NFTs will ever be minted</h3>
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

export default ExclusiveNft
