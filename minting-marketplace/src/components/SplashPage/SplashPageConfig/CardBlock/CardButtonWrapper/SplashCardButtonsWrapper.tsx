import React from 'react';

import { StyledSplashCardButtonsWrapper } from './StyledSplashCardButtonsWrapper';

import { TSplashCardButtonsWrapper } from '../../splashConfig.types';

const SplashCardButtonsWrapper: React.FC<TSplashCardButtonsWrapper> = ({
  children,
  marginTop,
  height,
  width,
  gap,
  flexDirection
}) => {
  return (
    <StyledSplashCardButtonsWrapper
      marginTop={marginTop}
      height={height}
      width={width}
      gap={gap}
      flexDirection={flexDirection}>
      {children}
    </StyledSplashCardButtonsWrapper>
  );
};

export default SplashCardButtonsWrapper;
