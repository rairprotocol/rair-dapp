import React from 'react';
import { useSelector } from 'react-redux';

import { IMainLogo } from './mainLogo.types';
import { MainLogoContaier } from './MainLogoItems';

import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { HotDropsLogo, HotDropsLogoLight } from '../../images';

const MainLogo: React.FC<IMainLogo> = ({ goHome }) => {
  const { headerLogo, primaryColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );
  const hotdropsVar = import.meta.env.VITE_HOTDROPS;
  return (
    <>
      <MainLogoContaier>
        <img
          className={`${hotdropsVar === 'true' ? 'logo-hotdrops-image' : ''}`}
          onClick={() => goHome()}
          alt="Rair Tech"
          src={headerLogo}
        />
      </MainLogoContaier>
    </>
  );
};

export default MainLogo;
