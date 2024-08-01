import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { v4 } from 'uuid';

import TeammateDesc from './TeammateDesc';

import { ImageLazy } from '../../MockUpPage/ImageLazy/ImageLazy';
import { ITeammate } from '../splashPage.types';

const Teammate: React.FC<ITeammate> = ({
  url,
  name,
  desc,
  primaryColor,
  socials,
  chain,
  arraySplash
}) => {
  return (
    <div className="box-teammate">
      <div className="img-teammate">
        <ImageLazy src={url} alt={name} />
      </div>
      <div className="position-teammate">
        <div className="temmate-content-up">
          <div className="teammate-title-socials">
            <div className="teammate-wrapper-name">
              {chain && (
                <span className={arraySplash === 'nftnyc' ? 'nftnyc-font' : ''}>
                  {chain}
                </span>
              )}
              <h4 className={arraySplash === 'nftnyc' ? 'nftnyc-font' : ''}>
                {name}
              </h4>
            </div>
          </div>
          <TeammateDesc
            arraySplash={arraySplash}
            desc={desc}
            primaryColor={primaryColor}
          />
        </div>
        <div className="box-socials">
          {socials &&
            socials.map((social) => {
              return (
                <span key={v4()}>
                  <a
                    className={social.classLink}
                    target="_blank"
                    href={social.link}
                    rel="noreferrer">
                    <FontAwesomeIcon icon={social.classIcon} />
                  </a>
                </span>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Teammate;
