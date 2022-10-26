import React from 'react';

import { StyledSplashVideoText } from './StyledSplashVideoText';

import { TSplashVideoText } from '../../splashConfig.types';

const SplashVideoText: React.FC<TSplashVideoText> = ({ text, className }) => {
  return (
    <StyledSplashVideoText className={className}>{text}</StyledSplashVideoText>
  );
};

export default SplashVideoText;
