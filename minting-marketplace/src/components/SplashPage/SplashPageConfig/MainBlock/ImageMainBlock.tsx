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
      src={image}
      alt="splash page image"
      widthDiff={widthDiff}
      heightDiff={heightDiff}
      imageMargin={imageMargin}
    />
  );
};
export default ImageMainBlock;
