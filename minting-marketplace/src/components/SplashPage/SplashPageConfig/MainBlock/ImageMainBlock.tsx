import React from 'react';

import { TImageMainBlock } from '../splashConfig.types';
import { StyledImageBlock } from '../styles/SplashMainBlockStyled.styled';

const ImageMainBlock: React.FC<TImageMainBlock> = ({ image, imageMargin }) => {
  return (
    <StyledImageBlock
      imageMargin={imageMargin}
      src={image}
      alt="Splash page image"></StyledImageBlock>
  );
};
export default ImageMainBlock;
