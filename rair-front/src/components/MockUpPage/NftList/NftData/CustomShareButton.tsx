import { FC } from 'react';

import { useAppSelector } from '../../../../hooks/useReduxHooks';
import useWindowDimensions from '../../../../hooks/useWindowDimensions';
import { ICusmonShareButton } from '../../mockupPage.types';

const CustomShareButton: FC<ICusmonShareButton> = ({
  title,
  handleClick,
  moreUnlockablesClassName
}) => {
  const { width } = useWindowDimensions();
  const { isDarkMode } = useAppSelector((store) => store.colors);
  return (
    <button
      onClick={handleClick}
      className={`share-button ${
        moreUnlockablesClassName ? moreUnlockablesClassName : ''
      } ${import.meta.env.VITE_TESTNET === 'true' ? 'hotdrops-border' : ''}`}
      style={{
        background: `${!isDarkMode ? '#F5F5F5' : 'var(--charcoal)'}`,
        color: `${!isDarkMode ? 'var(--charcoal)' : '#FFFFFF'}`,
        minWidth: `${width >= 500 ? '161px' : '124px'}`
      }}>
      {title}
    </button>
  );
};

export default CustomShareButton;
