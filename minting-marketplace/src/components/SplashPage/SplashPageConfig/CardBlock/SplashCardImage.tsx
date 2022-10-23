import React from 'react';

import { TSplashCardImage } from '../splashConfig.types';
import { StyledSplashCardImage } from '../styles/SplashMainBlockStyled.styled';

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
