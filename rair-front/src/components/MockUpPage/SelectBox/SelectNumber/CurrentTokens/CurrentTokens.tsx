import React, { memo } from 'react';
import { useParams } from 'react-router';

import { useAppSelector } from '../../../../../hooks/useReduxHooks';
import { StyledShevronIcon } from '../../../FilteringBlock/FilteringBlockItems/FilteringBlockItems';
import { ICurrentTokensComponent } from '../../selectBox.types';

const CurrentTokensComponent: React.FC<ICurrentTokensComponent> = ({
  isBack,
  isOpen,
  setIsOpen,
  setIsOpens,
  selectedToken,
  handleIsOpen,
  onClickItem,
  numberRef,
  totalCount
}) => {
  const { primaryColor, primaryButtonColor, textColor, iconColor } =
    useAppSelector((store) => store.colors);

  const { secondaryColor, isDarkMode } = useAppSelector(
    (store) => store.colors
  );

  const { tokenId } = useParams();

  return (
    <>
      <div ref={numberRef} className="select-number-container">
        <div
          onClick={handleIsOpen}
          className="select-field"
          style={{
            borderColor: `${
              !isDarkMode
                ? import.meta.env.VITE_TESTNET === 'true'
                  ? 'var(--hot-drops)'
                  : '#E882D5'
                : `color-mix(in srgb, ${secondaryColor}, #888888)`
            }`,

            backgroundColor: `${
              primaryColor === '#dedede'
                ? 'var(--rhyno-40)'
                : `color-mix(in srgb, ${primaryColor} 40%, #888888)`
            }`
          }}>
          <div className="number-item">{selectedToken}</div>
          {isOpen ? (
            <StyledShevronIcon
              rotate="true"
              primaryColor={primaryColor}
              textColor={textColor}
              customSecondaryButtonColor={iconColor}
            />
          ) : (
            <StyledShevronIcon
              primaryColor={primaryColor}
              textColor={textColor}
              customSecondaryButtonColor={iconColor}
            />
          )}
        </div>
        <div
          style={{
            display: `${isOpen ? 'flex' : 'none'}`,
            backgroundColor: `${
              primaryColor === '#dedede'
                ? 'var(--rhyno-40)'
                : `color-mix(in srgb, ${primaryColor} 40%, #888888)`
            }`,
            border: `${primaryColor === 'rhyno' ? '1px solid #D37AD6' : 'none'}`
          }}
          className={`select-number-popup ${
            import.meta.env.VITE_TESTNET === 'true' ? 'hotdrops' : ''
          }`}>
          <div className="select-number-title">
            <div
              className="backClose-current-tokens backClose-current-tokens-back-sign"
              style={{ visibility: isBack ? 'visible' : 'hidden' }}
              onClick={() => {
                setIsOpens?.(false);
                setIsOpen(false);
              }}>
              &#8617;
            </div>
            <div className="serial-number-title">Serial number</div>
            <div
              className="backClose-current-tokens backClose-current-tokens-close-sign"
              onClick={() => setIsOpen(false)}>
              &#10007;
            </div>
          </div>
          {totalCount &&
            totalCount.length > 0 &&
            totalCount.map((el, index) => {
              return (
                <div
                  // className={`select-number-box ${tokenId && Number(tokenId) === el.token ? "selected-box" : ''}`}
                  className={`select-number-box ${
                    tokenId === el.token ? 'selected-box' : ''
                  } ${el.sold ? 'sold-token' : ''}`}
                  data-title={` #${el.token}`}
                  style={{
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
                    color: `${primaryColor === 'rhyno' ? '#fff' : 'A7A6A6'}`,
                    fontWeight: 'bold'
                  }}
                  key={index}
                  onClick={() => onClickItem(el.token)}>
                  {el.sold ? 'Sold' : el.token}
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export const CurrentTokens = memo(CurrentTokensComponent);
