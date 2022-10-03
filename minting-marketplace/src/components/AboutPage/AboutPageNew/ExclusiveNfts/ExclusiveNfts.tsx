//@ts-nocheck
import React from 'react';
import {
  grayManMatrix,
  CoinAgenda1,
  CoinAgenda2,
  Monster,
  NutcracherNftPhoto
} from '../../assets/exclusiveNfts/exclusiveNfts';
import MobileCarouselNfts from './MobileCarouselNfts';
import { MainSelectNft } from './MainSelectNft';

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
              <span>View drop page</span> <i className="fas fa-arrow-right"></i>
            </a>
          </div>
        </MainSelectNft>
        <div className="block-nfts">
          <div className="box-nft">
            <img src={CoinAgenda1} alt="Exclusive NFT Coin Agenda Global" />
            <img src={CoinAgenda2} alt="Exclusive NFT Nutcracher" />
          </div>
          <div className="box-nft">
            <img
              src={NutcracherNftPhoto}
              alt="Exclusive NFT Coin Agenda Middle East and Africa"
            />
            <img src={Monster} alt="Exclusive NFT Moster" />
          </div>
        </div>
      </div>
      <MobileCarouselNfts>
        <img src={grayManMatrix} alt="img" />
        <img src={CoinAgenda1} alt="Exclusive NFT Coin Agenda Global" />
        <img src={CoinAgenda2} alt="Exclusive NFT Nutcracher" />
        <img
          src={NutcracherNftPhoto}
          alt="Exclusive NFT Coin Agenda Middle East and Africa"
        />
        <img src={Monster} alt="Exclusive NFT Moster" />
      </MobileCarouselNfts>
    </div>
  );
};

export default ExclusiveNfts;
