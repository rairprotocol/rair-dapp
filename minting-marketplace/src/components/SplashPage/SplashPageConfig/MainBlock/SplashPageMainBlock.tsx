import React from 'react';
import { ISplashPageMainBlock } from '../../splashPage.types';
import { SplashMainBlockWrapper } from '../styles/SplashMainBlockStyled.styles';

const SplashPageMainBlock: React.FC<ISplashPageMainBlock> = ({
  widthDiff,
  heightDiff,
  bgColor,
  children,
  borderRadius
}) => {
  return (
    <SplashMainBlockWrapper
      bgColor={bgColor}
      widthDiff={widthDiff}
      heightDiff={heightDiff}
      borderRadius={borderRadius}>
      {children}
    </SplashMainBlockWrapper>
  );
};

export default SplashPageMainBlock;
