import React from 'react';

import { TCardTextBlock } from './splashPage.types.test';

const CardTextBlock: React.FC<TCardTextBlock> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

export default CardTextBlock;
