//@ts-nocheck
import { useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';

import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
import useWindowDimensions from '../../../hooks/useWindowDimensions';
import {
  GlobalModalContext,
  TGlobalModalContext
} from '../../../providers/ModalProvider';
import { GLOBAL_MODAL_ACTIONS } from '../../../providers/ModalProvider/actions';

import {
  SelectFiltersItem,
  SelectFiltersPopUp,
  SelectSortItem,
  SelectSortPopUp,
  StyledArrowDownIcon,
  StyledArrowUpIcon,
  StyledFilterIcon,
  StyledShevronIcon
} from './FilteringBlockItems/FilteringBlockItems';
import ModalBlockchain from './portal/ModalBlockchain/ModalBlockchain';
import ModalCategories from './portal/ModalCategories/ModalCategories';

import './FilteringBlock.css';

const FilteringBlock = ({
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
  setClick,
  setMetadataFilter,
  tabIndexItems,
  colletionPage
}: any) => {
  const [filterPopUp, setFilterPopUp] = useState(false);
  const [, /*filterItem*/ setFilterItem] = useState('Filters');
  const filterRef = useRef();
  const [filterCloseText, setFilterClose] = useState(false);

  const [sortPopUp, setSortPopUp] = useState(false);
  const sortRef = useRef();

  const { primaryColor, secondaryColor, textColor, iconColor } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);

  const [isOpenCategories, setIsOpenCategories] = useState(false);
  const [isOpenBlockchain, setIsOpenBlockchain] = useState(false);
  const { width /*height*/ } = useWindowDimensions();

  const hotdropsVar = import.meta.env.VITE_TESTNET;

  const { globalModaldispatch } =
    useContext<TGlobalModalContext>(GlobalModalContext);

  const onChangeFilterItem = (item) => {
    setFilterItem(item);
    onChangeFilterPopUp();
  };

  const onChangeFilterPopUp = () => {
    // setFilterPopUp((prev) => !prev);

    setFilterClose((prev) => !prev);
    globalModaldispatch({
      type: GLOBAL_MODAL_ACTIONS.TOGLE_IS_MODAL_OPEN,
      payload: null
    });
  };

  const onChangeSortPopUp = () => {
    setSortPopUp((prev) => !prev);
  };

  const onChangeSortItem = (item) => {
    setSortItem(item);
    onChangeSortPopUp();
  };

  const handleClickOutSideFilter = (e) => {
    if (hotdropsVar !== 'true' && !filterRef.current.contains(e.target)) {
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
  useEffect(() => {
    if (width < 1101) {
      globalModaldispatch({
        type: GLOBAL_MODAL_ACTIONS.CREATE_MODAL,
        payload: {
          isOpen: false
        }
      });
    } else {
      if (hotdropsVar === 'true') {
        globalModaldispatch({
          type: GLOBAL_MODAL_ACTIONS.CREATE_MODAL,
          payload: {
            isOpen: false
          }
        });
      } else {
        globalModaldispatch({
          type: GLOBAL_MODAL_ACTIONS.CREATE_MODAL,
          payload: {
            isOpen: true
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalModaldispatch]);

  return (
    <>
      <div ref={sortRef} className="select-sort-wrapper">
        <SelectSortItem
          onClick={onChangeSortPopUp}
          className={`select-sort ${
            import.meta.env.VITE_TESTNET === 'true' ? 'hotdrops-hover' : ''
          }`}
          primaryColor={primaryColor}
          textColor={textColor}
          secondaryColor={secondaryColor}
          sortPopUp={sortPopUp}>
          <div className="select-sort-title">
            <div className="title-left">
              <div className="arrows-sort">
                <StyledArrowUpIcon
                  textColor={textColor}
                  sortItem={sortItem}
                  primaryColor={primaryColor}
                  customSecondaryButtonColor={iconColor}
                />
                <StyledArrowDownIcon
                  textColor={textColor}
                  customSecondaryButtonColor={iconColor}
                  sortItem={sortItem}
                  primaryColor={primaryColor}
                />
              </div>
              {width > 700 && <div>Sort by name</div>}
            </div>
            {width > 700 && (
              <div
                className={`title-right-arrow ${
                  hotdropsVar === 'true' ? 'hotdrops-color' : ''
                }`}>
                {sortPopUp ? (
                  // <FontAwesome icon={faChevronUp} />
                  <StyledShevronIcon
                    rotate="true"
                    primaryColor={primaryColor}
                    textColor={textColor}
                    customSecondaryButtonColor={iconColor}
                  />
                ) : (
                  // <FontAwesome icon={faChevronDown} />
                  <StyledShevronIcon
                    primaryColor={primaryColor}
                    textColor={textColor}
                    customSecondaryButtonColor={iconColor}
                  />
                )}
              </div>
            )}
          </div>
        </SelectSortItem>
        {sortPopUp && (
          <SelectSortPopUp
            className={`select-sort-title-pop-up`}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            textColor={textColor}>
            {
              <div className="sort-popup-home-page">
                <div
                  className="sotr-item-redesign"
                  onClick={() => onChangeSortItem('up')}>
                  Name: A-Z
                </div>
                <div
                  className="sotr-item-redesign"
                  onClick={() => onChangeSortItem('down')}>
                  Name: Z-A
                </div>
              </div>
            }
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
        <>
          <div ref={filterRef} className="select-filters-wrapper">
            {setMetadataFilter ? (
              <SelectFiltersItem
                className={`select-filters ${
                  hotdropsVar === 'true' ? 'hotdrops-hover' : ''
                } ${tabIndexItems && tabIndexItems !== 0 && 'disabled'}`}
                onClick={() => {
                  if (tabIndexItems === 0) {
                    setMetadataFilter();
                    setFilterClose((prev) => !prev);
                  }
                  if (colletionPage) {
                    setMetadataFilter();
                    setFilterClose((prev) => !prev);
                  }
                }}
                filterPopUp={filterPopUp}
                textColor={textColor}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}>
                <div className="select-filters-title">
                  {width > 1101 ? (
                    <>
                      {filterCloseText ? (
                        <CloseIcon
                          style={{
                            marginRight: '5px',
                            color:
                              import.meta.env.VITE_TESTNET === 'true'
                                ? `${
                                    iconColor === '#1486c5'
                                      ? '#F95631'
                                      : iconColor
                                  }`
                                : filterPopUp
                                  ? '#fff'
                                  : `${
                                      iconColor === '#1486c5'
                                        ? '#E882D5'
                                        : iconColor
                                    }`
                          }}
                        />
                      ) : (
                        <StyledFilterIcon
                          customSecondaryButtonColor={iconColor}
                          primaryColor={primaryColor}
                          textColor={textColor}
                          filterPopUp={filterPopUp}></StyledFilterIcon>
                      )}
                    </>
                  ) : (
                    <StyledFilterIcon
                      customSecondaryButtonColor={iconColor}
                      primaryColor={primaryColor}
                      textColor={textColor}
                      filterPopUp={filterPopUp}></StyledFilterIcon>
                  )}
                  {width > 700 && <span>Filters</span>}
                </div>
              </SelectFiltersItem>
            ) : (
              <SelectFiltersItem
                className={`select-filters ${
                  hotdropsVar === 'true' ? 'hotdrops-hover' : ''
                }`}
                onClick={onChangeFilterPopUp}
                filterPopUp={filterPopUp}
                textColor={textColor}
                primaryColor={primaryColor}>
                <div className="select-filters-title">
                  {width > 1101 ? (
                    <>
                      {filterCloseText ? (
                        <StyledFilterIcon
                          customSecondaryButtonColor={iconColor}
                          primaryColor={primaryColor}
                          textColor={textColor}
                          filterPopUp={filterPopUp}></StyledFilterIcon>
                      ) : (
                        <CloseIcon
                          style={{
                            marginRight: '5px',
                            color:
                              import.meta.env.VITE_TESTNET === 'true'
                                ? `${
                                    iconColor === '#1486c5'
                                      ? '#F95631'
                                      : iconColor
                                  }`
                                : filterPopUp
                                  ? '#fff'
                                  : `${
                                      iconColor === '#1486c5'
                                        ? '#E882D5'
                                        : iconColor
                                    }`
                          }}
                        />
                      )}
                    </>
                  ) : (
                    <StyledFilterIcon
                      customSecondaryButtonColor={iconColor}
                      primaryColor={primaryColor}
                      textColor={textColor}
                      filterPopUp={filterPopUp}></StyledFilterIcon>
                  )}
                  {width > 700 && <span>Filters</span>}
                </div>
              </SelectFiltersItem>
            )}

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
        </>
      )}
    </>
  );
};

export default FilteringBlock;
