//@ts-nocheck
import React from 'react';
// import DiscordIcon from './../images/discord-icon.png';
// import logoAuthor from './../images/colab.png';
import { useNavigate } from 'react-router-dom';
import Main from '../images/nuts-main.png';

const ComingSoonNut = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="col-12">
      <div className="nipsey-comming-soon nutcrackers">
        <div className="information-author">
          <div className="img-coming-nuts">
            <img src={Main} alt="Custom logo by Rair Tech" />
          </div>
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
              <div className="btn-back-coming">
                <button onClick={goBack}>Back</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonNut;
