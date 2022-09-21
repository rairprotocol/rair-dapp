import React from 'react';
import { TMainTitleBlock } from '../splashConfig.types';
import { StyledMainBlockTitle } from '../styles/MainBlockTextContainer';

const MainTitleBlock: React.FC<TMainTitleBlock> = ({
  color,
  fontSize,
  fontWeight,
  text,
  fontFamily,
  lineHeight,
  textMargin,
  textPadding
}) => {
  return (
    <StyledMainBlockTitle
      color={color}
      fontSize={fontSize}
      fontWeight={fontWeight}
      fontFamily={fontFamily}
      lineHeight={lineHeight}
      textMargin={textMargin}
      textPadding={textPadding}>
      {text}
    </StyledMainBlockTitle>
  );
};

export default MainTitleBlock;
