//@ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import useWindowDimensions from '../../../hooks/useWindowDimensions';
import './FilteringBlock.css';
import {
  SelectFiltersItem,
  SelectFiltersPopUp,
  SelectSortItem,
  SelectSortPopUp,
  StyledFilterIcon,
  StyledArrowUpIcon,
  StyledArrowDownIcon,
  StyledShevronIcon,
  StyledPopupArrowUpIcon,
  StyledPopupArrowDownIcon
} from './FilteringBlockItems/FilteringBlockItems';
import ModalBlockchain from './portal/ModalBlockchain/ModalBlockchain';
import ModalCategories from './portal/ModalCategories/ModalCategories';

const FilteringBlock = ({
  primaryColor,
  textColor,
  sortItem,
  setSortItem,
  isFilterShow,
  setBlockchain,
  setCategory,
  setIsShow,
  setIsShowCategories,
  setFilterText,
  setFilterCategoriesText,
  click,
  setClick
}: any) => {
  const [filterPopUp, setFilterPopUp] = useState(false);
  const [, /*filterItem*/ setFilterItem] = useState('Filters');
  const filterRef = useRef();

  const [sortPopUp, setSortPopUp] = useState(false);
  const sortRef = useRef();

  const [isOpenCategories, setIsOpenCategories] = useState(false);
  const [isOpenBlockchain, setIsOpenBlockchain] = useState(false);
  const { width /*height*/ } = useWindowDimensions();

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
    document.addEventListener('mousedown', handleClickOutSideFilter);
    return () =>
      document.removeEventListener('mousedown', handleClickOutSideFilter);
  });

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutSideSort);
    return () =>
      document.removeEventListener('mousedown', handleClickOutSideSort);
  });

  return (
    <>
      <div ref={sortRef} className="select-sort-wrapper">
        <SelectSortItem
          onClick={onChangeSortPopUp}
          className="select-sort"
          primaryColor={primaryColor}
          textColor={textColor}
          sortPopUp={sortPopUp}>
          <div className="select-sort-title">
            <div className="title-left">
              <div className="arrows-sort">
                <StyledArrowUpIcon
                  sortItem={sortItem}
                  className="fas fa-arrow-up"
                />
                <StyledArrowDownIcon
                  sortItem={sortItem}
                  className="fas fa-arrow-down"
                />
              </div>
              {width > 700 && <div>Sort by name</div>}
            </div>
            {width > 700 && (
              <div className="title-right-arrow">
                {sortPopUp ? (
                  // <i className="fas fa-chevron-up"></i>
                  <StyledShevronIcon
                    className="fas fa-chevron-down"
                    rotate="true"
                  />
                ) : (
                  // <i className="fas fa-chevron-down"></i>
                  <StyledShevronIcon className="fas fa-chevron-up" />
                )}
              </div>
            )}
          </div>
        </SelectSortItem>
        {sortPopUp && (
          <SelectSortPopUp
            className="select-sort-title-pop-up"
            primaryColor={primaryColor}
            textColor={textColor}>
            {sortItem === 'up' ? (
              <div
                onClick={() => onChangeSortItem('down')}
                className="select-sort-item">
                <StyledPopupArrowDownIcon />
                {/* <i className="fas fa-arrow-down"></i> */}
              </div>
            ) : (
              <div
                onClick={() => onChangeSortItem('up')}
                className="select-sort-item">
                <StyledPopupArrowUpIcon />
                {/* <i className="fas fa-arrow-up"></i> */}
              </div>
            )}
          </SelectSortPopUp>
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
        />
      </div>
      {!isFilterShow ? (
        <div ref={filterRef} className="emptyFilter">
          {' '}
        </div>
      ) : (
        <div ref={filterRef} className="select-filters-wrapper">
          <SelectFiltersItem
            className="select-filters"
            onClick={onChangeFilterPopUp}
            filterPopUp={filterPopUp}
            textColor={textColor}
            primaryColor={primaryColor}>
            <div className="select-filters-title">
              <StyledFilterIcon
                // className="fas fa-sliders-h"
                filterPopUp={filterPopUp}></StyledFilterIcon>
              {width > 700 && <span>Filters</span>}
            </div>
          </SelectFiltersItem>
          {filterPopUp && (
            <SelectFiltersPopUp
              className="select-filters-popup"
              primaryColor={primaryColor}>
              <div
                onClick={() => {
                  onChangeFilterItem('Price');
                  setIsOpenBlockchain(true);
                }}
                className="select-filters-item">
                Blockchain
              </div>
              <div
                onClick={() => {
                  onChangeFilterItem('Metadata');
                  setIsOpenCategories(true);
                }}
                className="select-filters-item">
                Categories
              </div>
            </SelectFiltersPopUp>
          )}
        </div>
      )}
    </>
  );
};

export default FilteringBlock;
