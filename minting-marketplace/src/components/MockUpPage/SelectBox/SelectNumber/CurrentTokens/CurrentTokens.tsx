import React, { memo } from 'react';
import { ICurrentTokensComponent } from '../../selectBox.types';
import { ReactComponent as ArrowDown } from '../../../assets/ArrowDown.svg';
import { ReactComponent as ArrowUp } from '../../../assets/ArrowUp.svg';

const CurrentTokensComponent: React.FC<ICurrentTokensComponent> = ({
  primaryColor,
  items,
  isBack,
  isOpen,
  setIsOpen,
  setIsOpens,
  selectedToken,
  selectedItem,
  handleIsOpen,
  onClickItem,
  numberRef
}) => {
  return (
    <>
      <div ref={numberRef} className="select-number-container">
        <div
          onClick={handleIsOpen}
          className="select-field"
          style={{
            background: `${
              primaryColor === 'rhyno' ? 'var(--rhyno-40)' : '#383637'
            }`
          }}>
          <div className="number-item">{selectedToken}</div>
          {isOpen ? (
            <ArrowUp className="arrow-select" />
          ) : (
            <ArrowDown className="arrow-select" />
          )}
        </div>
        <div
          style={{
            display: `${isOpen ? 'flex' : 'none'}`,
            background: `${
              primaryColor === 'rhyno' ? 'var(--rhyno-40)' : '#383637'
            }`,
            border: `${primaryColor === 'rhyno' ? '1px solid #D37AD6' : 'none'}`
          }}
          className="select-number-popup">
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
          {items &&
            items.map((el) => {
              return (
                <div
                  className={`select-number-box ${
                    selectedItem === el.token ? 'selected-box' : ''
                  } ${
                    el.sold ? 'sold-token' : el.isMinted ? 'sold-token' : ''
                  }`}
                  data-title={` #${el.token}`}
                  style={{
                    background: `${
                      primaryColor === 'rhyno' ? '#7A797A' : 'grey'
                    }`,
                    color: `${primaryColor === 'rhyno' ? '#fff' : 'A7A6A6'}`
                  }}
                  key={el._id ? el._id : el.id}
                  onClick={() => onClickItem(el.token)}>
                  {el.sold ? 'Sold' : el.isMinted ? 'Sold' : el.token}
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export const CurrentTokens = memo(CurrentTokensComponent);
