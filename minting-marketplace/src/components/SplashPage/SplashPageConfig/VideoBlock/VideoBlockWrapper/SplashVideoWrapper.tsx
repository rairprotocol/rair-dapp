import React from 'react';

import { StyledSplashVideoWrapper } from './StyledSplashVideoWrapper';

import { TSplashVideoWrapper } from '../../splashConfig.types';

const SplashVideoWrapper: React.FC<TSplashVideoWrapper> = ({
  children,
  className
}) => {
  return (
    <StyledSplashVideoWrapper className={className}>
      {children}
    </StyledSplashVideoWrapper>
  );
};

export default SplashVideoWrapper;
