import React from 'react';

import { TCardImageBlock } from './splashPage.types.test';

const CardImageBlock: React.FC<TCardImageBlock> = ({ className, image }) => {
  return (
    <div className={className}>
      <img
        src={image}
        alt="Mark Kohler card image"
        width="510px"
        height="513px"
      />
    </div>
  );
};

export default CardImageBlock;
