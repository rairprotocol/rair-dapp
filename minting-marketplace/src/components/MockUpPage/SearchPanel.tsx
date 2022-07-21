//@ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import { useNavigate } from "react-router-dom";
import { NftList } from './NftList/NftList';
import InputField from '../common/InputField';
import VideoList from '../video/videoList';
import FilteringBlock from './FilteringBlock/FilteringBlock';
import PaginationBox from './PaginationBox/PaginationBox';
import {
  getCurrentPage,
  getCurrentPageEnd,
  getCurrentPageNull
} from '../../ducks/pages/actions';
import { getNftDataStart } from '../../ducks/nftData/action';
import { TVideosInitialState } from '../../ducks/videos/videosDucks.types';
import { RootState } from '../../ducks';

const SearchPanel = ({ primaryColor, textColor, tabIndex, setTabIndex }) => {
  const dispatch = useDispatch();
  const { currentPage } = useSelector((store) => store.getPageStore);
  const { nftListTotal, nftList, itemsPerPage } = useSelector(
    (store) => store.nftDataStore
  );
  const { totalNumberVideo } = useSelector((store) => store.videosStore);

  const [titleSearch, setTitleSearch] = useState('');
  const [sortItem, setSortItem] = useState('');
  const [blockchain, setBlockchain] = useState();
  const [category, setCategory] = useState();
  const [isShow, setIsShow] = useState(false);
  const [isShowCategories, setIsShowCategories] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [filterCategoriesText, setFilterCategoriesText] = useState('');
  const [click, setClick] = useState(null);
  const [currentPageForVideo, setCurrentPageForVideo] = useState(1);
  const { videos, loading } = useSelector<RootState, TVideosInitialState>(
    (store) => store.videosStore
  );

  const _locTok: string = localStorage.token;

  const clearPagesForVideo = () => {
    dispatch(getCurrentPageNull());
  };
  const changePage = (currentPage: number) => {
    dispatch(getCurrentPage(currentPage));
    // setCurrentPage(currentPage);
    window.scrollTo(0, 0);
  };
  const changePageForVideo = (currentPage: number) => {
    // dispatch(getCurrentPage(currentPage));
    setCurrentPageForVideo(currentPage);
    window.scrollTo(0, 0);
  };

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

  const updateVideo = useCallback(
    (params) => {
      dispatch({ type: 'GET_LIST_VIDEOS_START', params: params });
    },
    [dispatch]
  );

  useEffect(() => {
    const params = {
      itemsPerPage: itemsPerPage,
      pageNum: currentPageForVideo,
      xTok: _locTok
    };
    updateVideo(params);
  }, [_locTok, currentPageForVideo, itemsPerPage, updateVideo]);

  useEffect(() => {
    const params = {
      itemsPerPage,
      currentPage,
      blockchain,
      category
    };

    dispatch({ type: 'GET_NFTLIST_START', params: params });
  }, [itemsPerPage, currentPage, blockchain, category, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(getNftDataStart());
    };
  }, [dispatch]);

  return (
    <div className="input-search-wrapper list-button-wrapper">
      <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
        <TabList className="category-wrapper">
          <Tab
            selectedClassName={`search-tab-selected-${
              primaryColor === 'rhyno' ? 'default' : 'dark'
            }`}
            className="category-button-nft category-button">
            NFT
          </Tab>
          <Tab
            onClick={() => {
              clearPagesForVideo();
            }}
            style={{
              backgroundColor: `var(--${primaryColor})`,
              color: `var(--${textColor})`
            }}
            selectedClassName={`search-tab-selected-${
              primaryColor === 'rhyno' ? 'default' : 'dark'
            }`}
            className="category-button-videos category-button">
            Unlockables
          </Tab>
        </TabList>
        <div className="container-search">
          <InputField
            getter={titleSearch}
            setter={setTitleSearch}
            placeholder={'Search...'}
            customCSS={{
              backgroundColor: `var(--${primaryColor})`,
              color: `var(--${textColor})`,
              borderTopLeftRadius: '0'
            }}
            customClass="form-control input-styled"
          />
          <div className="nft-form-control-icon">
            <i
              className="fas fa-search fa-lg fas-custom"
              aria-hidden="true"></i>
            <FilteringBlock
              click={click}
              isFilterShow={true}
              textColor={textColor}
              primaryColor={primaryColor}
              sortItem={sortItem}
              setBlockchain={setBlockchain}
              setCategory={setCategory}
              setClick={setClick}
              setSortItem={setSortItem}
              setIsShow={setIsShow}
              setIsShowCategories={setIsShowCategories}
              setFilterText={setFilterText}
              setFilterCategoriesText={setFilterCategoriesText}
            />
          </div>
        </div>
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
          <NftList
            sortItem={sortItem}
            titleSearch={titleSearch}
            primaryColor={primaryColor}
            textColor={textColor}
            data={nftList}
          />
          <PaginationBox
            totalPageForPagination={nftListTotal}
            whatPage={'nft'}
            primaryColor={primaryColor}
            changePage={changePage}
            currentPage={currentPage}
          />
        </TabPanel>
        <TabPanel>
          <VideoList
            videos={videos}
            loading={loading}
            titleSearch={titleSearch}
          />
          <PaginationBox
            totalPageForPagination={totalNumberVideo}
            whatPage={'video'}
            primaryColor={primaryColor}
            changePage={changePageForVideo}
            currentPage={currentPageForVideo}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default SearchPanel;
