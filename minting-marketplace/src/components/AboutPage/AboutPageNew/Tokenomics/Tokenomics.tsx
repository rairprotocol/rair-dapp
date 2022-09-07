import React from 'react';
import Eth_icon from './../../assets/eth-icon.png';
import Space_icon from './../../assets/space-icon.png';
import Triple_icon from './../../assets/triple-icon.png';
import Matic_icon from './../../assets/matic-icon.png';
import Binance_icon from './../../assets/binance-icon.png';
import Arb_icon from './../../assets/arb-icon.png';
import Kit_icon from './../../assets/kat-icon.png';
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
                  <img src={Matic_icon} alt="Matic" />
                </li>
                <li>
                  <img src={Binance_icon} alt="Binance" />
                </li>
                <li>
                  <img src={Kit_icon} alt="Kit" />
                </li>
              </ul>
            </div>
            <div className="airdrops-items">
              <div className="items-title">Q2 2022</div>
              <ul>
                <li>
                  <img src={Eth_icon} alt="Ethrerium" />
                </li>
                <li>
                  <img src={Arb_icon} alt="Arb" />
                </li>
                <li>
                  <img src={Triple_icon} alt="Triple" />
                </li>
                <li>
                  <img src={Space_icon} alt="Space" />
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
