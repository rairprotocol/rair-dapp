import React from 'react';

import { TButtonMainBlockWrapper } from '../splashConfig.types';
import { StyledButtonMainBlockWrapper } from '../styles/StyledButtonsContainer.styled';

const ButtonMainBlockWrapper: React.FC<TButtonMainBlockWrapper> = ({
  children,
  flexDirection,
  height
}) => {
  return (
    <StyledButtonMainBlockWrapper flexDirection={flexDirection} height={height}>
      {children}
    </StyledButtonMainBlockWrapper>
  );
};

export default ButtonMainBlockWrapper;
