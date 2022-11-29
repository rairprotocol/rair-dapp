import React from 'react';

import { StyledSplashCardButtonsWrapper } from './StyledSplashCardButtonsWrapper';

import { TSplashCardButtonsWrapper } from '../../splashConfig.types';

const SplashCardButtonsWrapper: React.FC<TSplashCardButtonsWrapper> = ({
  children,
  marginTop,
  height,
  width,
  margin,
  gap,
  flexDirection,
  justifyContent
}) => {
  return (
    <StyledSplashCardButtonsWrapper
      marginTop={marginTop}
      height={height}
      width={width}
      margin={margin}
      gap={gap}
      flexDirection={flexDirection}
      justifyContent={justifyContent}>
      {children}
    </StyledSplashCardButtonsWrapper>
  );
};

export default SplashCardButtonsWrapper;
