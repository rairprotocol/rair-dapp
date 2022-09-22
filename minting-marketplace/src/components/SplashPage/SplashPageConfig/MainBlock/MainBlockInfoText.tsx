import React from 'react';
import { TMainBlockInfoText } from '../splashConfig.types';
import { StyledMainBlockTextContainer } from '../styles/MainBlockTextContainer.styled';

const MainBlockInfoText: React.FC<TMainBlockInfoText> = ({
  children,
  margin
}) => {
  return (
    <StyledMainBlockTextContainer margin={margin}>
      {children}
    </StyledMainBlockTextContainer>
  );
};

export default MainBlockInfoText;
