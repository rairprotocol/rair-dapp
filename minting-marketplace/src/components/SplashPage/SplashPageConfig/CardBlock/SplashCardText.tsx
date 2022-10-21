import React from 'react';

import { TSplashCardText } from '../splashConfig.types';
import { StyledSplashCardText } from '../styles/MainBlockTextContainer.styled';

const SplashCardText: React.FC<TSplashCardText> = ({
  color,
  fontSize,
  fontWeight,
  text,
  fontFamily,
  lineHeight,
  marginBottom,
  padding,
  textAlign,
  width,
  mediafontSize
}) => {
  return (
    <StyledSplashCardText
      color={color}
      fontSize={fontSize}
      fontWeight={fontWeight}
      fontFamily={fontFamily}
      lineHeight={lineHeight}
      marginBottom={marginBottom}
      padding={padding}
      textAlign={textAlign}
      width={width}
      mediafontSize={mediafontSize}>
      {text}
    </StyledSplashCardText>
  );
};

export default SplashCardText;
