import React from 'react';

import useWindowDimensions from '../../../../hooks/useWindowDimensions';
import { ICusmonShareButton } from '../../mockupPage.types';

const CustomShareButton: React.FC<ICusmonShareButton> = ({
  title,
  handleClick,
  primaryColor,
  isCollectionPathExist,
  moreUnlockablesClassName
}) => {
  const { width } = useWindowDimensions();
  return (
    <button
      onClick={handleClick}
      className={`share-button ${
        moreUnlockablesClassName ? moreUnlockablesClassName : ''
      } ${process.env.REACT_APP_HOTDROPS === 'true' ? 'hotdrops-border' : ''}`}
      style={{
        background: `${
          primaryColor === 'rhyno' ? '#F5F5F5' : 'var(--charcoal)'
        }`,
        color: `${primaryColor === 'rhyno' ? 'var(--charcoal)' : '#FFFFFF'}`,
        minWidth: `${width >= 500 ? '161px' : '124px'}`
      }}>
      {title}
    </button>
  );
};

export default CustomShareButton;
