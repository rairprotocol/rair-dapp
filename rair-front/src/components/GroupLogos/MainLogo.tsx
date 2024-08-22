import React from 'react';

import { IMainLogo } from './mainLogo.types';
import { MainLogoContaier } from './MainLogoItems';

import { useAppSelector } from '../../hooks/useReduxHooks';
import useServerSettings from '../../hooks/useServerSettings';

import LoadingComponent from './../common/LoadingComponent';

const MainLogo: React.FC<IMainLogo> = ({ goHome }) => {
  const { headerLogo } = useAppSelector((store) => store.colors);
  const { isLoading } = useServerSettings();
  const hotdropsVar = import.meta.env.VITE_TESTNET;
  return (
    <>
      <MainLogoContaier>
        {!isLoading ? (
          <img
            className={`${hotdropsVar === 'true' ? 'logo-hotdrops-image' : ''}`}
            onClick={() => goHome()}
            alt="Rair Tech"
            src={headerLogo}
          />
        ) : (
          <LoadingComponent size={25} classes={''} />
        )}
      </MainLogoContaier>
    </>
  );
};

export default MainLogo;
