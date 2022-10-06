import React from 'react';

import { TMainBlockInfoText } from '../splashConfig.types';
import { StyledMainBlockTextContainer } from '../styles/MainBlockTextContainer.styled';

const MainBlockInfoText: React.FC<TMainBlockInfoText> = ({
  children,
  padding
}) => {
  return (
    <StyledMainBlockTextContainer padding={padding}>
      {children}
    </StyledMainBlockTextContainer>
  );
};

export default MainBlockInfoText;
