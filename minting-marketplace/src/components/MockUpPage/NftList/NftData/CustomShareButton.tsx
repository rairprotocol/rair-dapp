import React from 'react';
import { ICusmonShareButton } from '../../mockupPage.types';

const CustomShareButton: React.FC<ICusmonShareButton> = ({
  title,
  handleClick,
  primaryColor,
  isCollectionPathExist,
  moreUnlockablesClassName
}) => {
  return (
    <button
      onClick={handleClick}
      className={`share-button ${moreUnlockablesClassName}`}
      style={{
        background: `${
          primaryColor === 'rhyno' ? '#F5F5F5' : 'var(--charcoal)'
        }`,
        color: `${primaryColor === 'rhyno' ? 'var(--charcoal)' : '#FFFFFF'}`,
        minWidth: `${isCollectionPathExist ? '161px' : '124px'}`
      }}>
      {title}
    </button>
  );
};

export default CustomShareButton;
