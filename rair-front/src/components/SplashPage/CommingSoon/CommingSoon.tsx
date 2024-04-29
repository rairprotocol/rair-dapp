import React from 'react';
import { useNavigate } from 'react-router-dom';

import { discrodIconNoBorder } from '../../../images';
import { ImageLazy } from '../../MockUpPage/ImageLazy/ImageLazy';
import { LogoAuthor } from '../images/commingSoon/commingSoonImages';

const ComingSoon = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="col-12">
      <div className="nipsey-comming-soon">
        <div className="information-author">
          <div className="block-splash">
            <div className="text-splash">
              <div className="title-splash nipsey">
                <span>Coming soon</span>
              </div>
              <div className="text-description">
                <div>
                  Marketplace will be live after the official launch. In the
                  meantime.
                </div>
              </div>
              <div className="release-join-discord">
                <div className="btn-discord">
                  <a
                    href="https://discord.gg/NFeGnPkbfd"
                    target="_blank"
                    rel="noreferrer">
                    <ImageLazy
                      src={discrodIconNoBorder}
                      alt="Discord RAIR.TECH"
                    />{' '}
                    Join our Discord
                  </a>
                </div>
              </div>
              <div className="btn-back-coming">
                <button onClick={goBack}>Back</button>
              </div>
              <div className="logo-author">
                <ImageLazy src={LogoAuthor} alt="Custom logo by Rair Tech" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
