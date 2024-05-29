import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { RootState } from '../../../ducks';
import { TUsersInitialState } from '../../../ducks/users/users.types';
import { ITokenLeftTemplate } from '../splashPage.types';

import './TokenLeftTemplate.css';

const TokenLeftTemplate: React.FC<ITokenLeftTemplate> = ({
  primaryColor,
  soldCopies,
  counterData,
  ipftButton,
  nftTitle = 'NFTs minted',
  counterOverride
}) => {
  const {
    backgroundImage,
    description,
    title1,
    title2,
    titleColor,
    btnColorIPFS,
    properties,
    royaltiesNft,
    nftCount
  } = counterData || {};

  const [percentTokens, setPersentTokens] = useState<number>(0);
  const [fontSize, setFontSize] = useState<string>('');

  const wholeTokens = nftCount;
  const leftTokensNumber = soldCopies;

  const { loggedIn } = useSelector<RootState, TUsersInitialState>(
    (store) => store.userStore
  );

  useEffect(() => {
    if (wholeTokens && leftTokensNumber <= wholeTokens) {
      const percentLeft =
        (Number(leftTokensNumber) * 100) / Number(wholeTokens);
      if (percentLeft > 1) {
        setPersentTokens(Math.floor(percentLeft));
      } else if (percentLeft > 990) {
        setPersentTokens(Math.floor(percentLeft));
      } else {
        setPersentTokens(Math.ceil(percentLeft));
      }
    }
    if (
      (wholeTokens && leftTokensNumber > wholeTokens) ||
      leftTokensNumber === wholeTokens
    ) {
      setPersentTokens(100);
    }
  }, [setPersentTokens, wholeTokens, leftTokensNumber]);

  useEffect(() => {
    if (leftTokensNumber >= 10000000) {
      setFontSize('32px');
    }
    if (leftTokensNumber >= 1000000000) {
      setFontSize('28px');
    }
  }, [leftTokensNumber, wholeTokens]);

  return (
    <div className="left-tokens left-tokens-response">
      {(counterOverride || (soldCopies !== undefined && loggedIn)) && (
        <div className="block-left-content-greyman">
          <div
            className="block-left-tokens"
            style={{ backgroundImage: `${backgroundImage}` }}>
            <div
              className="progress-tokens"
              style={{
                background: `${
                  primaryColor === 'rhyno'
                    ? 'rgba(34, 32, 33, 0.4)'
                    : 'rgba(34, 32, 33, 0.6)'
                }`
              }}>
              <div className="title-progress-left">{nftTitle}</div>
              <Box
                className="box-progress progress-template"
                sx={{ position: 'relative' }}>
                <CircularProgress
                  className="progress-grey"
                  variant="determinate"
                  sx={{
                    color: (theme) =>
                      theme.palette.grey[
                        theme.palette.mode === 'light' ? 200 : 800
                      ]
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
                  value={percentTokens}
                />
              </Box>
              <div
                className="text-progress progress-text-template"
                style={{
                  fontSize: `${leftTokensNumber === wholeTokens && '32px'}`
                }}>
                <div className="progress-info">
                  <div className="text-numbers">
                    <div
                      style={{ color: 'white', fontSize: `${fontSize}` }}
                      className="">
                      {leftTokensNumber}{' '}
                    </div>
                    <div className="text-whole-tokens"> / {nftCount}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="down-text">
              * Minting on demand secures your NFT on the blockhain.
            </div>
          </div>
          <div className="btn-buy-metamask">
            <div className="property-wrapper">
              <div className="property-first-wrapper">
                {properties &&
                  properties.map((item, index) => {
                    return (
                      <div key={index} className="property-first">
                        <div
                          className="property"
                          style={{
                            background: `${
                              primaryColor === 'rhyno' ? '#cccccc' : 'none'
                            }`
                          }}>
                          <span
                            className="property-desc"
                            style={{
                              color: item.titleColor && item.titleColor
                            }}>
                            {item.titleProperty}
                          </span>
                          <span className="property-name-color">
                            {item.propertyDesc}
                          </span>
                          <span className="property-color">{item.percent}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
              {counterOverride || (
                <div className="property-btn-wrapper">
                  {/* <a
                                href={`${import.meta.env.VITE_IPFS_GATEWAY}/QmdJN6BzzYk5vJh1hQgGHGxT7GhVgrvNdArdFo9t9fgqLt`}
                                target="_blank" rel="noreferrer"
                            > */}
                  {ipftButton ? (
                    <button
                      className="property-btn"
                      style={{
                        background: `${btnColorIPFS ? btnColorIPFS : ''}`
                      }}>
                      View on IPFS
                    </button>
                  ) : (
                    <div className="block-after-ipfs">
                      Metadata will be frozen to ipfs in batches as tokens are
                      minted.
                      <br />
                      Please be patient with seeing your NFT on Opensea.
                      <br />
                      <a
                        href="https://discord.com/invite/y98EMXRsCE"
                        target="_blank"
                        rel="noreferrer">
                        {' '}
                        Inquire on our discord
                      </a>{' '}
                      for more info.
                    </div>
                  )}
                  {/* </a> */}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <div className={'left-tokens-content'}>
        <div className="title-tokens">
          <h3>
            <span style={{ color: titleColor && titleColor }}>{title1}</span>
            <span> {title2}</span>
          </h3>
        </div>
        <div
          className={`tokens-description ${
            soldCopies === undefined && 'w-100'
          }`}>
          {description &&
            description.map((item, index) => {
              return (
                <p
                  key={index}
                  style={{
                    color: `${primaryColor === 'rhyno' ? '#000' : '#fff'}`
                  }}>
                  {item}
                </p>
              );
            })}
          {royaltiesNft && (
            <div className="template-royalties-wrapper">
              <h4>Royalties</h4>
              <div className="tempalte-royalties-block">
                {royaltiesNft.firstBlock && (
                  <div className="template-royalties-box">
                    {royaltiesNft.firstBlock.map((item, index) => {
                      return <div key={index}>{item}</div>;
                    })}
                  </div>
                )}
                {royaltiesNft.secondBlock && (
                  <div className="template-royalties-box">
                    {royaltiesNft.secondBlock.map((item, index) => {
                      return <div key={index}>{item}</div>;
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenLeftTemplate;
