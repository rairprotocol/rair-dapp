//@ts-nocheck
import React from 'react';
import './NFTImages.css';
import MobileCarouselNfts from '../../../AboutPage/AboutPageNew/ExclusiveNfts/MobileCarouselNfts';

const NFTImages = ({
  Nft_1,
  Nft_2,
  Nft_3,
  Nft_4,
  NftImage,
  amountTokens,
  // linkComing,
  titleNft,
  colorText,
  carousel,
  noTitle
}) => {
  return (
    <>
      <div className="exclusive-nfts">
        <div className="title-nft">
          {noTitle || (
            <h3>
              Only{' '}
              <span
                className={colorText ? '' : 'text-gradient'}
                style={{ color: `${colorText && colorText}` }}>
                {amountTokens ? amountTokens : 1000}
              </span>{' '}
              {titleNft ? titleNft : 'originals will ever be minted'}
            </h3>
          )}
        </div>
        {carousel ? (
          <div className="main-greyman-pic-wrapper">
            <>
              <div className="main-greyman-pic">
                <div className="join-pic-main">
                  <div className="show-more-wrap">
                    <span className="show-more" style={{ color: '#fff' }}>
                      Coming Soon <i className="fas fa-arrow-right"></i>{' '}
                    </span>
                  </div>
                  <img
                    className="join-pic-main-img"
                    src={NftImage}
                    alt="community-img"
                  />
                </div>
              </div>
              <div className="list-of-greymans-pic">
                <div className="join-pic">
                  <img
                    className="join-pic-img"
                    src={Nft_1}
                    alt="community-img"
                  />
                </div>
                <div className="join-pic">
                  <img
                    className="join-pic-img"
                    src={Nft_2}
                    alt="community-img"
                  />
                </div>
                <div className="join-pic">
                  <img
                    className="join-pic-img"
                    src={Nft_3}
                    alt="community-img"
                  />
                </div>
                <div className="join-pic">
                  <img
                    className="join-pic-img"
                    src={Nft_4}
                    alt="community-img"
                  />
                </div>
              </div>
            </>
          </div>
        ) : (
          <>
            <div style={{ width: '100%' }}>
              <MobileCarouselNfts screen={'900'}>
                <img
                  className="join-pic-img"
                  src={NftImage}
                  alt="community-img"
                />
                <img className="join-pic-img" src={Nft_4} alt="community-img" />
                <img className="join-pic-img" src={Nft_3} alt="community-img" />
                <img className="join-pic-img" src={Nft_2} alt="community-img" />
                <img className="join-pic-img" src={Nft_1} alt="community-img" />
              </MobileCarouselNfts>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default NFTImages;
