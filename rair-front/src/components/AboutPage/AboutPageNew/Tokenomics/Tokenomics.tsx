import React from 'react';

import { MaticLogo } from '../../../../images';
import {
  ArbIcon,
  BinanceIcon,
  EthIcon,
  KitIcon,
  SpaceIcon,
  TrippleIcon
} from '../../assets/tokenomics/tokenomics';
import { ITokenomics } from '../aboutPage.types';

const Tokenomics: React.FC<ITokenomics> = () => {
  return (
    <div className="about-tokenomics">
      <div className="about-tokenomics-title">
        <span className="change-color-text">Tokenomics</span>
      </div>
      <div className="tokenomics-ecosystem">
        <div className="ecosystem-list">
          <div className="ecosystem-list-text">
            RAIR is the fuel that powers the RAIR ecosystem
            <span> Only 10,000,000</span> will ever be minted
          </div>
          <div className="tokenomics-block-list">
            <div className="tokenomics-items">
              <div className="items-title">EVM Airdrops</div>
              <p>
                1 ETH RAIR = 1 EVM RAIR
                <br />
                on snapshot date
              </p>
            </div>
            <div className="tokenomics-items">
              <div className="items-title">Mint NFTs</div>
              <p>
                Deploy ERC721 contracts on any
                <br />
                supported EVM for 15 RAIR
              </p>
            </div>
            <div className="tokenomics-items">
              <div className="items-title">Stake for Membership</div>
              <p>
                Deploy custom storefront requires
                <br />
                staking 1,000 RAIR tokens
              </p>
            </div>
          </div>
        </div>
        <div className="ecosystem-airdrops">
          <div className="ecosystem-airdrops-text">
            RAIR Token holders will receive <span>airdrops</span> for every EVM
            compatible chain we integrate with.
          </div>
          <div className="ecosystem-airdrops-list">
            <div className="airdrops-items">
              <div className="items-title">Q1 2022</div>
              <ul>
                <li>
                  <img src={MaticLogo} alt="Matic" />
                </li>
                <li>
                  <img src={BinanceIcon} alt="Binance" />
                </li>
                <li>
                  <img src={KitIcon} alt="Kit" />
                </li>
              </ul>
            </div>
            <div className="airdrops-items">
              <div className="items-title">Q2 2022</div>
              <ul>
                <li>
                  <img src={EthIcon} alt="Ethrerium" />
                </li>
                <li>
                  <img src={ArbIcon} alt="Arb" />
                </li>
                <li>
                  <img src={TrippleIcon} alt="Triple" />
                </li>
                <li>
                  <img src={SpaceIcon} alt="Space" />
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="block-view-eth-btn">
          <div className="btn-buy-metamask">
            <button>VIEW ON ETHERSCAN</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tokenomics;
