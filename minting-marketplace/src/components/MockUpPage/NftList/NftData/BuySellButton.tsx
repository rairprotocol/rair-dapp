import React, { useState } from 'react';
import { ReactComponent as MetamaskFox } from '../../assets/MetamaskFox.svg';
import { IBuySellButton } from '../../mockupPage.types';

export const BuySellButton: React.FC<IBuySellButton> = ({
  title,
  handleClick,
  isColorPurple,
  disabled
}) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  return (
    <button
      className="nft-btn-sell"
      onClick={handleClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        color: !disabled ? '#FFFFFF' : 'var(--charcoal-40)',
        backgroundImage: isColorPurple
          ? !isHovering
            ? `var(--stimorol)`
            : `var(--stimorol-hover)`
          : !disabled
          ? !isHovering
            ? `linear-gradient(96.34deg, #19A7F6 0%, #4099F1 20%, #548AEB 40%, #617BE6 60%, #6B6BE0 80%, #725BDB 100%)`
            : `linear-gradient(266.26deg, #19A7F6 0%, #4099F1 20%, #548AEB 40%, #617BE6 60%, #6B6BE0 80%, #725BDB 100%)`
          : 'var(--charcoal-60)'
      }}>
      <MetamaskFox className="metamask-buy-button" />
      {title}
    </button>
  );
};
