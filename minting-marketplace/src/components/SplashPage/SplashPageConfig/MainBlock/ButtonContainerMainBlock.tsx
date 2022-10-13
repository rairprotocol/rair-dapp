import React from 'react';

import { TButtonContainerMainBlock } from '../splashConfig.types';
import { StyledButtonContainerMainBlock } from '../styles/StyledButtonsContainer.styled';

const ButtonContainerMainBlock: React.FC<TButtonContainerMainBlock> = ({
  children,
  marginTop,
  height,
  width,
  gap,
  flexDirection
}) => {
  return (
    <StyledButtonContainerMainBlock
      marginTop={marginTop}
      height={height}
      width={width}
      gap={gap}
      flexDirection={flexDirection}>
      {children}
    </StyledButtonContainerMainBlock>
  );
};

export default ButtonContainerMainBlock;
