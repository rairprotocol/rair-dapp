import React from 'react';

import MailchimpComponent from './MailchimpComponent';

import { INipseyRelease } from '../splashPage.types';

const NipseyRelease: React.FC<INipseyRelease> = ({ DiscordIcon }) => {
  return (
    <div className="nipsey-release">
      <div className="release-container">
        <div className="tabs-box">
          <div className="tab-title-box">Founders Tier</div>
          <div className="tab-text-box">
            <p>:0-49</p>
            <p>Airdrops</p>
          </div>
        </div>
        <div className="tabs-box">
          <div className="tab-title-box">Pressing 1</div>
          <div className="tab-text-box">
            <p>:50-250</p>
            <p>1 ETH</p>
          </div>
        </div>
        <div className="tabs-box">
          <div className="tab-title-box">Pressing 2</div>
          <div className="tab-text-box">
            <p>:251-500</p>
            <p>2 ETH</p>
          </div>
        </div>
        <div className="tabs-box">
          <div className="tab-title-box">Pressing 3</div>
          <div className="tab-text-box">
            <p>:501-999</p>
            <p>3 ETH</p>
          </div>
        </div>
      </div>
      <div className="release-container">
        <div className="release-container-title">Release</div>
        <div className="release-desc-nipsey">
          <div className="release-desc-nipsey-box">
            All royalties are onchain, with resales royalties set at 20%. All
            1000 NFTs will receive equal access to the exclusive final Nipsey
            album. Rarities are distributed at random. Unique attributes are
            hand-painted & uniquely generated.
          </div>
          <div className="release-desc-nipsey-box">
            Founders tiers is reserved for Nipsey collaborators and production
            team. Fair use initial distribution. All pricing is pre-programmed
            into the smart contract. Hold your NFT to receive exclusive future
            drops.
          </div>
        </div>
        <div className="release-artwork-desc">
          <div className="release-artwork-desc-title">
            Want to see the tracklist & artwork before anyone else?
          </div>
          <div className="release-artwork-desc-text">
            Sign up for our newsletter, then join our private Discord group for
            first access to NFT drops, events, and merchandise before anyone
            else.
          </div>
        </div>
        <div className="release-join-discord">
          <div className="input-box-email">
            <MailchimpComponent />
          </div>
          <div className="btn-discord">
            <a
              href="https://discord.gg/NFeGnPkbfd"
              target="_blank"
              rel="noreferrer">
              <img src={DiscordIcon} alt="Discord RAIR.TECH" /> Join our Discord
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NipseyRelease;
