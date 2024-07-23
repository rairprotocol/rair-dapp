import React from 'react';
import { NavLink } from 'react-router-dom';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ImageLazy } from '../../MockUpPage/ImageLazy/ImageLazy';
import { IExclusiveNft } from '../splashPage.types';

const ExclusiveNft: React.FC<IExclusiveNft> = ({
  Nft_1,
  Nft_2,
  Nft_3,
  Nft_4,
  NftImage,
  amountTokens,
  linkComing,
  titleNft,
  colorText
}) => {
  return (
    <div className="exclusive-nfts">
      <div className="title-nft">
        <h3>
          Only{' '}
          <span
            className={colorText ? '' : 'text-gradient'}
            style={{ color: `${colorText && colorText}` }}>
            {amountTokens ? amountTokens : 1000}
          </span>{' '}
          {titleNft ? titleNft : 'originals will ever be minted'}
        </h3>
      </div>
      <div className="nfts-select">
        <div
          className="main-nft"
          style={{
            background: `url(${NftImage}) no-repeat`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center'
          }}>
          <div className="btn-open-store">
            <NavLink to={linkComing}>
              {' '}
              <span>Open in Store</span> <FontAwesomeIcon icon={faArrowRight} />
            </NavLink>
          </div>
        </div>
        <div className="block-nfts">
          <div className="box-nft">
            <ImageLazy src={Nft_4} alt="Exclusive NFT powered by Rair Tech" />
            <ImageLazy src={Nft_2} alt="Exclusive NFT powered by Rair Tech" />
          </div>
          <div className="box-nft">
            <ImageLazy src={Nft_3} alt="Exclusive NFT powered by Rair Tech" />
            <ImageLazy src={Nft_1} alt="Exclusive NFT powered by Rair Tech" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExclusiveNft;
