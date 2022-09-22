import React from 'react';
import { TMainTitleBlock } from '../splashConfig.types';
import { StyledMainBlockTitle } from '../styles/MainBlockTextContainer.styled';

const MainTitleBlock: React.FC<TMainTitleBlock> = ({
  color,
  fontSize,
  fontWeight,
  text,
  fontFamily,
  lineHeight,
  margin,
  padding,
  textAlign,
  width
}) => {
  return (
    <StyledMainBlockTitle
      color={color}
      fontSize={fontSize}
      fontWeight={fontWeight}
      fontFamily={fontFamily}
      lineHeight={lineHeight}
      margin={margin}
      padding={padding}
      textAlign={textAlign}
      width={width}>
      {text}
    </StyledMainBlockTitle>
  );
};

export default MainTitleBlock;
