//@ts-nocheck
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
// import { useHistory } from "react-router-dom";
import { NftList } from "./NftList/NftList";
import InputField from "../common/InputField";
import VideoList from "../video/videoList";
import FilteringBlock from "./FilteringBlock/FilteringBlock";
import PaginationBox from "./PaginationBox/PaginationBox";
import { getCurrentPage, getCurrentPageEnd } from "../../ducks/pages/actions";
import { getNftDataStart } from "../../ducks/nftData/action";

const SearchPanel = ({ primaryColor, textColor, tabIndex, setTabIndex }) => {
  const dispatch = useDispatch();
  const { currentPage } = useSelector((store) => store.getPageStore);
  const { nftList, itemsPerPage } = useSelector((store => store.nftDataStore));

  const [titleSearch, setTitleSearch] = useState("");
  const [sortItem, setSortItem] = useState("");
  const [blockchain, setBlockchain] = useState();
  const [category, setCategory] = useState();
  const [isShow, setIsShow] = useState(false);
  const [isShowCategories, setIsShowCategories] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [filterCategoriesText, setFilterCategoriesText] = useState("");
  const [click, setClick] = useState(null);

  // const [mediaList, setMediaList] = useState();


  // const getContract = useCallback(async () => {
  //   const responseContract = await axios.get<TGetFullContracts>("/api/contracts/full", {
  //     headers: {
  //       Accept: "application/json",
  //       "X-rair-token": localStorage.token,
  //     },
  //     params: {
  //       itemsPerPage: itemsPerPage,
  //       pageNum: currentPage,
  //       blockchain: blockchain,
  //       category: category,
  //     },
  //   });

  //   const covers = responseContract.data.contracts.map((item: object) => ({
  //     id: item._id,
  //     productId: item.products?._id ?? "wut",
  //     blockchain: item.blockchain,
  //     collectionIndexInContract: item.products.collectionIndexInContract,
  //     contract: item.contractAddress,
  //     cover: item.products.cover,
  //     title: item.title,
  //     name: item.products.name,
  //     user: item.user,
  //     copiesProduct: item.products.copies,
  //     offerData: item.products.offers.map((elem) => ({
  //       price: elem.price,
  //       offerName: elem.offerName,
  //       offerIndex: elem.offerIndex,
  //       productNumber: elem.product,
  //     })),
  //   }));
  //   setData(covers);

  //   const totalCount = responseContract.data.totalNumber;
  //   setTotalPages(getPagesCount(totalCount, itemsPerPage));
  // }, [currentPage, itemsPerPage, blockchain, category]);


  const changePage = (currentPage: number) => {
    dispatch(getCurrentPage(currentPage));
    // setCurrentPage(currentPage);
    window.scrollTo(0, 0);
  };

  // const updateList = async () => {
  //   try {
  //     let response = await axios.get<TMediaList>("/api/media/list", {
  //       headers: {
  //         "x-rair-token": localStorage.token,
  //       },
  //     });
  //     const { success, list } = response.data;
  //     if (success) {
  //       console.log(list, "list")
  //       setMediaList(list);
  //     }
  //   } catch (err) {
  //     const error = err as AxiosError;
  //     if (
  //       error?.message === "jwt expired" ||
  //       error?.message === "jwt malformed"
  //     ) {
  //       localStorage.removeItem("token");
  //     }
  //     else {
  //       console.log(error?.message);
  //     }
  //   }
  // };

  // unused snippet
  const handleClick = useCallback(
    (cover) => {
      nftList.forEach((item) => {
        if (cover === item.cover) {
          console.log(1);
        }
      });
    },
    []
  );

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
    const params = {
      itemsPerPage,
      currentPage,
      blockchain,
      category
    }

    dispatch({ type: "GET_NFTLIST_START", params: params })
  }, [
    itemsPerPage,
    currentPage,
    blockchain,
    category,
    dispatch
  ])

  useEffect(() => {
    return () => {
      dispatch(getNftDataStart());
    }
  }, [dispatch])

  // useEffect(() => {
  //   getContract();
  // }, [currentPage, getContract]);

  return (
    <div className="input-search-wrapper list-button-wrapper">
      <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
        <TabList className="category-wrapper">
          <Tab
            selectedClassName={`search-tab-selected-${primaryColor === "rhyno" ? "default" : "dark"
              }`}
            className="category-button-nft category-button"
          >
            NFT
          </Tab>
          <Tab
            selectedClassName={`search-tab-selected-${primaryColor === "rhyno" ? "default" : "dark"
              }`}
            className="category-button-videos category-button"
          >
            Unlockables
          </Tab>
        </TabList>
        <div className="container-search">
          <InputField
            getter={titleSearch}
            setter={setTitleSearch}
            placeholder={"Search..."}
            customCSS={{
              backgroundColor: `var(--${primaryColor})`,
              color: `var(--${textColor})`,
              borderTopLeftRadius: "0",
            }}
            customClass="form-control input-styled"
          />
          <div className="nft-form-control-icon">
            <i
              className="fas fa-search fa-lg fas-custom"
              aria-hidden="true"
            ></i>
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
            // getContract={getContract}
            />
          </div>
        </div>
        <TabPanel>
          <div className="clear-filter-wrapper">
            {isShow ? (
              <button
                className={`clear-filter ${primaryColor === "rhyno" ? "rhyno" : ""}`}
                onClick={() => clearFilter()}
              >
                {filterText}
              </button>
            ) : (
              <></>
            )}
            {isShowCategories ? (
              <button
                className={`clear-filter filter-category ${primaryColor === "rhyno" ? "rhyno" : ""}`}
                onClick={() => clearCategoriesFilter()}
              >
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
            handleClick={handleClick}
            data={nftList}
          // dataAll={dataAll}
          />
          <PaginationBox
            primaryColor={primaryColor}
            changePage={changePage}
            currentPage={currentPage}
          />
        </TabPanel>
        <TabPanel>
          <VideoList titleSearch={titleSearch} />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default SearchPanel;
