import React from 'react';

import { StyledSplashCardText } from './StyledSplashCardText';

import { TSplashCardText } from '../../splashConfig.types';

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
