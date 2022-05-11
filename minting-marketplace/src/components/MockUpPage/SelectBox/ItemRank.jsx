//@ts-nocheck
import React, { useEffect, useState, useRef } from "react";
// import { useHistory } from "react-router-dom";

import "./styles.css";

const ItemRank = ({ items, primaryColor, selectedToken }) => {
  const [itemsToken, setItemsToken] = useState([]);
  const [showItems, setShowItems] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});

  const rankRef = useRef();

  useEffect(() => {
    if (itemsToken.length === 0 && typeof items === "object") {
      setItemsToken([...items]);
      setSelectedItem(items[0]);
    }
  }, [items, itemsToken]);

  const dropDown = () => {
    setShowItems(!showItems);
  };

  const onSelectItem = (item) => {
    // props.selectItem(item.id);
    setSelectedItem(item);
    setShowItems(false);
  };


  const handleClickOutSideItemRank = (e) => {
    if (!rankRef.current.contains(e.target)) {
      setShowItems(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutSideItemRank);
    return () => document.removeEventListener('mousedown', handleClickOutSideItemRank);
  })

  return (
    <div ref={rankRef} className="item-rant--box">
      <div
        style={{ backgroundColor: `${primaryColor === "rhyno" ? "var(--rhyno)" : "#383637"}` }}
        className="item-rank--container"
      >
        <div className="select-box--selected-item" onClick={dropDown}>
          <span style={{ paddingRight: "10px" }}>{selectedItem?.pkey}</span>
          {itemsToken !== null ? (
            selectedToken ? (
              itemsToken.map((i) => {
                if (i.token === selectedToken) {
                  return <span key={i.id}>
                    {i.value}
                    {/* {i.token} */}
                  </span>;
                }
                return null;
              })
            ) : (
              <span>{selectedItem.value}</span>
            )
          ) : (
            "Need to select"
          )}
          {/* <span>{items !== null ? selectedItem.value : 'Need to select'}</span> */}
        </div>
        <div className="select-box--arrow">
          <i className={`fas fa-chevron-${showItems ? "up" : "down"}`}></i>
          {/* <span
            className={`${showItems ? "select-box--arrow-up" : "select-box--arrow-down"
              }`}
          /> */}
        </div>

        <div
          style={{
            display: showItems ? "block" : "none",
            backgroundColor: `${primaryColor === "rhyno" ? "var(--rhyno)" : "#383637"}`,
            border: `${primaryColor === "rhyno" ? "1px solid #D37AD6" : "none"}`,
            position: "relative",
            zIndex: "10"
          }}
          className={"select-box--items items-rank"}
        >
          {itemsToken !== null &&
            itemsToken.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectItem(item)
                  // props.handleClickToken(item.token)
                }}
                className={selectedItem === item ? "selected" : ""}
              >
                <span style={{ paddingRight: "10px" }}>{item.pkey}</span>
                <span>{item.value}</span>
                {/* <span>{item.token}</span> */}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ItemRank;
