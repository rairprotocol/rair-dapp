import React from 'react';
import { IMainBlockDescription } from '../splashConfig.types';
import { StyledMainBlockDescription } from '../styles/MainBlockTextContainer.styled';

const MainBlockDescription: React.FC<IMainBlockDescription> = ({
  description,
  marginTop,
  marginBottom
}) => {
  return (
    <StyledMainBlockDescription
      marginTop={marginTop}
      marginBottom={marginBottom}>
      {description}
    </StyledMainBlockDescription>
  );
};

export default MainBlockDescription;
