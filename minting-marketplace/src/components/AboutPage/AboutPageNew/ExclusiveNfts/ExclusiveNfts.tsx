//@ts-nocheck
import React from 'react';
import NftImage from './../../assets/grayman-matrix.png';
import Nft_1 from './../../assets/monster.jpeg';
import Nft_2 from './../../assets/coin-agenda_2.png';
import Nft_3 from './../../assets/nutcracher-nft-photo.png';
import Nft_4 from './../../assets/coin-agenda_1.jpeg';
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
        <MainSelectNft className="main-nft" NftImage={NftImage}>
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
            <img src={Nft_4} alt="Exclusive NFT Coin Agenda Global" />
            <img src={Nft_2} alt="Exclusive NFT Nutcracher" />
          </div>
          <div className="box-nft">
            <img
              src={Nft_3}
              alt="Exclusive NFT Coin Agenda Middle East and Africa"
            />
            <img src={Nft_1} alt="Exclusive NFT Moster" />
          </div>
        </div>
      </div>
      <MobileCarouselNfts>
        <img src={NftImage} alt="img" />
        <img src={Nft_4} alt="Exclusive NFT Coin Agenda Global" />
        <img src={Nft_2} alt="Exclusive NFT Nutcracher" />
        <img
          src={Nft_3}
          alt="Exclusive NFT Coin Agenda Middle East and Africa"
        />
        <img src={Nft_1} alt="Exclusive NFT Moster" />
      </MobileCarouselNfts>
    </div>
  );
};

export default ExclusiveNfts;
