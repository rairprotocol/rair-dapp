import React from 'react';
import { useSelector } from 'react-redux';

import { IMainLogo } from './mainLogo.types';
import { MainLogoContaier } from './MainLogoItems';

import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import useServerSettings from '../adminViews/useServerSettings';

import LoadingComponent from './../common/LoadingComponent';

const MainLogo: React.FC<IMainLogo> = ({ goHome }) => {
  const { headerLogo } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );
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
