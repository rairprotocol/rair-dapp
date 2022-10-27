import React from 'react';

import { StyledSplashPageCardWrapper } from './StyledSplashPageCardWrapper';

import { TSplashPageCardWrapper } from '../../splashConfig.types';

const SplashPageCardWrapper: React.FC<TSplashPageCardWrapper> = ({
  bgColor,
  children
}) => {
  return (
    <StyledSplashPageCardWrapper bgColor={bgColor}>
      {children}
    </StyledSplashPageCardWrapper>
  );
};

export default SplashPageCardWrapper;
