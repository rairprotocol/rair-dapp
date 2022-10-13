import React from 'react';

import { TSplashPageCardWrapperTest } from './splashPage.types.test';

const SplashPageCardWrapper: React.FC<TSplashPageCardWrapperTest> = ({
  children,
  className
}) => {
  return <div className={className}>{children}</div>;
};

export default SplashPageCardWrapper;
