import React from 'react';

import { TCardButtonsWrapper } from './splashPage.types.test';

const CardButtonsWrapper: React.FC<TCardButtonsWrapper> = ({
  children,
  className
}) => {
  return <div className={className}>{children}</div>;
};

export default CardButtonsWrapper;
