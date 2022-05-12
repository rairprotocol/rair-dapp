//@ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import "./FilteringBlock.css";
import ModalBlockchain from "./portal/ModalBlockchain/ModalBlockchain";
import ModalCategories from "./portal/ModalCategories/ModalCategories";

const FilteringBlock = ({
  primaryColor,
  textColor,
  sortItem,
  setSortItem,
  isFilterShow,
  setBlockchain,
  setCategory,
  getContract,
  setIsShow,
  setIsShowCategories,
  setFilterText,
  setFilterCategoriesText,
  click,
  setClick,
}) => {
  const [filterPopUp, setFilterPopUp] = useState(false);
  const [, /*filterItem*/ setFilterItem] = useState("Filters");
  const filterRef = useRef();

  const [sortPopUp, setSortPopUp] = useState(false);
  const sortRef = useRef();

  const [isOpenCategories, setIsOpenCategories] = useState(false);
  const [isOpenBlockchain, setIsOpenBlockchain] = useState(false);

  const onChangeFilterItem = (item) => {
    setFilterItem(item);
    onChangeFilterPopUp();
  };

  const onChangeFilterPopUp = () => {
    setFilterPopUp((prev) => !prev);
  };

  const onChangeSortPopUp = () => {
    setSortPopUp((prev) => !prev);
  };

  const onChangeSortItem = (item) => {
    setSortItem(item);
    onChangeSortPopUp();
  };

  const handleClickOutSideFilter = (e) => {
    if (!filterRef.current.contains(e.target)) {
      setFilterPopUp(false);
    }
  };

  const handleClickOutSideSort = (e) => {
    if (!sortRef.current.contains(e.target)) {
      setSortPopUp(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutSideFilter);
    return () =>
      document.removeEventListener("mousedown", handleClickOutSideFilter);
  });

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutSideSort);
    return () =>
      document.removeEventListener("mousedown", handleClickOutSideSort);
  });

  return (
    <>
      {!isFilterShow ? (
        <div ref={filterRef} className="emptyFilter">
          {" "}
        </div>
      ) : (
        <div ref={filterRef} className="select-filters-wrapper">
          <div
            style={{
              backgroundColor: `${filterPopUp ? "#E882D5" : `var(--${primaryColor})`
                }`,
              color: `${filterPopUp ? "#fff" : `var(--${textColor})`}`,
              border: `${filterPopUp ? "1px solid #E882D5" : ""}`,
            }}
            className="select-filters"
            onClick={onChangeFilterPopUp}
          >
            <div className="select-filters-title">
              <i
                style={{
                  color: `${filterPopUp ? "#fff" : "#E882D5"}`,
                }}
                className="fas fa-sliders-h"
              ></i>
              Filters
            </div>
          </div>

          {filterPopUp && (
            <div
              style={{
                backgroundColor: `var(--${primaryColor})`,
                zIndex: 100,
              }}
              className="select-filters-popup"
            >
              <div
                onClick={() => {
                  onChangeFilterItem("Price");
                  setIsOpenBlockchain(true);
                }}
                className="select-filters-item"
              >
                Blockchain
              </div>
              {/* <div
                onClick={() => onChangeFilterItem("Creator")}
                className="select-filters-item"
              >
                Creator
              </div> */}
              <div
                onClick={() => {
                  onChangeFilterItem("Metadata");
                  setIsOpenCategories(true);
                }}
                className="select-filters-item"
              >
                Categories
              </div>
            </div>
          )}
        </div>
      )}
      <div ref={sortRef} className="select-sort-wrapper">
        <div
          onClick={onChangeSortPopUp}
          style={{
            backgroundColor: `var(--${primaryColor})`,
            color: `var(--${textColor})`,
            border: `${sortPopUp ? "1px solid #E882D5" : ""}`,
          }}
          className="select-sort"
        >
          <div className="select-sort-title">
            <div className="title-left">
              <div className="arrows-sort">
                <i
                  style={{
                    color: `${sortItem === "up" ? "#E882D5" : "#A7A6A6"}`,
                  }}
                  className="fas fa-arrow-up"
                ></i>
                <i
                  style={{
                    color: `${sortItem === "down" ? "#E882D5" : "#A7A6A6"}`,
                  }}
                  className="fas fa-arrow-down"
                ></i>
              </div>
              <div>Sort by name</div>
            </div>
            <div className="title-right-arrow">
              {sortPopUp ? (
                <i className="fas fa-chevron-up"></i>
              ) : (
                <i className="fas fa-chevron-down"></i>
              )}
            </div>
          </div>
        </div>
        {sortPopUp && (
          <div
            style={{
              backgroundColor: `var(--${primaryColor})`,
              color: `var(--${textColor})`,
            }}
            className="select-sort-title-pop-up"
          // onClick={() => onChangeSortItem(<i className="fas fa-sort-amount-up"></i>)}
          >
            {sortItem === "up" ? (
              <div
                onClick={() => onChangeSortItem("down")}
                className="select-sort-item"
              >
                <i className="fas fa-arrow-down"></i>
              </div>
            ) : (
              <div
                onClick={() => onChangeSortItem("up")}
                className="select-sort-item"
              >
                <i className="fas fa-arrow-up"></i>
              </div>
            )}
          </div>
        )}
        <ModalCategories
          click={click}
          isOpenCategories={isOpenCategories}
          setIsOpenCategories={setIsOpenCategories}
          setCategory={setCategory}
          setClick={setClick}
          setIsShowCategories={setIsShowCategories}
          setFilterCategoriesText={setFilterCategoriesText}
        />
        <ModalBlockchain
          click={click}
          isOpenBlockchain={isOpenBlockchain}
          setBlockchain={setBlockchain}
          setClick={setClick}
          setIsOpenBlockchain={setIsOpenBlockchain}
          setIsShow={setIsShow}
          setFilterText={setFilterText}
          getContract={getContract}
        />
      </div>
    </>
  );
};

export default FilteringBlock;
