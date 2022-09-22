import React from 'react';
import { TButtonContainerMainBlock } from '../splashConfig.types';
import { StyledButtonContainerMainBlock } from '../styles/StyledButtonsContainer.styled';

const ButtonContainerMainBlock: React.FC<TButtonContainerMainBlock> = ({
  children,
  margin,
  height,
  width,
  gap
}) => {
  return (
    <StyledButtonContainerMainBlock
      margin={margin}
      height={height}
      width={width}
      gap={gap}>
      {children}
    </StyledButtonContainerMainBlock>
  );
};

export default ButtonContainerMainBlock;
