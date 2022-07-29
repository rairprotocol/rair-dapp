import React from 'react';
import { IMainLogo } from './mainLogo.types';
import { MainLogoContaier } from './MainLogoItems';
// import { useEffect } from 'react';
// import { useParams } from 'react-router-dom';

const MainLogo: React.FC<IMainLogo> = ({
  goHome,
  // sentryHistory,
  headerLogo
  // primaryColor
}) => {
  return (
    <>
      <MainLogoContaier>
        <img onClick={() => goHome()} alt="Header Logo" src={headerLogo} />
      </MainLogoContaier>
    </>
  );
};

export default MainLogo;
