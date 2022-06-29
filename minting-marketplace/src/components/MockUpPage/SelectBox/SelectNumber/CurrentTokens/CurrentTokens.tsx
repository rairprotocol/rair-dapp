//@ts-nocheck
import React, { memo } from 'react';

const CurrentTokensComponent = ({
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
              primaryColor === 'rhyno' ? 'var(--rhyno)' : '#383637'
            }`
          }}>
          <div className="number-item">{selectedToken}</div>
          <div className="select-number-arrow">
            <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
          </div>
        </div>
        <div
          style={{
            display: `${isOpen ? 'grid' : 'none'}`,
            background: `${
              primaryColor === 'rhyno' ? 'var(--rhyno)' : '#383637'
            }`,
            border: `${primaryColor === 'rhyno' ? '1px solid #D37AD6' : 'none'}`
            //  overflowY: 'auto',
          }}
          className="select-number-popup">
          <div className="select-number-title">
            Serial number
            <span
              className="backClose-current-tokens"
              onClick={() => setIsOpen(false)}
              style={{
                float: 'right',
                display: 'inline-block',
                cursor: 'pointer',
                paddingRight: '30px'
              }}>
              &#10007;
            </span>
            {isBack ? (
              <span
                className="backClose-current-tokens"
                onClick={() => setIsOpens(false)}
                style={{
                  float: 'left',
                  display: 'inline-block',
                  cursor: 'pointer',
                  paddingLeft: '30px'
                }}>
                &#8617;
              </span>
            ) : null}
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
                      primaryColor === 'rhyno' ? '#A7A6A6' : 'grey'
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
