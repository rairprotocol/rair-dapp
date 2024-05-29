import { useSelector } from 'react-redux';

import { RootState } from '../../../../ducks';
import { ColorStoreType } from '../../../../ducks/colors/colorStore.types';
// import MetamaskFox from '../../assets/MetamaskFox.svg?react';
import { IBuySellButton } from '../../mockupPage.types';

export const BuySellButton: React.FC<IBuySellButton> = ({
  title,
  handleClick,
  disabled
}) => {
  const { textColor, primaryButtonColor, primaryColor } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);

  return (
    <button
      className="nft-btn-sell rair-button"
      onClick={handleClick}
      disabled={disabled}
      style={{
        color: textColor,
        background: `${
          primaryColor === '#dedede'
            ? import.meta.env.VITE_TESTNET === 'true'
              ? 'var(--hot-drops)'
              : 'linear-gradient(to right, #e882d5, #725bdb)'
            : import.meta.env.VITE_TESTNET === 'true'
              ? primaryButtonColor ===
                'linear-gradient(to right, #e882d5, #725bdb)'
                ? 'var(--hot-drops)'
                : primaryButtonColor
              : primaryButtonColor
        }`,
        border: `solid 1px ${textColor}`
      }}>
      <span className="button-buy-sell-text">{title}</span>
    </button>
  );
};
