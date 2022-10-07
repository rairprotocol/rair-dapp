import React, { useCallback } from 'react';

import { TButtonMainBlock } from '../splashConfig.types';
import {
  StyledButtonImage,
  StyledButtonMainBlock
} from '../styles/StyledButtonsContainer.styled';
import { hyperlink } from '../utils/hyperLink';

const ButtonMainBlock: React.FC<TButtonMainBlock> = ({
  buttonData,
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
  flexGrow
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
    } else {
      buttonLink && hyperlink(buttonLink);
    }
  }, [buttonAction, buttonLink]);

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
      {buttonCustomLogo && buttonCustomLogo}
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
