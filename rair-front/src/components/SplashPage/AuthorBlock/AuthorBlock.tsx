import React from 'react';

import { IAuthorBlock } from '../splashPage.types';

const AuthorBlock: React.FC<IAuthorBlock> = ({ children, mainClass }) => {
  return <div className={`information-author ${mainClass}`}>{children}</div>;
};

export default AuthorBlock;
