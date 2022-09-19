import React from 'react';
import { ISplashPageProps } from '../splashPage.types';
import { SplashMainBlockWrapper } from './SplashMainBlockStyled.styles';

const SplashPageMainBlock: React.FC<ISplashPageProps> = ({
  connectUserData
}) => {
  return (
    <SplashMainBlockWrapper bgColor="#ffffff">
      Splash Page Main Block
    </SplashMainBlockWrapper>
  );
};

export default SplashPageMainBlock;
