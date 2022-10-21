import React from 'react';

import { TSplashCardButtonsWrapper } from '../splashConfig.types';
import { StyledSplashCardButtonsWrapper } from '../styles/StyledButtonsContainer.styled';

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
