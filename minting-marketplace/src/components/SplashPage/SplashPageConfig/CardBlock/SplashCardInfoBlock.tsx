import React from 'react';

import { TSplashCardInfoBlock } from '../splashConfig.types';
import { StyledSplashCardInfoBlock } from '../styles/MainBlockTextContainer.styled';

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
