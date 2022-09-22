import React from 'react';
import { TSplashPageMainBlock } from '../splashConfig.types';
import { SplashMainBlockWrapper } from '../styles/SplashMainBlockStyled.styled';

const SplashPageMainBlock: React.FC<TSplashPageMainBlock> = ({
  widthDiff,
  heightDiff,
  bgColor,
  children,
  borderRadius,
  backgroundImage
}) => {
  return (
    <SplashMainBlockWrapper
      bgColor={bgColor}
      widthDiff={widthDiff}
      heightDiff={heightDiff}
      borderRadius={borderRadius}
      backgroundImage={backgroundImage}>
      {children}
    </SplashMainBlockWrapper>
  );
};

export default SplashPageMainBlock;
