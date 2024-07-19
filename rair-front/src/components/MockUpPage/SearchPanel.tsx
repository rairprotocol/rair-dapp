//@ts-nocheck
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ISearchPanel } from './mockupPage.types';

import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import {
  getNftDataStart,
  getNftDataStartWithParams
} from '../../ducks/nftData/action';
import { InitialNftDataStateType } from '../../ducks/nftData/nftData.types';
import {
  getCurrentPage,
  getCurrentPageEnd,
  getCurrentPageNull
} from '../../ducks/pages/actions';
import { TUsersInitialState } from '../../ducks/users/users.types';
import { getListVideosStart } from '../../ducks/videos/actions';
import {
  GlobalModalContext,
  TGlobalModalContext
} from '../../providers/ModalProvider';
import { GLOBAL_MODAL_ACTIONS } from '../../providers/ModalProvider/actions';
import InputField from '../common/InputField';
import { MediaListResponseType } from '../video/video.types';
import VideoList from '../video/videoList';

import FilteringBlock from './FilteringBlock/FilteringBlock';
import {
  TBlockchainNames,
  TOnClickCategories,
  TSortChoice
} from './FilteringBlock/filteringBlock.types';
import { NftList } from './NftList/NftList';
import PaginationBox from './PaginationBox/PaginationBox';

const SearchPanel: React.FC<ISearchPanel> = ({ tabIndex, setTabIndex }) => {
  const [videoUnlocked, setVideoUnlocked] = useState<boolean>(false);
  const [titleSearch, setTitleSearch] = useState<string>('');
  const [sortItem, setSortItem] = useState<TSortChoice | undefined>();
  const [blockchain, setBlockchain] = useState<BlockchainType | undefined>();
  const [category, setCategory] = useState<TOnClickCategories | null>();
  const [, /*isShow*/ setIsShow] = useState<boolean>(false);
  const [click, setClick] = useState(null);
  const [isShowCategories, setIsShowCategories] = useState<boolean>(false);
  const [filterText, setFilterText] = useState<TBlockchainNames>([]);
  const [filterCategoriesText, setFilterCategoriesText] =
    useState<TOnClickCategories | null>();
  const [categoryClick, setCategoryClick] = useState<TOnClickCategories | null>(
    null
  );
  const [blockchainClick, setBlockchainClick] =
    useState<TBlockchainNames | null>(null);
  const [currentPageForVideo, setCurrentPageForVideo] = useState<number>(1);
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
  const {
    primaryColor,
    textColor,
    secondaryColor,
    primaryButtonColor,
    iconColor
  } = useSelector<RootState, ColorStoreType>((store) => store.colorStore);
  const videos = useSelector<RootState, MediaListResponseType | null>(
    (store) => store.videosStore.videos
  );
  const { userRd } = useSelector<RootState, TUsersInitialState>(
    (store) => store.userStore
  );

  const { globalModalState, globalModaldispatch } =
    useContext<TGlobalModalContext>(GlobalModalContext);

  const handleVideoIsUnlocked = useCallback(() => {
    setVideoUnlocked((prev) => !prev);
  }, [setVideoUnlocked]);

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

  const clearFilter = useCallback(() => {
    setBlockchain(undefined);
    setCategory(undefined);
    setCategoryClick(null);
    setBlockchainClick(null);
    setIsShow(false);
    setClick(null);
    dispatch(getCurrentPageEnd());
    globalModaldispatch({
      type: GLOBAL_MODAL_ACTIONS.UPDATE_MODAL,
      payload: {
        selectedBchItems: [],
        selectedCatItems: []
      }
    });
  }, [dispatch, globalModaldispatch]);

  const clearSelected = (selectedItemText) => {
    if (globalModalState.selectedBchItems) {
      const sortedBchItems = globalModalState.selectedBchItems.filter(
        (bchItem) => bchItem.name !== selectedItemText
      );
      globalModalState.onFilterApply(sortedBchItems);
      globalModaldispatch({
        type: GLOBAL_MODAL_ACTIONS.UPDATE_MODAL,
        payload: {
          selectedBchItems: sortedBchItems
        }
      });

      setFilterText(filterText.filter((item) => item !== selectedItemText));
    }
  };

  const clearCategoriesFilter = () => {
    setCategory(null);
    setCategoryClick(null);
    setBlockchainClick(null);
    setIsShowCategories(false);
    dispatch(getCurrentPageEnd());
    globalModaldispatch({
      type: GLOBAL_MODAL_ACTIONS.UPDATE_MODAL,
      payload: {
        selectedBchItems: [],
        selectedCatItems: []
      }
    });
  };

  useEffect(() => {
    globalModaldispatch({
      type: GLOBAL_MODAL_ACTIONS.UPDATE_MODAL,
      payload: {
        setBlockchain,
        setCategory,
        primaryColor,
        clearFilter,
        setFilterText,
        setIsShow
      }
    });
  }, [globalModaldispatch, setBlockchain, primaryColor, clearFilter]);

  useEffect(() => {
    if (blockchain || category) {
      dispatch(getCurrentPageEnd());
    }
  }, [blockchain, category, dispatch]);

  const updateVideo = useCallback(
    (params) => {
      dispatch(getListVideosStart(params));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, videoUnlocked, userRd]
  );

  const globalParams = useMemo(
    () => ({
      itemsPerPage: itemsPerPage,
      pageNum: currentPageForVideo,
      category: category,
      blockchain: blockchain,
      mediaTitle: titleSearch
    }),
    [itemsPerPage, currentPageForVideo, category, blockchain, titleSearch]
  );

  useEffect(() => {
    // const params = {
    //   itemsPerPage: itemsPerPage,
    //   pageNum: currentPageForVideo,
    // };
    updateVideo(globalParams);
  }, [updateVideo, globalParams]);

  useEffect(() => {
    const params = {
      itemsPerPage,
      currentPage,
      blockchain,
      category,
      contractTitle: titleSearch.toLocaleLowerCase()
    };

    dispatch(getNftDataStartWithParams(params));
  }, [itemsPerPage, currentPage, blockchain, category, titleSearch, dispatch]);

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
              primaryColor === '#dedede' ? 'default' : 'dark'
            }`}
            className="category-button-nft category-button">
            MARKET
          </Tab>
          <Tab
            onClick={() => {
              clearPagesForVideo();
            }}
            selectedClassName={`search-tab-selected-${
              primaryColor === '#dedede' ? 'default' : 'dark'
            }`}
            className="category-button-videos category-button">
            Videos
          </Tab>
        </TabList>
        <div className="container-search">
          <InputField
            getter={titleSearch}
            setter={setTitleSearch}
            placeholder={
              tabIndex === 0 ? 'Search collections' : 'Search videos'
            }
            customCSS={{
              backgroundColor: `color-mix(in srgb, ${primaryColor} 90%, #888888)`,
              color: textColor,
              borderTopLeftRadius: '0',
              borderColor: `color-mix(in srgb, ${secondaryColor}, #888888)`,
              paddingLeft: '2rem'
            }}
            customClass="form-control input-styled border-top-radius-tablet search-mobile"
          />
          <div className="nft-form-control-icon">
            <i className="fas-custom">
              <FontAwesomeIcon
                icon={faSearch}
                size="lg"
                style={{
                  color:
                    import.meta.env.VITE_TESTNET === 'true'
                      ? `${iconColor === '#1486c5' ? '#F95631' : iconColor}`
                      : `${iconColor === '#1486c5' ? '#E882D5' : iconColor}`
                }}
              />
            </i>
            <FilteringBlock
              click={click}
              setIsClick={setClick}
              isFilterShow={
                import.meta.env.VITE_TESTNET === 'true' ? false : true
              }
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
            {filterText.map((filterItemText) => {
              return (
                <button
                  key={Math.random() * 1_000_000}
                  style={{
                    background: `${
                      primaryColor === '#dedede'
                        ? import.meta.env.VITE_TESTNET === 'true'
                          ? 'var(--hot-drops)'
                          : 'linear-gradient(to right, #e882d5, #725bdb)'
                        : import.meta.env.VITE_TESTNET === 'true'
                          ? primaryButtonColor ===
                            'linear-gradient(to right, #e882d5, #725bdb)'
                            ? 'var(--hot-drops)'
                            : primaryButtonColor
                          : primaryButtonColor
                    }`,
                    color: textColor
                  }}
                  className={`clear-filter`}
                  onClick={() => clearSelected(filterItemText)}>
                  {filterItemText}
                </button>
              );
            })}
            {isShowCategories ? (
              <button
                className={`clear-filter filter-category`}
                style={{
                  background: `${
                    primaryColor === '#dedede'
                      ? import.meta.env.VITE_TESTNET === 'true'
                        ? 'var(--hot-drops)'
                        : 'linear-gradient(to right, #e882d5, #725bdb)'
                      : import.meta.env.VITE_TESTNET === 'true'
                        ? primaryButtonColor ===
                          'linear-gradient(to right, #e882d5, #725bdb)'
                          ? 'var(--hot-drops)'
                          : primaryButtonColor
                        : primaryButtonColor
                  }`,
                  color: textColor
                }}
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
            changePage={changePage}
            currentPage={currentPage}
          />
        </TabPanel>
        <TabPanel>
          <div className="clear-filter-wrapper">
            {filterText.map((filterItemText) => {
              return (
                <button
                  key={Math.random() * 1_000_000}
                  className={`clear-filter`}
                  style={{
                    background: `${
                      primaryColor === '#dedede'
                        ? import.meta.env.VITE_TESTNET === 'true'
                          ? 'var(--hot-drops)'
                          : 'linear-gradient(to right, #e882d5, #725bdb)'
                        : import.meta.env.VITE_TESTNET === 'true'
                          ? primaryButtonColor ===
                            'linear-gradient(to right, #e882d5, #725bdb)'
                            ? 'var(--hot-drops)'
                            : primaryButtonColor
                          : primaryButtonColor
                    }`,
                    color: textColor
                  }}
                  onClick={() => clearSelected(filterItemText)}>
                  {filterItemText}
                </button>
              );
            })}
          </div>
          <VideoList
            videos={videos}
            titleSearch={titleSearch}
            handleVideoIsUnlocked={handleVideoIsUnlocked}
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
