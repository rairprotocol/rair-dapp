import React, { useCallback } from 'react';

import { TButtonMainBlock } from '../splashConfig.types';
import {
  StyledButtonImage,
  StyledButtonLogo,
  StyledButtonMainBlock
} from '../styles/StyledButtonsContainer.styled';
import { hyperlink } from '../utils/hyperLink';

const ButtonMainBlock: React.FC<TButtonMainBlock> = ({
  buttonData,
  handleClick,
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
  buttonImageWidth,
  buttonImageHeight,
  buttonImageMarginRight,
  flexGrow,
  buttonLogoMarginRight
}) => {
  const {
    buttonLabel,
    buttonImg,
    buttonCustomLogo,
    buttonLink,
    buttonAction,
    buttonTextColor,
    buttonColor
  } = buttonData || {};

  const handleButtonClick = useCallback(() => {
    if (buttonAction) {
      buttonAction();
    } else if (buttonLink) {
      hyperlink(buttonLink);
    } else {
      handleClick?.();
    }
  }, [buttonAction, buttonLink, handleClick]);

  return (
    <StyledButtonMainBlock
      flexGrow={flexGrow}
      width={width}
      borderRadius={borderRadius}
      margin={margin}
      height={height}
      fontFamily={fontFamily}
      fontWeight={fontWeight}
      fontSize={fontSize}
      lineHeight={lineHeight}
      background={buttonColor ? buttonColor : background}
      color={buttonTextColor ? buttonTextColor : color}
      border={border}
      onClick={handleButtonClick}>
      {buttonCustomLogo && (
        <StyledButtonLogo buttonLogoMarginRight={buttonLogoMarginRight}>
          {buttonCustomLogo}
        </StyledButtonLogo>
      )}
      {buttonImg && (
        <StyledButtonImage
          buttonImageWidth={buttonImageWidth}
          buttonImageHeight={buttonImageHeight}
          buttonImageMarginRight={buttonImageMarginRight}
          src={buttonImg}
          alt="metamask-logo"
        />
      )}
      {buttonLabel}
    </StyledButtonMainBlock>
  );
};

export default ButtonMainBlock;
