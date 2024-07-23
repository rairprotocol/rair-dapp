import React from 'react';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import MobileCarouselNfts from '../../../AboutPage/AboutPageNew/ExclusiveNfts/MobileCarouselNfts';
import { ImageLazy } from '../../../MockUpPage/ImageLazy/ImageLazy';
import { INFTImages } from '../../splashPage.types';

import './NFTImages.css';

const NFTImages: React.FC<INFTImages> = ({
  Nft_1,
  Nft_2,
  Nft_3,
  Nft_4,
  NftImage,
  amountTokens,
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
                      Coming Soon <FontAwesomeIcon icon={faArrowRight} />
                    </span>
                  </div>
                  <ImageLazy
                    className="join-pic-main-img"
                    src={NftImage}
                    alt="Exclusive NFT powered by RAIR"
                  />
                </div>
              </div>
              <div className="list-of-greymans-pic">
                <div className="join-pic">
                  <ImageLazy
                    className="join-pic-img"
                    src={Nft_1}
                    alt="Exclusive NFT powered by RAIR"
                  />
                </div>
                <div className="join-pic">
                  <ImageLazy
                    className="join-pic-img"
                    src={Nft_2}
                    alt="Exclusive NFT powered by RAIR"
                  />
                </div>
                <div className="join-pic">
                  <ImageLazy
                    className="join-pic-img"
                    src={Nft_3}
                    alt="Exclusive NFT powered by RAIR"
                  />
                </div>
                <div className="join-pic">
                  <ImageLazy
                    className="join-pic-img"
                    src={Nft_4}
                    alt="Exclusive NFT powered by RAIR"
                  />
                </div>
              </div>
            </>
          </div>
        ) : (
          <>
            <div style={{ width: '100%' }}>
              <MobileCarouselNfts screen={900}>
                <ImageLazy
                  className="join-pic-img"
                  src={NftImage}
                  alt="Exclusive NFT powered by RAIR"
                />
                <ImageLazy
                  className="join-pic-img"
                  src={Nft_4}
                  alt="Exclusive NFT powered by RAIR"
                />
                <ImageLazy
                  className="join-pic-img"
                  src={Nft_3}
                  alt="Exclusive NFT powered by RAIR"
                />
                <ImageLazy
                  className="join-pic-img"
                  src={Nft_2}
                  alt="Exclusive NFT powered by RAIR"
                />
                <ImageLazy
                  className="join-pic-img"
                  src={Nft_1}
                  alt="Exclusive NFT powered by RAIR"
                />
              </MobileCarouselNfts>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default NFTImages;
