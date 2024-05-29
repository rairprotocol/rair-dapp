//@ts-nocheck
//unused-component
import React, { useEffect, useState } from 'react';

import { SelectBoxContainer } from './ItemRankItems';

import './styles.css';

const SelectBox = (props) => {
  const [items, setItems] = useState([]);
  const [showItems, setShowItems] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});

  const dropDown = () => {
    setShowItems(!showItems);
  };

  const onSelectItem = (item) => {
    props.selectItem(item.id);
    setSelectedItem(item);
    setShowItems(false);
  };

  const RenderOption = () => {
    if (items.length > 1) {
      return <RenderToken />;
    }
    return <RenderListTokens />;
  };

  useEffect(() => {
    if (items.length === 0 && typeof props.items === 'object') {
      setItems([...props.items]);
      setSelectedItem(props.items[0]);
    }
  }, [props.items, items]);

  const RenderListTokens = () => {
    return (
      <div className="select-box--box">
        <div className="select-box--container">
          <div className="select-box--selected-item">Choose Serial Number</div>
          <div className="select-box--arrow" onClick={dropDown}>
            <span
              className={`${
                showItems ? 'select-box--arrow-up' : 'select-box--arrow-down'
              }`}
            />
          </div>

          <div className={`select-box--items ${!showItem ? 'none' : ''}`}>
            <div
              className="serial-box"
              onClick={(e) => {
                e.preventDefault();
              }}>
              1-100
            </div>
            <div className="serial-box">101-200</div>
            <div className="serial-box">201-300</div>
            <div className="serial-box">301-400</div>
            <div className="serial-box">401-500</div>
            <div className="serial-box">501-600</div>
            <div className="serial-box">601-700</div>
            <div className="serial-box">701-800</div>
            <div className="serial-box">801-900</div>
            <div className="serial-box">901-1000</div>
          </div>
        </div>
      </div>
    );
  };

  const RenderToken = () => {
    return (
      <div className="select-box--box">
        <SelectBoxContainer
          primaryColor={primaryColor}
          className="select-box--container">
          <div className="select-box--selected-item">
            <span>{selectedItem?.pkey}</span>
            {items !== null ? (
              props.selectedToken ? (
                items.map((i) => {
                  if (i.token === props.selectedToken) {
                    return <span key={i.id}>{i.token}</span>;
                  }
                  return null;
                })
              ) : (
                <span>{selectedItem.token}</span>
              )
            ) : (
              'Need to select'
            )}
          </div>
          <div className="select-box--arrow" onClick={dropDown}>
            <span
              className={`${
                showItems ? 'select-box--arrow-up' : 'select-box--arrow-down'
              }`}
            />
          </div>

          <div className={`select-box--items ${!showItem ? 'none' : ''}`}>
            {items !== null &&
              items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectItem(item);
                    props.handleClickToken(item.token);
                  }}
                  className={selectedItem === item ? 'selected' : ''}>
                  <span>{item.pkey}</span>
                  <span>{item.token}</span>
                </div>
              ))}
          </div>
        </SelectBoxContainer>
      </div>
    );
  };

  return <RenderOption />;
};

export default SelectBox;
