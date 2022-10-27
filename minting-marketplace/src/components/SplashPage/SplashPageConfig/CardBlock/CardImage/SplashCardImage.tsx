import React from 'react';

import { StyledSplashCardImage } from './StyledSplashCardImage';

import { TSplashCardImage } from '../../splashConfig.types';

const SplashCardImage: React.FC<TSplashCardImage> = ({
  image,
  imageMargin
}) => {
  return (
    <StyledSplashCardImage
      imageMargin={imageMargin}
      src={image}
      alt="Splash page image"
    />
  );
};
export default SplashCardImage;
