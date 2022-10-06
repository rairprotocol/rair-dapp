import React from 'react';

import { TButtonMainBlockWrapper } from '../splashConfig.types';
import { StyledButtonMainBlockWrapper } from '../styles/StyledButtonsContainer.styled';

const ButtonMainBlockWrapper: React.FC<TButtonMainBlockWrapper> = ({
  children,
  flexDirection
}) => {
  return (
    <StyledButtonMainBlockWrapper flexDirection={flexDirection}>
      {children}
    </StyledButtonMainBlockWrapper>
  );
};

export default ButtonMainBlockWrapper;
