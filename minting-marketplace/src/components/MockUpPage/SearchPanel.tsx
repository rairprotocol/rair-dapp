import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
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
import {
  getNftDataStart,
  getNftDataStartWithParams
} from '../../ducks/nftData/action';
import { TVideosInitialState } from '../../ducks/videos/videosDucks.types';
import { RootState } from '../../ducks';
import { InitialNftDataStateType } from '../../ducks/nftData/nftData.types';
import { ISearchPanel } from './mockupPage.types';
import { getListVideosStart } from '../../ducks/videos/actions';
import {
  TBlockchainNames,
  TOnClickCategories,
  TSortChoice
} from './FilteringBlock/filteringBlock.types';

const SearchPanel: React.FC<ISearchPanel> = ({
  primaryColor,
  textColor,
  tabIndex,
  setTabIndex
}) => {
  const dispatch = useDispatch();
  const currentPage = useSelector<RootState, number>(
    (store) => store.getPageStore.currentPage
  );
  const { nftListTotal, nftList, itemsPerPage } = useSelector<
    RootState,
    InitialNftDataStateType
  >((store) => store.nftDataStore);
  const totalNumberVideo = useSelector<RootState, number | undefined>(
    (store) => store.videosStore.totalNumberVideo
  );

  const [titleSearch, setTitleSearch] = useState<string>('');
  const [sortItem, setSortItem] = useState<TSortChoice | undefined>();
  const [blockchain, setBlockchain] = useState<BlockchainType | undefined>();
  const [category, setCategory] = useState<TOnClickCategories | null>();
  const [isShow, setIsShow] = useState<boolean>(false);
  const [isShowCategories, setIsShowCategories] = useState<boolean>(false);
  const [filterText, setFilterText] = useState<TBlockchainNames>();
  const [filterCategoriesText, setFilterCategoriesText] =
    useState<TOnClickCategories | null>();
  const [categoryClick, setCategoryClick] = useState<TOnClickCategories | null>(
    null
  );
  const [blockchainClick, setBlockchainClick] =
    useState<TBlockchainNames | null>(null);
  const [currentPageForVideo, setCurrentPageForVideo] = useState<number>(1);
  const { videos, loading } = useSelector<RootState, TVideosInitialState>(
    (store) => store.videosStore
  );

  const _locTok: string = localStorage.token;

  const clearPagesForVideo = () => {
    dispatch(getCurrentPageNull());
  };
  const changePage = (currentPage: number) => {
    dispatch(getCurrentPage(currentPage));
    window.scrollTo(0, 0);
  };
  const changePageForVideo = (currentPage: number) => {
    setCurrentPageForVideo(currentPage);
    window.scrollTo(0, 0);
  };

  const clearFilter = () => {
    setBlockchain(undefined);
    setCategoryClick(null);
    setBlockchainClick(null);
    setIsShow(false);
    dispatch(getCurrentPageEnd());
  };

  const clearCategoriesFilter = () => {
    setCategory(null);
    setCategoryClick(null);
    setBlockchainClick(null);
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
      dispatch(getListVideosStart(params));
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

    dispatch(getNftDataStartWithParams(params));
  }, [itemsPerPage, currentPage, blockchain, category, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(getNftDataStart());
    };
  }, [dispatch]);
  return (
    <div className="input-search-wrapper list-button-wrapper">
      <Tabs
        selectedIndex={tabIndex}
        onSelect={(index: number) => setTabIndex(index)}>
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
            NFT
          </Tab>
          <Tab
            onClick={() => {
              clearPagesForVideo();
            }}
            style={{
              backgroundColor: ``,
              color: `var(--${textColor})`,
              border: `${
                primaryColor === 'charcoal'
                  ? 'solid 1px var(--charcoal-80)'
                  : 'solid 1px var(--rhyno)'
              } `
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
              backgroundColor: `var(--${
                primaryColor === 'charcoal' ? 'charcoal-90' : `rhyno-40`
              })`,
              color: `var(--${textColor})`,
              borderTopLeftRadius: '0',
              border: `${
                primaryColor === 'charcoal'
                  ? 'solid 1px var(--charcoal-80)'
                  : 'solid 1px var(--rhyno)'
              } `
            }}
            customClass="form-control input-styled border-top-radius-tablet search-mobile"
          />
          <div className="nft-form-control-icon">
            <i
              className="fas fa-search fa-lg fas-custom"
              aria-hidden="true"></i>
            <FilteringBlock
              isFilterShow={true}
              textColor={textColor}
              primaryColor={primaryColor}
              categoryClick={categoryClick}
              setCategoryClick={setCategoryClick}
              blockchainClick={blockchainClick}
              setBlockchainClick={setBlockchainClick}
              sortItem={sortItem}
              setBlockchain={setBlockchain}
              setCategory={setCategory}
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
