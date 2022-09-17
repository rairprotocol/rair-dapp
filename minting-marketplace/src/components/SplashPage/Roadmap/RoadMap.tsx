import React from 'react';

const RoadMap = () => {
  return (
    <div className="nipsey-roadmap">
      <div className="nipsey-roadmap-title">Roadmap</div>
      <div className="roadmap-container">
        <div className="roadmap-box">
          <div className="roadmap-box-desc">
            Own an original ETH main net NFT on snapshot date & receive the
            following drops:
          </div>
        </div>
        <div className="roadmap-box">
          <div className="roadmap-list">
            <p>Official MATIC drop</p>
            <p>Official Binance Smart Chain drop</p>
          </div>
          <div className="roadmap-list">
            <p>Official Avalanche drop</p>
            <p>Official Klatyn drop</p>
            <p>Official Skale drop</p>
          </div>
          <div className="roadmap-list">
            <p>Priority access for future</p>
            <p>drops and releases</p>
          </div>
        </div>
        <div className="roadmap-box">
          <div className="roadmap-progress">
            <div className="progress-line-pink"></div>
            <div className="progress-line-grey"></div>
            <div className="roadmap-progress-circle">Q1</div>
            <div className="roadmap-progress-circle">Q2</div>
            <div className="roadmap-progress-circle">Q3</div>
          </div>
          <div className="roadmap-progress-text">
            <div className="progress-li">Album release</div>
            <div className="progress-li">Fresh tracks</div>
            <div className="progress-li">Feature documentary</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadMap;
