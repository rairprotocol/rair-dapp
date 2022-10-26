import React, { useCallback } from 'react';

import { StyledButtonImage } from './StyledButtonImage';
import { StyledSplashCardButton } from './StyledSplashCardButton';

import { TSplashCardButton } from '../../splashConfig.types';

const SplashCardButton: React.FC<TSplashCardButton> = ({
  buttonLabel,
  buttonAction,
  buttonImg,
  className
}) => {
  const handleButtonClick = useCallback(() => buttonAction?.(), [buttonAction]);

  return (
    <StyledSplashCardButton className={className} onClick={handleButtonClick}>
      {buttonImg && <StyledButtonImage src={buttonImg} alt="metamask-logo" />}
      {buttonLabel}
    </StyledSplashCardButton>
  );
};

export default SplashCardButton;
