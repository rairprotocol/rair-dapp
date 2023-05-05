//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import NftList from './ListOffers';

import { getCurrentPageEnd } from '../../ducks/pages/actions';

const ResalePage: React.FC = () => {
  const dispatch = useDispatch();
  const [blockchain, setBlockchain] = useState(null);
  const [category, setCategory] = useState(null);
  const [isShow, setIsShow] = useState(false);
  const [isShowCategories, setIsShowCategories] = useState(false);
  const [filterText] = useState('');
  const [filterCategoriesText] = useState('');
  const { resales } = useSelector((store) => store.resalesStore);
  const { primaryColor } = useSelector((store) => store.colorStore);

  const clearFilter = () => {
    setBlockchain(null);
    setClick(null);
    setIsShow(false);
    dispatch(getCurrentPageEnd());
  };

  const clearCategoriesFilter = () => {
    setCategory(null);
    setClick(null);
    setIsShowCategories(false);
    dispatch(getCurrentPageEnd());
  };

  useEffect(() => {
    if (blockchain || category) {
      dispatch(getCurrentPageEnd());
    }
  }, [blockchain, category, dispatch]);

  useEffect(() => {
    const params = {};
    dispatch({ type: 'GET_RESALES_LIST_START', params: params });
  }, [dispatch]);

  return (
    <div className="not-found-page">
      <h3>Resale offers</h3>
      <div className="input-search-wrapper list-button-wrapper">
        <Tabs selectedIndex={0}>
          <TabList className="category-wrapper">
            <Tab
              selectedClassName={`search-tab-selected-${
                primaryColor === 'rhyno' ? 'default' : 'dark'
              }`}
              className="category-button-nft category-button"
              style={{
                border: `${
                  primaryColor === 'charcoal'
                    ? 'solid 1px var(--charcoal-80)'
                    : 'solid 1px var(--rhyno)'
                } `
              }}>
              Resale offers
            </Tab>
          </TabList>

          <TabPanel>
            <div className="clear-filter-wrapper">
              {isShow ? (
                <button
                  className={`clear-filter ${
                    primaryColor === 'rhyno' ? 'rhyno' : ''
                  }`}
                  onClick={() => clearFilter()}>
                  {filterText}
                </button>
              ) : (
                <></>
              )}
              {isShowCategories ? (
                <button
                  className={`clear-filter filter-category ${
                    primaryColor === 'rhyno' ? 'rhyno' : ''
                  }`}
                  onClick={() => clearCategoriesFilter()}>
                  {filterCategoriesText}
                </button>
              ) : (
                <></>
              )}
            </div>
            <NftList data={resales} />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default ResalePage;
