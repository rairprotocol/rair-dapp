import React from 'react';
import MainBlockInfoText from '../MainBlock/MainBlockInfoText';
import { ISplashPageWrapper } from '../splashConfig.types';

const SplashPageWrapper: React.FC<ISplashPageWrapper> = ({ splashData }) => {
  return (
    <MainBlockInfoText margin={'112px 44px 62px 88px'}>
      <div></div>
    </MainBlockInfoText>
  );
};

export default SplashPageWrapper;
