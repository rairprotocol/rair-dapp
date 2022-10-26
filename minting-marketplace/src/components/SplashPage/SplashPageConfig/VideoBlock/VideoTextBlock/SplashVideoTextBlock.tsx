import React from 'react';

import { StyledSplashVideoTextBlock } from './StyledSplashVideoTextBlock';

import { TSplashVideoTextBlock } from '../../splashConfig.types';

const SplashVideoTextBlock: React.FC<TSplashVideoTextBlock> = ({
  children,
  className
}) => {
  return (
    <StyledSplashVideoTextBlock className={className}>
      {children}
    </StyledSplashVideoTextBlock>
  );
};
export default SplashVideoTextBlock;
