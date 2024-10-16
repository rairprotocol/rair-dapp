import { FC } from 'react';

import { useAppSelector } from '../../../../hooks/useReduxHooks';

const RairOffer: FC = () => {
  const { isDarkMode } = useAppSelector((store) => store.colors);
  return (
    <div className="about-rair-offer">
      <div className="rair-offer-title">
        RAIR <span className="change-color-text">Royalties</span>
      </div>
      <div className="about-offer-content">
        <div className="streaming-box">
          <div className={`streaming-offer ${!isDarkMode ? 'rhyno' : ''}`}>
            <button className="streaming-btn">Streaming</button>
            <div className="container-progress">
              <div className="streaming-percent">
                <div className="percent">15%</div>
                <div className="percent">10%</div>
                <div className="percent">7.5%</div>
              </div>
              <div className="streaming-progress">
                <div className="line-purple"></div>
                <div className="line-grey"></div>
                <div className="progress-box">1</div>
                <div className="progress-box">2</div>
                <div className="progress-box">3</div>
              </div>
            </div>
          </div>
          <div className="streaming-offer non-streaming">
            <button
              className={`non-streaming-btn ${!isDarkMode ? 'rhyno' : ''}`}>
              Non-Streaming
            </button>
            <div className="container-progress">
              <div className="streaming-percent non-streaming">
                <div className="percent">5%</div>
                <div className="percent">2.5%</div>
                <div className="percent">1.25%</div>
              </div>
              <div className="streaming-progress non-streaming">
                <div className="line-grey"></div>
                <div className="line-grey-second"></div>
                <div className="progress-box">1</div>
                <div className="progress-box">2</div>
                <div className="progress-box">3</div>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            color: `${!isDarkMode ? '#fff' : '#fff'}`
          }}
          className="progress-box">
          2
        </div>
      </div>
    </div>
  );
};

export default RairOffer;
