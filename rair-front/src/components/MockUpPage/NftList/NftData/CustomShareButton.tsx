import React from 'react';

import useWindowDimensions from '../../../../hooks/useWindowDimensions';
import { ICusmonShareButton } from '../../mockupPage.types';

const CustomShareButton: React.FC<ICusmonShareButton> = ({
  title,
  handleClick,
  primaryColor,
  moreUnlockablesClassName
}) => {
  const { width } = useWindowDimensions();
  return (
    <button
      onClick={handleClick}
      className={`share-button ${
        moreUnlockablesClassName ? moreUnlockablesClassName : ''
      } ${import.meta.env.VITE_TESTNET === 'true' ? 'hotdrops-border' : ''}`}
      style={{
        background: `${
          primaryColor === '#dedede' ? '#F5F5F5' : 'var(--charcoal)'
        }`,
        color: `${primaryColor === 'rhyno' ? 'var(--charcoal)' : '#FFFFFF'}`,
        minWidth: `${width >= 500 ? '161px' : '124px'}`
      }}>
      {title}
    </button>
  );
};

export default CustomShareButton;
