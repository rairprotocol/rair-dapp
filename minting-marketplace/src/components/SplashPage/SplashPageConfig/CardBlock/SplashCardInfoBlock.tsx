import React from 'react';

import { TSplashCardInfoBlock } from '../splashConfig.types';
import { StyledSplashCardInfoBlock } from '../styles/MainBlockTextContainer.styled';

const SplashCardInfoBlock: React.FC<TSplashCardInfoBlock> = ({
  children,
  padding
}) => {
  return (
    <StyledSplashCardInfoBlock padding={padding}>
      {children}
    </StyledSplashCardInfoBlock>
  );
};

export default SplashCardInfoBlock;
