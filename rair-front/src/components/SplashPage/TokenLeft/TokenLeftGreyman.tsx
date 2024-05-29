import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { ITokenLeftGreyman } from '../splashPage.types';

const TokenLeftGreyman: React.FC<ITokenLeftGreyman> = ({
  primaryColor,
  soldCopies,
  copies
}) => {
  // in props was Metamask
  const [percentTokens, setPersentTokens] = useState<number>(0);
  const [showMore, setShowMore] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<string>('');

  const wholeTokens = Number(copies);
  const leftTokensNumber = Number(soldCopies);

  useEffect(() => {
    if (leftTokensNumber <= wholeTokens) {
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
    if (leftTokensNumber > wholeTokens || leftTokensNumber === wholeTokens) {
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
    <div className="left-tokens greyman-page left-tokens-response ">
      {soldCopies !== undefined && (
        <div className="block-left-content-greyman">
          <div className="block-left-tokens">
            <div
              className="progress-tokens"
              style={{
                background: `${
                  primaryColor === 'rhyno'
                    ? 'rgba(34, 32, 33, 0.4)'
                    : 'rgba(34, 32, 33, 0.6)'
                }`
              }}>
              <div className="title-progress-left">NFTs minted</div>
              <Box className="box-progress" sx={{ position: 'relative' }}>
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
                className="text-progress"
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
                    <div className="text-whole-tokens"> / {'7.9b'}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="down-text">
              * Minting on demand secures your NFT on the blockhain.
            </div>
          </div>
          <div className="btn-buy-metamask">
            <div className="greyman-royalties-wrapper">
              <strong>Royalties</strong>
              <div className="greyman-royalties">
                <span>Dadara: Sale 70% Resale 5%</span>
                <span>MOTG: Sale 20% Resale 5%</span>
                <span>RAIR: Sale 10% Resale 5% </span>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="left-tokens-content">
        <div className="title-tokens">
          <h3>
            The{' '}
            <span className="text-gradient text-gradient-grey">Greyman</span>{' '}
            story
          </h3>
        </div>
        <div
          className={`tokens-description ${
            soldCopies === undefined && 'w-100'
          }`}>
          <p
            style={{
              color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
            }}>
            The Greyman is taking over the world. One NFT at a time…..
          </p>
          <p
            style={{
              color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
            }}>
            In the physical world scarcity exists. When a painting is made, it’s
            the only one in existence. And it would take a painstaking amount of
            time and effort to recreate the same one again. But, why would we
            want to create a second one which is exactly the same? The beauty of
            handcrafted man-made art lies in its uniqueness. It is a fact that
            see in each brush stroke the personality of the artist and that each
            time a brush stroke is made it’ll be different from the previous
            one, no matter how hard we try to create exactly the same one. So
            why try to make two identical paintings? On the other hand, in the
            digital world we can create exact copies in overabundance. When we
            create a digital image, we can multiply it as many times as we want
            just by the click of a button. We can also edit and animate the
            image, and each time we make a mistake there’s “control Z” to
            correct it. Two different worlds which co-exist and in my opinion
            could enhance each other in amazing ways.
          </p>
          {showMore ? (
            <p
              style={{
                color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
              }}>
              Playing a vinyl record feels like a ritual experience, one which
              takes effort and needs attention. We have to take the record out
              of the sleeve (and in the meantime probably can’t resist reading
              some of the liner notes on the sleeve and admire the artwork). We
              gently put the needle on the record and then create a listening
              experience, a ritual. Each crack in the record, each imperfection
              added with each listening session gives us a sense of history, of
              our relationship with the record. But when I’m in my studio, I
              just press ‘play’ on Spotify. And while I’m painting, the music
              music becomes a soundtrack for me to create. I don’t need to focus
              on the act of having music in my studio, it’s just there. Also, I
              don’t get disturbed by the cracks and hisses when the record ends,
              meaning I’d have to get up, rinse my brushes, and disrupt my
              creative process in order to change the record. Also, whenever I
              go to another building, city or country by foot, plane, car or
              bicycle, I always have my music with me.
              <button
                className="btn-show-more"
                onClick={() => {
                  setShowMore(!showMore);
                }}>
                {showMore ? 'Read less' : 'Read more...'}
              </button>
            </p>
          ) : (
            <button
              className="btn-show-more"
              onClick={() => {
                setShowMore(!showMore);
              }}>
              {showMore ? 'Read less' : 'Read more...'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenLeftGreyman;
