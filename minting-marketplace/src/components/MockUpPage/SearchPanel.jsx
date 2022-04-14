import React, { useState, useEffect, useCallback } from "react";
import InputField from "../common/InputField.jsx";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
// import 'react-tabs/style/react-tabs.css';
import { NftList } from "./NftList/NftList.jsx";
import VideoList from "../video/videoList.jsx";
import FilteringBlock from "./FilteringBlock/FilteringBlock.jsx";
import axios from "axios";

const SearchPanel = ({ primaryColor, textColor }) => {
  const [titleSearch, setTitleSearch] = useState("");
  const [sortItem, setSortItem] = useState("");
  const [mediaList, setMediaList] = useState();
  const [data, setData] = useState();
  const [totalPage, setTotalPages] = useState([10]);
  const [itemsPerPage /*setItemsPerPage*/] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [blockchain, setBlockchain] = useState();
  const [isShow, setIsShow] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [click, setClick] = useState(null);

  const media_match = window.matchMedia("(min-width: 700px)");
  const [mobile, setMobile] = useState(media_match.matches);
  window.addEventListener("resize", () => setMobile(media_match.matches));

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

    const totalCount = responseContract.data.totalNumber;
    setTotalPages(getPagesCount(totalCount, itemsPerPage));
  }, [currentPage, itemsPerPage, blockchain]);

  const getPagesCount = (totalCount, itemsPerPage) => {
    return Math.ceil(totalCount / itemsPerPage);
  };

  const changePage = (currentPage) => {
    setCurrentPage(currentPage);
    window.scrollTo(0, 0);
  };

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
    setIsShow(false);
    setClick(null)
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
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: mobile ? "row" : "column",
            paddingLeft: "6vw",
          }}
        >
          <InputField
            getter={titleSearch}
            setter={setTitleSearch}
            placeholder={"Search..."}
            customCSS={{
              backgroundColor: `var(--${primaryColor})`,
              color: `var(--${textColor})`,
              borderTopLeftRadius: "0",
              width: mobile ? "54.5%" : "100%",
              marginBottom: mobile ? "32px" : "8px",
            }}
            customClass="form-control input-styled"
          />
          <div
            style={
              mobile
                ? {
                    display: "flex",
                  }
                : {
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                    marginBottom: "32px",
                  }
            }
          >
            <i
              className="fas fa-search fa-lg fas-custom"
              aria-hidden="true"
              style={{
                left: "7vw",
              }}
            ></i>
            <FilteringBlock
              sortItem={sortItem}
              setSortItem={setSortItem}
              getContract={getContract}
              setBlockchain={setBlockchain}
              primaryColor={primaryColor}
              textColor={textColor}
              isFilterShow={true}
              setIsShow={setIsShow}
              setFilterText={setFilterText}
              click={click}
              setClick={setClick}
            />
          </div>
        </div>
        <TabPanel>
          <div className="clear-filter-wrapper">
            {isShow ? (
              <button 
                style={{color: `var(--${textColor})`}}
                className="clear-filter"
                onClick={() => clearFilter()}>
                {filterText}
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
          />
          <div className="pagination__wrapper">
            {pagesArray.map((p) => (
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
            ))}
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
