import { FC } from 'react';

import { IMainLogo } from './mainLogo.types';
import { MainLogoContaier } from './MainLogoItems';

import { useAppSelector } from '../../hooks/useReduxHooks';
import { dataStatuses } from '../../redux/commonTypes';

import LoadingComponent from './../common/LoadingComponent';

const MainLogo: FC<IMainLogo> = ({ goHome }) => {
  const { headerLogo } = useAppSelector((store) => store.colors);
  // const { dataStatus } = useAppSelector((store) => store.settings);
  const hotdropsVar = import.meta.env.VITE_TESTNET;

  // if (dataStatus !== dataStatuses.Complete) {
  //   return <LoadingComponent classes="logo-hotdrops-image" size={25} />;
  // }

  return (
    <>
      <MainLogoContaier>
        <img
          // className={`${hotdropsVar === 'true' ? 'logo-hotdrops-image' : ''}`}
          onClick={() => goHome()}
          alt="Rair Tech"
          src={headerLogo}
        />
      </MainLogoContaier>
    </>
  );
};

export default MainLogo;
