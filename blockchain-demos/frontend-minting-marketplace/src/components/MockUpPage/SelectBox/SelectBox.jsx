import React, { useEffect, useState } from "react";
import "./styles.css";

const SelectBox = (props) => {
  const [items, setItems] = useState([]);
  const [showItems, setShowItems] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});

  useEffect(()=>{
    if(items.length === 0 && typeof(props.items)==="object"){
      setItems([...props.items])
      setSelectedItem(props.items[0])
    }

  },[props.items, items])

  const dropDown = () => {
    setShowItems(!showItems)
  };

  const selectItem = (item) => {
    setSelectedItem(item)
    setShowItems(false)
  };

    return (
      <div className="select-box--box">
        <div
          style={{ backgroundColor: `var(--${props.primaryColor})` }}
          className="select-box--container"
        >
          <div className="select-box--selected-item">
            <span style={{ paddingRight: "10px" }}>
              {selectedItem?.pkey}
            </span>
            <span>{items !== null ? selectedItem.value : 'Need to select'}</span>
          </div>
          <div className="select-box--arrow" onClick={dropDown}>
            <span
              className={`${
                showItems
                  ? "select-box--arrow-up"
                  : "select-box--arrow-down"
              }`}
            />
          </div>

          <div
            onClick={(e) => {
              if (selectedItem?.pkey) {
                return 0;
              } else {
                props.selectItem(e.target.innerText);
                // console.log(e,'ffff');
              }
            }}
            style={{ display: showItems ? "block" : "none" }}
            className={"select-box--items"}
          >
            {items !== null && items.map((item) => (
              <div
                key={item.id}
                onClick={() => selectItem(item)}
                className={selectedItem === item ? "selected" : ""}
              >
                <span style={{ paddingRight: "10px" }}>{item.pkey}</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

export default SelectBox;
