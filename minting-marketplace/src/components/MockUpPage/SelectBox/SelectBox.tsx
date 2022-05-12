//@ts-nocheck
import React, { useEffect, useState } from "react";

import "./styles.css";

const SelectBox = (props) => {
  const [items, setItems] = useState([]);
  const [showItems, setShowItems] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  // const [moreThen, setMoreThen] = useState();

  useEffect(()=>{
    if(items.length === 0 && typeof(props.items)==="object"){
      setItems([...props.items])
      setSelectedItem(props.items[0])
    }
  }, [props.items, items]);

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

  const RenderListTokens = () => {
    return (
      <div className="select-box--box">
        <div className="select-box--container">
          <div className="select-box--selected-item">Choose Serial Number</div>
          <div className="select-box--arrow" onClick={dropDown}>
            <span
              className={`${showItems ? "select-box--arrow-up" : "select-box--arrow-down"
                }`}
            />
          </div>

          <div
            style={{
              display: showItems ? "flex" : "none",
              flexWrap: "wrap",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              alignContent: "center",
              width: "25rem",
              padding: '10px 0',
              background: '#383637',
              borderRadius: '16px'
            }}
            className={"select-box--items"}
          >
            <div className="serial-box" onClick={(e) => {
              e.preventDefault()
              console.log(123)
            }}>1-100</div>
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
        <div
          style={{ backgroundColor: `var(--${props.primaryColor})` }}
          className="select-box--container"
        >
          <div className="select-box--selected-item">
            <span style={{ paddingRight: "10px" }}>{selectedItem?.pkey}</span>
            {items !== null ? (
              props.selectedToken ? (
                items.map((i) => {
                  if (i.token === props.selectedToken) {
                    return (
                      <span key={i.id}>
                        {/* {i.value}  */}
                        {i.token}
                      </span>
                    );
                  }
                  return null;
                })
              ) : (
                // <span>{selectedItem.value}</span>
                <span>{selectedItem.token}</span>
              )
            ) : (
              "Need to select"
            )}
          </div>
          <div className="select-box--arrow" onClick={dropDown}>
            <span
              className={`${
                showItems ? "select-box--arrow-up" : "select-box--arrow-down"
              }`}
            />
          </div>

          <div
            style={{ display: showItems ? "block" : "none", 
            background: '#383637',
            borderRadius: '16px'
          }}
            className={"select-box--items"}
          >
            {items !== null &&
              items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectItem(item);
                    props.handleClickToken(item.token);
                  }}
                  className={selectedItem === item ? "selected" : ""}
                >
                  <span style={{ paddingRight: "10px" }}>{item.pkey}</span>
                  {/* <span>{item.value}</span> */}
                  <span>{item.token}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <RenderOption />






    // <div className="select-box--box">
    //   <div
    //     style={{ backgroundColor: `var(--${props.primaryColor})` }}
    //     className="select-box--container"
    //   >
    //     <div className="select-box--selected-item">
    //       <span style={{ paddingRight: "10px" }}>{selectedItem?.pkey}</span>
    //       {items !== null ? (
    //         props.selectedToken ? (
    //           items.map((i) => {
    //             if (i.token === props.selectedToken) {
    //               return (
    //                 <span key={i.id}>
    //                   {/* {i.value}  */}
    //                   {i.token}
    //                 </span>
    //               );
    //             }
    //             return null;
    //           })
    //         ) : (
    //           // <span>{selectedItem.value}</span>
    //           <span>{selectedItem.token}</span>
    //         )
    //       ) : (
    //         "Need to select"
    //       )}
    //     </div>
    //     <div className="select-box--arrow" onClick={dropDown}>
    //       <span
    //         className={`${
    //           showItems ? "select-box--arrow-up" : "select-box--arrow-down"
    //         }`}
    //       />
    //     </div>

    //     <div
    //       style={{ display: showItems ? "block" : "none" }}
    //       className={"select-box--items"}
    //     >
    //       {items !== null &&
    //         items.map((item) => (
    //           <div
    //             key={item.id}
    //             onClick={() => {
    //               onSelectItem(item);
    //               props.handleClickToken(item.token);
    //             }}
    //             className={selectedItem === item ? "selected" : ""}
    //           >
    //             <span style={{ paddingRight: "10px" }}>{item.pkey}</span>
    //             {/* <span>{item.value}</span> */}
    //             <span>{item.token}</span>
    //           </div>
    //         ))}
    //     </div>
    //   </div>
    // </div>
  );
};

export default SelectBox;