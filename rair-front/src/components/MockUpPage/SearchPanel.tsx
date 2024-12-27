import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Hex } from 'viem';

import { ISearchPanel } from './mockupPage.types';

import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks';
import {
  GlobalModalContext,
  TGlobalModalContext
} from '../../providers/ModalProvider';
import { GLOBAL_MODAL_ACTIONS } from '../../providers/ModalProvider/actions';
import { loadFrontPageCatalog } from '../../redux/tokenSlice';
import { loadVideoList } from '../../redux/videoSlice';
import InputField from '../common/InputField';
import VideoList from '../video/videoList';

import FilteringBlock from './FilteringBlock/FilteringBlock';
import {
  TBlockchainNames,
  TSortChoice
} from './FilteringBlock/filteringBlock.types';
import { NftList } from './NftList/NftList';
import PaginationBox from './PaginationBox/PaginationBox';

const SearchPanel: FC<ISearchPanel> = ({ tabIndex, setTabIndex }) => {
  const [, setVideoUnlocked] = useState<boolean>(false);
  const [titleSearch, setTitleSearch] = useState<string>('');
  const [sortItem, setSortItem] = useState<TSortChoice | undefined>();
  const [blockchain, setBlockchain] = useState<Hex | undefined>();
  const [category, setCategory] = useState<string>('');
  const [, /*isShow*/ setIsShow] = useState<boolean>(false);
  const [click, setClick] = useState(null);
  const [isShowCategories, setIsShowCategories] = useState<boolean>(false);
  const [filterText, setFilterText] = useState<Array<TBlockchainNames>>([]);
  const [filterCategoriesText, setFilterCategoriesText] = useState<
    string | null
  >();
  const [categoryClick, setCategoryClick] = useState<string | null>(null);
  const [blockchainClick, setBlockchainClick] =
    useState<TBlockchainNames | null>(null);
  const [currentPageForVideo, setCurrentPageForVideo] = useState<number>(1);
  const dispatch = useAppDispatch();
  const { catalogTotal, itemsPerPage, currentPage } = useAppSelector(
    (store) => store.tokens
  );
  const { totalVideos } = useAppSelector((store) => store.videos);
  const {
    primaryColor,
    textColor,
    secondaryColor,
    primaryButtonColor,
    iconColor
  } = useAppSelector((store) => store.colors);

  const { globalModalState, globalModaldispatch } =
    useContext<TGlobalModalContext>(GlobalModalContext);

  const catalogPage = useCallback(
    (page: number) => {
      const params = {
        itemsPerPage,
        pageNum: page,
        blockchain,
        category,
        contractTitle: titleSearch.toLocaleLowerCase()
      };

      dispatch(loadFrontPageCatalog(params));
      window.scrollTo(0, 0);
    },
    [itemsPerPage, blockchain, category, titleSearch, dispatch]
  );

  const handleVideoIsUnlocked = useCallback(() => {
    setVideoUnlocked((prev) => !prev);
  }, [setVideoUnlocked]);

  const changePageForVideo = (currentPage: number) => {
    setCurrentPageForVideo(currentPage);
    window.scrollTo(0, 0);
  };

  const clearFilter = useCallback(() => {
    setBlockchain(undefined);
    setCategory('null');
    setCategoryClick(null);
    setBlockchainClick(null);
    setIsShow(false);
    setClick(null);
    catalogPage(1);
    globalModaldispatch({
      type: GLOBAL_MODAL_ACTIONS.UPDATE_MODAL,
      payload: {
        selectedBchItems: [],
        selectedCatItems: []
      }
    });
  }, [catalogPage, globalModaldispatch]);

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
    setCategory('null');
    setCategoryClick(null);
    setBlockchainClick(null);
    setIsShowCategories(false);
    catalogPage(1);
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

  const updateVideo = useCallback(
    (params) => {
      dispatch(loadVideoList(params));
    },
    [dispatch]
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
      pageNum: currentPage,
      blockchain,
      category,
      contractTitle: titleSearch.toLocaleLowerCase()
    };

    dispatch(loadFrontPageCatalog(params));
  }, [itemsPerPage, currentPage, blockchain, category, titleSearch, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(loadFrontPageCatalog({ itemsPerPage, pageNum: 1 }));
    };
  }, [dispatch, itemsPerPage]);
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
              //clearPagesForVideo();
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
            {filterText.map((filterItemText, index: number) => {
              return (
                <button
                  key={index}
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
          <NftList sortItem={sortItem} titleSearch={titleSearch} />
          <PaginationBox
            totalPageForPagination={catalogTotal}
            whatPage={'nft'}
            changePage={catalogPage}
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
            sortItem={sortItem}
            titleSearch={titleSearch}
            handleVideoIsUnlocked={handleVideoIsUnlocked}
          />
          <PaginationBox
            totalPageForPagination={totalVideos}
            whatPage={'video'}
            changePage={changePageForVideo}
            currentPage={currentPageForVideo}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default SearchPanel;
