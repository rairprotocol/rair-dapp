import React from 'react';

import { StyledSplashPageCardWrapper } from './StyledSplashPageCardWrapper';

import { TSplashPageCardWrapper } from '../../splashConfig.types';

const SplashPageCardWrapper: React.FC<TSplashPageCardWrapper> = ({
  bgColor,
  height,
  children
}) => {
  return (
    <StyledSplashPageCardWrapper bgColor={bgColor} height={height}>
      {children}
    </StyledSplashPageCardWrapper>
  );
};

export default SplashPageCardWrapper;
