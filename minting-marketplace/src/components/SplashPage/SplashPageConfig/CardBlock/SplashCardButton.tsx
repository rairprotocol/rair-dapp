import React, { useCallback } from 'react';

import { TSplashCardButton } from '../splashConfig.types';
import {
  StyledButtonImage,
  StyledSplashCardButton
} from '../styles/StyledButtonsContainer.styled';

const SplashCardButton: React.FC<TSplashCardButton> = ({
  width,
  borderRadius,
  margin,
  height,
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  background,
  border,
  color,
  flexGrow,
  padding,
  buttonLabel,
  buttonAction,
  buttonImg
}) => {
  const handleButtonClick = useCallback(() => buttonAction?.(), [buttonAction]);

  return (
    <StyledSplashCardButton
      flexGrow={flexGrow}
      width={width}
      borderRadius={borderRadius}
      margin={margin}
      padding={padding}
      height={height}
      fontFamily={fontFamily}
      fontWeight={fontWeight}
      fontSize={fontSize}
      lineHeight={lineHeight}
      background={background}
      color={color}
      border={border}
      onClick={handleButtonClick}>
      {buttonImg && <StyledButtonImage src={buttonImg} alt="metamask-logo" />}
      {buttonLabel}
    </StyledSplashCardButton>
  );
};

export default SplashCardButton;
