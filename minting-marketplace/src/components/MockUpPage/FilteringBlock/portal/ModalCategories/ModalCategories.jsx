//@ts-nocheck
import React, { useState } from "react";
import Modal from "../../modal";
// import BlockMinMax from "../BlockMinMax/BlockMinMax";

const categories = [
  {
    name: "Music",
    clicked: false,
  },
  {
    name: "Art",
    clicked: false,
  },
  {
    name: "Conference",
    clicked: false,
  },
  {
    name: "Science",
    clicked: false,
  },
];

const ModalCategories = ({
  setFilterCategoriesText,
  setIsOpenCategories,
  isOpenCategories,
  setCategory,
  setClick,
  setIsShowCategories,
  click,
}) => {
  const [arrCategories /*setArrCategories*/] = useState(categories);
  const [, /*clearAll*/ setClearAll] = useState(false);

  const onChangeClicked = (name) => {
    setClick(name);
    setClearAll(false);
    setIsShowCategories(1);
    setFilterCategoriesText(name);

    // const updatedCategory = arrCategories.map((cat, index) => {
    //     if (name === cat.name) {
    //         return {
    //             ...cat,
    //             clicked: !cat.clicked
    //         }
    //     }
    //     else {
    //         return {
    //             ...cat
    //         }
    //     }
    // })
    // setClearAll(false)
    // setArrCategories(updatedCategory);
  };

  const clearAllFilters = () => {
    setCategory(null);
    setClearAll(true);
    setIsShowCategories(false);
    setClick(null);

    // const clearArrCategories = arrCategories.map((cat) => {
    //     return {
    //         ...cat,
    //         clicked: false
    //     }
    // })
    // setArrCategories(clearArrCategories);
    // setClearAll(true);
  };

  const onCloseModal = () => {
    setIsOpenCategories(false);
    // clearAllFilters()
    setClearAll(true);
  };

  const onClickButton = (data) => {
    onChangeClicked(data.name);
    setCategory(data.name);
  };

  const onClickApply = () => {
    // getContract();
    onCloseModal();
  };

  return (
    <Modal onClose={onCloseModal} open={isOpenCategories}>
      <div className="modal-content-metadata">
        <div className="block-close">
          <button className="modal-content-close" onClick={onCloseModal}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-filtering">
          <div className="categories-wraper">
            <div className="modal-filtering-title">
              <h4>Categories</h4>
            </div>
            <div className="filtering-categories">
              {arrCategories.map((c) => {
                return (
                  <button
                    className={`${
                      click === c.name ? "categories-clicked" : ""

                      // c.clicked ? "categories-clicked" : ""
                    }`}
                    key={c.name}
                    // onClick={() => onChangeClicked(c.name)}
                    onClick={() => onClickButton(c)}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="price-wrapper">
            {/* <div className="modal-filtering-price-title">
              <h4>Price</h4>
            </div> */}
            {/* <div className="filtering-price">
              <select className="select-price">
                <option value="0">Select</option>
                <option value="1">Ethereum(ETH)</option>
                <option value="2">Bitcoin(BTC)</option> */}
            {/* <span className="price-arrow"><i className="fas fa-chevron-down"></i></span> */}
            {/* </select>
              <BlockMinMax clearAll={clearAll} />
            </div> */}
          </div>
        </div>
        <hr />
        <div className="modal-filtering-btn">
          <button
            className="modal-filtering-clear-btn"
            onClick={() => {
              clearAllFilters();
            }}
          >
            Clear
          </button>
          <button
            className="modal-filtering-apply-btn"
            onClick={() => {
              onClickApply();
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalCategories;
