//@ts-nocheck
import React from 'react';

const AuthorBlock = ({ children, mainClass }) => {
  return <div className={`information-author ${mainClass}`}>{children}</div>;
};

export default AuthorBlock;
