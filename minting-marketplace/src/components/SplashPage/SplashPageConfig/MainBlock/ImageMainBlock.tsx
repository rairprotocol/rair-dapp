import React from 'react';

import { TImageMainBlock } from '../splashConfig.types';
import { StyledImageBlock } from '../styles/SplashMainBlockStyled.styled';

const ImageMainBlock: React.FC<TImageMainBlock> = ({
  image,
  widthDiff,
  heightDiff,
  imageMargin
}) => {
  return (
    <StyledImageBlock
      widthDiff={widthDiff}
      heightDiff={heightDiff}
      imageMargin={imageMargin}
      src={image}
      alt="Splash page image"
    />
  );
};
export default ImageMainBlock;
