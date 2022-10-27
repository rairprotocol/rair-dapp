import React from 'react';

import { StyledSplashCardInfoBlock } from './StyledSplashCardInfoBlock';

import { TSplashCardInfoBlock } from '../../splashConfig.types';

const SplashCardInfoBlock: React.FC<TSplashCardInfoBlock> = ({
  children,
  paddingLeft
}) => {
  return (
    <StyledSplashCardInfoBlock paddingLeft={paddingLeft}>
      {children}
    </StyledSplashCardInfoBlock>
  );
};

export default SplashCardInfoBlock;
