import React from 'react';

import { TSplashPageMainBlock } from '../splashConfig.types';
import { StyledSplashMainBlockWrapper } from '../styles/SplashMainBlockStyled.styled';

const SplashPageMainBlock: React.FC<TSplashPageMainBlock> = ({
  widthDiff,
  heightDiff,
  bgColor,
  children,
  borderRadius,
  paddingLeft
}) => {
  return (
    <StyledSplashMainBlockWrapper
      bgColor={bgColor}
      widthDiff={widthDiff}
      heightDiff={heightDiff}
      borderRadius={borderRadius}
      paddingLeft={paddingLeft}>
      {children}
    </StyledSplashMainBlockWrapper>
  );
};

export default SplashPageMainBlock;
