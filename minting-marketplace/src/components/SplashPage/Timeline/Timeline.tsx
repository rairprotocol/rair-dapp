import React, { memo } from 'react';

import {
  Flyinggreyman,
  GreymanArmy,
  GreymanMatrix,
  GreymanMonument,
  GreymanRose,
  GreyManTimes,
  GreymanVariants
} from '../images/greyMan/grayMan';

import cl from './Timeline.module.css';

const TimelineComponent = () => {
  return (
    <div className={cl.root}>
      <div className={cl.timeline}>
        <ul>
          <li style={{ paddingBottom: '91px' }}>
            <div className={cl.right_content}>
              <img
                style={{
                  borderRadius: '16px',
                  display: 'block',
                  width: '355px',
                  height: '355px'
                }}
                src={Flyinggreyman}
                alt="It's the incredible GREYMAN 100% PURE GREY. Offical DADARA No-fun product"
              />
            </div>
            <div className={cl.left_content}>
              <h3>Physical Era</h3>
            </div>
          </li>
          <>
            <div style={{ paddingTop: '6rem' }} className={cl.right_content}>
              <p className={cl.p_content}>
                <strong>1994</strong> <br /> Cryptogreyman is born. A modern
                superhero in his combat against fun, humor, initiative, and
                creativity. Acrylic on linen. 90 x 90 cm. Part of Dadara’s No
                Fun exhibition in Amsterdam.
              </p>
            </div>
          </>
          <div className={cl.right_content_margin}>
            <div
              style={{
                display: 'inline-flex'
              }}
              className={cl.right_content}>
              <img
                style={{
                  borderRadius: '16px',
                  display: 'block',
                  width: '531px',
                  height: '237px',
                  zIndex: '1'
                }}
                src={GreymanVariants}
                alt="We finally discovered some color inside GREYMAN!"
              />
              <p className={cl.p_content}>
                <strong>1996-98</strong> <br />
                Greyman became a series based on the same character with various
                traits and characteristics, such as the Grey Punk, Grey Angel,
                Tattooed Greyman etc. Sounds familiar nowadays in this age of
                10K collectibles and PFPs, doesn’t it?
              </p>
            </div>
          </div>
          <div
            style={{ marginBottom: '92px' }}
            className={cl.right_content_margin}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-start'
              }}
              className={cl.right_content}>
              <img
                style={{
                  borderRadius: '16px',
                  display: 'block',
                  width: '343px',
                  height: '441px'
                }}
                src={GreymanVariants}
                alt="Greyman Statue"
              />
              <p
                style={{ paddingLeft: '5rem', width: '353px' }}
                className={cl.p_content}>
                <strong>1998</strong> <br />
                Nine metres high Greyman Statue of No Liberty made out of
                concrete and bronze in front of Rijksmuseum in Amsterdam.
              </p>
            </div>
          </div>

          <div className={cl.right_content_1}>
            <p className={cl.right_content_p}>
              <strong>2002</strong> <br />
              140 paper maché Greymen traveled to the Nevada desert to the
              Burning Man festival where they surrounded an altar. People could
              customize them and make them less grey during the week after which
              they could burn them in a private ritual at the end, thus burning
              burning and freeing their Inner Greyman.
            </p>
            <img
              style={{
                borderRadius: '16px',
                display: 'block',
                width: '460px',
                height: '373px'
              }}
              src={GreymanArmy}
              alt="The desert in which there are a lot of Greyman statues"
            />
          </div>

          <li>
            <div className={cl.right_content}>
              <p className={cl.right_content_era_web2}>
                <strong>2002-2020</strong> <br />
                Greyman lies dormant and patiently waits for Web2 to develop
                into Web3
              </p>
            </div>
            <div className={cl.left_content}>
              <h3>Web2 Era </h3>
            </div>
          </li>
          <li>
            <div style={{ marginTop: '3rem' }} className={cl.right_content}>
              <img
                style={{
                  borderRadius: '16px',
                  display: 'block',
                  width: '355px',
                  height: '355px'
                }}
                src={GreymanRose}
                alt="Greyman on a pink background"
              />
            </div>
            <div className={cl.left_content}>
              <h3>Web3 Era </h3>
            </div>
          </li>
          <>
            <div style={{ paddingTop: '6rem' }} className={cl.right_content}>
              <p
                style={{ marginTop: '5rem', marginLeft: '3rem' }}
                className={cl.p_content}>
                <strong>4 November 2021</strong> <br />
                Birth of the handpainted Cryptogreyman (NFT sold on{' '}
                <span style={{ textDecoration: 'underline' }}>Rarible</span> for
                2.429 ETH, painting sold for 3208 Euro at auction)
              </p>
            </div>
          </>

          <div
            style={{ display: 'inline-flex', paddingTop: '80px' }}
            className={cl.right_content_1}>
            <p className={cl.right_content_p_november}>
              <strong> 30 November 2021</strong> <br />
              Birth of the pure digital Cryptogreyman (NFT sold on{' '}
              <span style={{ textDecoration: 'underline' }}>
                Foundation
              </span>{' '}
              for 0.7 ETH)
            </p>
            <img
              style={{
                borderRadius: '16px',
                display: 'block',
                width: '355px',
                height: '356px'
              }}
              src={GreymanMatrix}
              alt="Greyman in the Matrix"
            />
          </div>

          <li style={{ marginTop: '3rem' }}>
            <div
              style={{ boxShadow: 'none', left: '-428px' }}
              className={cl.left_content}>
              <img
                style={{ display: 'block', width: '358px', height: '464px' }}
                src={GreyManTimes}
                alt="Person of the Year TIME"
              />
            </div>
            <div className={cl.right_content}>
              <h3
                style={{
                  boxShadow: '0 0 0 3px rgb(59 112 239 / 30%)',
                  padding: '8px 16px',
                  borderRadius: '18px',
                  width: 'min-content',
                  marginTop: '-2rem',
                  marginLeft: '2rem'
                }}>
                Beyond
              </h3>
            </div>
          </li>

          <>
            <div style={{ paddingTop: '6rem' }} className={cl.right_content}>
              <p style={{ marginTop: '5rem' }} className={cl.p_content_last}>
                <strong>2022</strong> <br />
                Birth of 7.907.414.597 Greymen mintable on MATIC ready to turn
                the Metaverse into a Greyverse.
              </p>
            </div>
          </>
          <div style={{ clear: 'both' }}></div>
        </ul>
      </div>
      <div className={cl.timelineMobile}>
        <div className={cl.mobileTitleBlock}>Physical Era</div>
        <div className={cl.timeLineContentMobile}>
          <img
            src={GreymanRose}
            alt="It's the incredible GREYMAN 100% PURE GREY. Offical DADARA No-fun product"
          />

          <div className={cl.mobileDesc}>
            <span>1994</span>
            <br />
            Cryptogreyman is born. A modern superhero in his combat against fun,
            humor, initiative, and creativity. Acrylic on linen. 90 x 90 cm.
            Part of Dadara’s No Fun exhibition in Amsterdam.
          </div>
        </div>
        <div className={cl.timeLineContentMobile}>
          <img
            src={Flyinggreyman}
            alt="We finally discovered some color inside GREYMAN!"
          />

          <div className={cl.mobileDesc}>
            <span>1996-98</span>
            <br />
            Greyman became a series based on the same character with various
            traits and characteristics, such as the Grey Punk, Grey Angel,
            Tattooed Greyman etc. Sounds familiar nowadays in this age of 10K
            collectibles and PFPs, doesn’t it?
          </div>
        </div>
        <div className={cl.timeLineContentMobile}>
          <img src={GreymanMonument} alt="Greyman Statue" />

          <div className={cl.mobileDesc}>
            <span>1998</span> <br />
            Nine metres high Greyman Statue of No Liberty made out of concrete
            and bronze in front of Rijksmuseum in Amsterdam.
          </div>
        </div>
        <div className={cl.timeLineContentMobile}>
          <img
            src={GreymanArmy}
            alt="The desert in which there are a lot of Greyman statues"
          />

          <div className={cl.mobileDesc}>
            <span>2002</span> <br />
            140 paper maché Greymen traveled to the Nevada desert to the Burning
            Man festival where they surrounded an altar. People could customize
            them and make them less grey during week after which they could burn
            them in a private ritual at the end, thus burning and freeing their
            Inner Greyman.
          </div>
        </div>
        <div className={cl.mobileTitleBlock}>Web2 Era</div>
        <div className={cl.timeLineContentMobile}>
          <div className={cl.mobileDesc}>
            <span>2002-2020</span>
            <br />
            Greyman lies dormant and patiently waits for Web2 to develop into
            Web3
          </div>
        </div>
        <div className={cl.mobileTitleBlock}>Web3 Era</div>
        <div className={cl.timeLineContentMobile}>
          <img src={GreymanRose} alt="Greyman on a pink background" />

          <div className={cl.mobileDesc}>
            <span>4 November 2021 </span> <br />
            Birth of the handpainted Cryptogreyman (NFT sold on Rarible for
            2.429 ETH, painting for 3208 Euro at auction)
          </div>
        </div>
        <div className={cl.timeLineContentMobile}>
          <img src={GreymanMatrix} alt="Greyman in the Matrix" />

          <div className={cl.mobileDesc}>
            <span>30 November 2021</span> <br />
            Birth of the pure digital Cryptogreyman (NFT sold on Foundation for
            0.7 ETH)
          </div>
        </div>
        <div className={cl.mobileTitleBlock}>Beyond</div>
        <div className={cl.timeLineContentMobile}>
          <img src={GreyManTimes} alt="Person of the Year TIME" />

          <div className={cl.mobileDesc}>
            <span>2022</span> <br />
            Birth of 7.907.414.597 Greymen mintable on MATIC ready to turn the
            Metaverse into a Greyverse.
          </div>
        </div>
      </div>
    </div>
  );
};

export const Timeline = memo(TimelineComponent);
