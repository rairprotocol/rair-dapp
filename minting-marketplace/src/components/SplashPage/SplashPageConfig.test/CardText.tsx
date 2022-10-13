import React from 'react';

import { TCardText } from './splashPage.types.test';

const CardText: React.FC<TCardText> = ({ className, text }) => {
  return <div className={className}>{text}</div>;
};

export default CardText;
