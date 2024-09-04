import { FC } from 'react';

import { useAppSelector } from '../../../../hooks/useReduxHooks';

const RoadMap: FC = () => {
  const { isDarkMode } = useAppSelector((store) => store.colors);
  return (
    <div className="about-roadmap">
      <div className="about-road-title">2022 Roadmap</div>
      <div className="roadmap-container-mobile">
        <div className="about-map-item">
          <div className="map-item-progress">
            <div className="map-progress">
              <div className="line-purple"></div>
              <div className="line-grey"></div>
              <div className="progress-box">Q1</div>
              <div className="progress-box">Q2</div>
              <div className="progress-box">Q3</div>
            </div>
            <div className={`progress-title ${!isDarkMode ? 'rhyno' : ''}`}>
              Curation Alpha
              <span></span>
            </div>
          </div>
          <div className="map-item-desc">
            <p>EVM NFT suite for Ethereum, Matic, BSC</p>
            <p>Custom minting, royalty splits, aggregation</p>
            <p>Encrypted streaming video</p>
          </div>
        </div>
        <div className="about-map-item">
          <div className="map-item-progress">
            <div className="map-progress">
              <div className="line-private"></div>
              <div className="line-grey"></div>
              <div className="progress-box">Q2</div>
              <div className="progress-box">Q3</div>
              <div className="progress-box">Q4</div>
            </div>
            <div className={`progress-title ${!isDarkMode ? 'rhyno' : ''}`}>
              Private Beta
              <span></span>
            </div>
          </div>
          <div className="map-item-desc">
            <p>Scale to customer</p>
            <p>EVM Aidrops to token holders</p>
            <p>Curated marketplace</p>
          </div>
        </div>
        <div className="about-map-item">
          <div className="map-item-progress">
            <div className="map-progress">
              <div className="line-public"></div>
              <div className="line-grey"></div>
              <div className="progress-box">Q3</div>
              <div className="progress-box">Q4</div>
              <div className="progress-box">Q5</div>
            </div>
            <div className={`progress-title ${!isDarkMode ? 'rhyno' : ''}`}>
              Public Release
              <span></span>
            </div>
          </div>
          <div className="map-item-desc">
            <p>Toolset release for all creators</p>
            <p>Encrypted data streaming</p>
            <p>Marketplaces for NFT stakers</p>
          </div>
        </div>
      </div>
      <div className="roadmap-container">
        <div className="container-curation-public">
          <div className="about-map-item">
            <div className="map-item-progress">
              <div className="map-progress">
                <div className="line-purple"></div>
                <div className="line-grey"></div>
                <div className="progress-box">Q1</div>
                <div className="progress-box">Q2</div>
                <div className="progress-box">Q3</div>
              </div>
              <div className={`progress-title ${!isDarkMode ? 'rhyno' : ''}`}>
                Curation Alpha
                <span></span>
              </div>
            </div>
            <div className="map-item-desc">
              <p>EVM NFT suite for Ethereum, Matic, BSC</p>
              <p>Custom minting, royalty splits, aggregation</p>
              <p>Encrypted streaming video</p>
            </div>
          </div>
          <div className="about-map-item">
            <div className="map-item-progress">
              <div className="map-progress">
                <div className="line-public"></div>
                <div className="line-grey"></div>
                <div className="progress-box">Q3</div>
                <div className="progress-box">Q4</div>
                <div className="progress-box">Q5</div>
              </div>
              <div className={`progress-title ${!isDarkMode ? 'rhyno' : ''}`}>
                Public Release
                <span></span>
              </div>
            </div>
            <div className="map-item-desc">
              <p>Toolset release for all creators</p>
              <p>Encrypted data streaming</p>
              <p>Marketplaces for NFT stakers</p>
            </div>
          </div>
        </div>
        <div className={`block-devide-box ${!isDarkMode ? 'rhyno' : ''}`}>
          <div className="squere"></div>
          <div className="squere"></div>
          <div className="squere"></div>
        </div>
        <div className="container-private-beta">
          <div className="about-map-item">
            <div className="map-item-progress">
              <div className="map-progress">
                <div className="line-private"></div>
                <div className="line-grey"></div>
                <div className="progress-box">Q2</div>
                <div className="progress-box">Q3</div>
                <div className="progress-box">Q4</div>
              </div>
              <div className={`progress-title ${!isDarkMode ? 'rhyno' : ''}`}>
                Private Beta
                <span></span>
              </div>
            </div>
            <div className="map-item-desc">
              <p>Scale to customer</p>
              <p>EVM Aidrops to token holders</p>
              <p>Curated marketplace</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadMap;
