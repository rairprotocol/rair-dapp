import React from 'react';

import { IMainLogo } from './mainLogo.types';
import { MainLogoContaier } from './MainLogoItems';

import { HotDropsLogo, HotDropsLogoLight } from '../../images';
// import { useEffect } from 'react';
// import { useParams } from 'react-router-dom';

const MainLogo: React.FC<IMainLogo> = ({
  goHome,
  // sentryHistory,
  headerLogo,
  primaryColor
}) => {
  return (
    <>
      <MainLogoContaier>
        {process.env.REACT_APP_HOTDROPS === 'true' ? (
          <img
            className="logo-hotdrops-image"
            onClick={() => goHome()}
            alt="Rair Tech"
            src={primaryColor === 'rhyno' ? HotDropsLogoLight : HotDropsLogo}
          />
        ) : (
          <img onClick={() => goHome()} alt="Rair Tech" src={headerLogo} />
        )}
      </MainLogoContaier>
    </>
  );
};

export default MainLogo;
