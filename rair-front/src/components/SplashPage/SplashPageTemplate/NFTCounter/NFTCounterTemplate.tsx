//@ts-nocheck
//unused-component
import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import './NFTCounter.css';

const NFTCounter = ({
  primaryColor,
  leftTokensNumber,
  wholeTokens,
  counterData
}) => {
  const { titleColor, title1, title2, description, backgroundImage } =
    counterData;
  return (
    <div className="left-tokens">
      <div
        className="block-left-tokens"
        style={{
          backgroundImage: backgroundImage
        }}>
        <div
          className="progress-tokens"
          style={{
            background: `${
              primaryColor === 'rhyno'
                ? 'rgba(34, 32, 33, 0.4)'
                : 'rgba(34, 32, 33, 0.6)'
            }`
          }}>
          <div className="title-progress-left">NFTs Minted</div>
          <Box className="box-progress" sx={{ position: 'relative' }}>
            <CircularProgress
              className="progress-grey"
              variant="determinate"
              sx={{
                color: (theme) =>
                  theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800]
              }}
              size={40}
              thickness={1.5}
              value={100}
            />
            <CircularProgress
              className="progress-main"
              variant="determinate"
              sx={{
                color: (theme) =>
                  theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
                position: 'absolute',
                left: 0
              }}
              size={40}
              thickness={4}
              value={100}
            />
          </Box>
          <div
            className="text-progress"
            style={{ fontSize: `${leftTokensNumber === 50 && '32px'}` }}>
            <div className="progress-info">
              <div className="text-numbers">
                <div
                  className="text-left-tokens"
                  style={{
                    color: titleColor
                  }}>
                  {leftTokensNumber}
                </div>
                <div className="text-whole-tokens"> / {wholeTokens}</div>
              </div>
              <div>left</div>
            </div>
          </div>
        </div>
      </div>
      <div className="left-tokens-content nutcrackers">
        <div className="title-tokens">
          <h3>
            <span style={{ color: '#035BBC' }}>{title1}</span> {title2}
          </h3>
        </div>
        <div className="tokens-description">
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default NFTCounter;
