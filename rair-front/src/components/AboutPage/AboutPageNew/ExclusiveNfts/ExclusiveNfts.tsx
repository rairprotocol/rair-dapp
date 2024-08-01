//@ts-nocheck
import React from 'react';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { MainSelectNft } from './MainSelectNft';
import MobileCarouselNfts from './MobileCarouselNfts';

import { ImageLazy } from '../../../MockUpPage/ImageLazy/ImageLazy';
import {
  CoinAgenda1,
  CoinAgenda2,
  grayManMatrix,
  Monster,
  NutcracherNftPhoto
} from '../../assets/exclusiveNfts/exclusiveNfts';

const ExclusiveNfts = () => {
  return (
    <div className="exclusive-nfts">
      <div className="title-nft">
        <h3>
          View our <span className="change-color-text">projects</span>
        </h3>
      </div>
      <div className="nfts-select">
        <MainSelectNft className="main-nft" NftImage={grayManMatrix}>
          <div className="btn-open-store">
            <a
              href="https://cryptogreyman.com/"
              target={'_blank'}
              rel="noreferrer">
              <span>View drop page</span>{' '}
              <FontAwesomeIcon icon={faArrowRight} />
            </a>
          </div>
        </MainSelectNft>
        <div className="block-nfts">
          <div className="box-nft">
            <ImageLazy
              src={CoinAgenda1}
              alt="Exclusive NFT Coin Agenda Global"
            />
            <ImageLazy src={CoinAgenda2} alt="Exclusive NFT Nutcracher" />
          </div>
          <div className="box-nft">
            <ImageLazy
              src={NutcracherNftPhoto}
              alt="Exclusive NFT Coin Agenda Middle East and Africa"
            />
            <ImageLazy src={Monster} alt="Exclusive NFT Moster" />
          </div>
        </div>
      </div>
      <MobileCarouselNfts>
        <ImageLazy src={grayManMatrix} alt="img" />
        <ImageLazy src={CoinAgenda1} alt="Exclusive NFT Coin Agenda Global" />
        <ImageLazy src={CoinAgenda2} alt="Exclusive NFT Nutcracher" />
        <ImageLazy
          src={NutcracherNftPhoto}
          alt="Exclusive NFT Coin Agenda Middle East and Africa"
        />
        <ImageLazy src={Monster} alt="Exclusive NFT Moster" />
      </MobileCarouselNfts>
    </div>
  );
};

export default ExclusiveNfts;
