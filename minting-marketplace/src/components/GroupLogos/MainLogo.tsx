import React from 'react';
import { IMainLogo } from './mainLogo.types';
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
      <div>
        <img
          onClick={() => goHome()}
          alt="Header Logo"
          src={headerLogo}
          style={{
            width: 'auto',
            height: '26px',
            cursor: 'pointer'
          }}
        />
      </div>
    </>
  );
};

export default MainLogo;
