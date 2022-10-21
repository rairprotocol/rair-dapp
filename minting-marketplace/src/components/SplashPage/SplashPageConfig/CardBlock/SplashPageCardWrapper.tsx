import React from 'react';

import { TSplashPageCardWrapper } from '../splashConfig.types';
import { StyledSplashPageCardWrapper } from '../styles/SplashMainBlockStyled.styled';

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
