//@ts-nocheck
import React, { useState, useEffect, useCallback } from "react";
import InputField from "../common/InputField";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { NftList } from "./NftList/NftList";
import VideoList from "../video/videoList";
import FilteringBlock from "./FilteringBlock/FilteringBlock";
import axios from "axios";

const SearchPanel = ({ primaryColor, textColor }) => {
  const [titleSearch, setTitleSearch] = useState("");
  const [sortItem, setSortItem] = useState("");
  const [mediaList, setMediaList] = useState();
  const [data, setData] = useState();
  // const [dataAll, setAllData] = useState();
  const [totalPage, setTotalPages] = useState([10]);
  const [itemsPerPage /*setItemsPerPage*/] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [blockchain, setBlockchain] = useState();
  const [category, setCategory] = useState();
  const [isShow, setIsShow] = useState(false);
  const [isShowCategories, setIsShowCategories] = useState(false);
  const [filterText, setFilterText] = useState("");
  // const [totalCountAll, setTotalCountAll] = useState();
  const [filterCategoriesText, setFilterCategoriesText] = useState("");
  const [click, setClick] = useState(null);

  // console.log(dataAll, 'dataAll from all');
  // console.log(titleSearch, "titleSearch");

  let pagesArray = [];
  for (let i = 0; i < totalPage; i++) {
    pagesArray.push(i + 1);
  }

  const getContract = useCallback(async () => {
    const responseContract = await axios.get("/api/contracts/full", {
      headers: {
        Accept: "application/json",
        "X-rair-token": localStorage.token,
      },
      params: {
        itemsPerPage: itemsPerPage,
        pageNum: currentPage,
        blockchain: blockchain,
        category: category,
      },
    });

    const covers = responseContract.data.contracts.map((item) => ({
      id: item._id,
      productId: item.products?._id ?? "wut",
      blockchain: item.blockchain,
      collectionIndexInContract: item.products.collectionIndexInContract,
      contract: item.contractAddress,
      cover: item.products.cover,
      title: item.title,
      name: item.products.name,
      user: item.user,
      copiesProduct: item.products.copies,
      offerData: item.products.offers.map((elem) => ({
        price: elem.price,
        offerName: elem.offerName,
        offerIndex: elem.offerIndex,
        productNumber: elem.product,
      })),
    }));
    setData(covers);
    // setTotalCountAll(responseContract.data.totalNumber);

    const totalCount = responseContract.data.totalNumber;    
    setTotalPages(getPagesCount(totalCount, itemsPerPage));
  }, [currentPage, itemsPerPage, blockchain, category]);

  // TODO: for search for the future

  // const getAllContract = useCallback(async () => {
  // const responseContract = await axios.post("/api/search", {
  // headers: {
  //   Accept: "application/json",
  //   "X-rair-token": localStorage.token,
  // },
  // body: {
  // searchString: 'ddsx',
  // searchBy: 'products',
  // }
  // params: {
  // searchString: 'ddsx',
  //   pageNum: currentPage,
  //   blockchain: blockchain,
  //   category: category,
  // },
  // });

  // if(totalCountAll){
  //   const responseContract = await axios.get("/api/contracts/full", {
  //     headers: {
  //       Accept: "application/json",
  //       "X-rair-token": localStorage.token,
  //     },
  //     params: {
  //       itemsPerPage: totalCountAll,
  //     //   pageNum: currentPage,
  //     //   blockchain: blockchain,
  //     //   category: category,
  //     },
  //   });

  //   const covers = responseContract.data.contracts.map((item) => ({
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
  // setAllData(responseContract);
  // }
  // }, [totalCountAll]);
  // }, []);

  const getPagesCount = (totalCount, itemsPerPage) => {
    return Math.ceil(totalCount / itemsPerPage);
  };

  const changePage = (currentPage) => {
    setCurrentPage(currentPage);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [blockchain, category]);

  const updateList = async () => {
    let response = await (
      await fetch("/api/media/list", {
        headers: {
          "x-rair-token": localStorage.token,
        },
      })
    ).json();
    if (response.success) {
      setMediaList(response.list);
    } else if (
      response?.message === "jwt expired" ||
      response?.message === "jwt malformed"
    ) {
      localStorage.removeItem("token");
    } else {
      console.log(response?.message);
    }
  };

  // useEffect(() => {
  //   getAllContract();
  // }, [getAllContract]);

  useEffect(() => {
    getContract();
  }, [currentPage, getContract]);

  // useEffect(() => {
  //   if (localStorage.token) {
  //     updateList();
  //   }
  // }, []);

  const handleClick = useCallback(
    (cover) => {
      data.forEach((item) => {
        if (cover === item.cover) {
          console.log(1);
        }
      });
    },
    [data]
  );

  const clearFilter = () => {
    setBlockchain(null);
    setClick(null);
    setIsShow(false);
  };
  const clearCategoriesFilter = () => {
    setCategory(null);
    setClick(null);
    setIsShowCategories(false);
  };
  return (
    <div className="input-search-wrapper list-button-wrapper">
      <Tabs>
        <TabList className="category-wrapper">
          <Tab
            style={{
              backgroundColor: `var(--${primaryColor})`,
              color: `var(--${textColor})`,
            }}
            selectedClassName={`search-tab-selected-${
              primaryColor === "rhyno" ? "default" : "dark"
            }`}
            className="category-button-nft category-button"
          >
            NFT
          </Tab>

          <Tab
            onClick={() => {
              updateList();
            }}
            style={{
              backgroundColor: `var(--${primaryColor})`,
              color: `var(--${textColor})`,
            }}
            selectedClassName={`search-tab-selected-${
              primaryColor === "rhyno" ? "default" : "dark"
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
              style={{
                left: "7vw",
              }}
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
              getContract={getContract}
            />
          </div>
        </div>
        <TabPanel>
          <div className="clear-filter-wrapper">
            {isShow ? (
              <button
                style={{ color: `var(--${textColor})` }}
                className="clear-filter"
                onClick={() => clearFilter()}
              >
                {filterText}
              </button>
            ) : (
              <></>
            )}
            {isShowCategories ? (
              <button
                style={{ color: `var(--${textColor})` }}
                className="clear-filter filter-category"
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
            data={data}
            // dataAll={dataAll}
          />
          <div className="pagination__wrapper">
            {pagesArray && pagesArray.length > 0 ? (
              pagesArray.map((p) => (
                <span
                  key={p}
                  onClick={() => changePage(p)}
                  className={
                    currentPage === p
                      ? "pagination__page pagination__page__current"
                      : "pagination__page"
                  }
                >
                  {p}
                </span>
              ))
            ) : (
              <h1 className="search-panel-empty-text">No items to display</h1>
            )}
          </div>
        </TabPanel>
        <TabPanel>
          <VideoList mediaList={mediaList} titleSearch={titleSearch} />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default SearchPanel;
