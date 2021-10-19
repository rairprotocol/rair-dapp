import React, { useState, useEffect, useRef } from "react";
import InputField from "../common/InputField.jsx";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
// import 'react-tabs/style/react-tabs.css';
import NftList from "./NftList/NftList.jsx";
import VideoList from "../video/videoList.jsx";

const SearchPanel = ({ primaryColor, textColor }) => {
  const [titleSearch, setTitleSearch] = useState("");
  const [mediaList, setMediaList] = useState();
  const [data, setData] = useState();

  const [filterPopUp, setFilterPopUp] = useState(false);
  const filterRef = useRef();

  const [sortPopUp, setSortPopUp] = useState(false);
  const sortRef = useRef();

  useEffect(() => {
    getContract();
  }, []);

  const onChangeFilterPopUp = () => {
    setFilterPopUp(prev => !prev);
  }

  const onChangeSortPopUp = () => {
    setSortPopUp(prev => !prev)
  }

  const handleClickOutSideFilter = (e) => {
    if (filterRef && !filterRef.current.contains(e.target)) {
      setFilterPopUp(false)
    }
  }

  const handleClickOutSideSort = (e) => {
    if (sortRef && !sortRef.current.contains(e.target)) {
      setSortPopUp(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutSideFilter);
    return () => document.removeEventListener('mousedown', handleClickOutSideFilter);
  })

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutSideSort);
    return () => document.removeEventListener('mousedown', handleClickOutSideSort);
  })

  const getContract = async () => {
    const responseContract = await (
      await fetch("/api/contracts/full", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-rair-token": localStorage.token,
        },
      })
    ).json();
    const covers = responseContract.contracts.map((item) => ({
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
      })),
    }));
    setData(covers);
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
    if (localStorage.token) {
      updateList();
    }
  }, []);

  const handleClick = (cover) => {
    data.forEach((item) => {
      if (cover === item.cover) {
        console.log(1);
      }
    });
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
            className="category-button-nft category-button"
          >
            NFT
          </Tab>

          <Tab
            style={{
              backgroundColor: `var(--${primaryColor})`,
              color: `var(--${textColor})`,
            }}
            className="category-button-videos category-button"
          >
            Videos
          </Tab>
        </TabList>
        <div style={{ position: "relative", display: "flex" }}>
          <InputField
            getter={titleSearch}
            setter={setTitleSearch}
            placeholder={"Search..."}
            customCSS={{
              backgroundColor: `var(--${primaryColor})`,
              color: `var(--${textColor})`,
              borderTopLeftRadius: "0",
              width: "800px"
            }}
            customClass="form-control input-styled"
          />
          <i className="fas fa-search fa-lg fas-custom" aria-hidden="true"></i>
          <div ref={filterRef} className="select-filters-wrapper">
            <div
              style={{
                backgroundColor: `var(--${primaryColor})`,
                color: `var(--${textColor})`
              }}
              className="select-filters"
              onClick={onChangeFilterPopUp}
            >
              <div className="select-filters-title"><i class="fas fa-sliders-h"></i>Filters</div>
            </div>

            {
              filterPopUp && <div style={{
                backgroundColor: `var(--${primaryColor})`,
                color: `var(--${textColor})`
              }} className="select-filters-popup">
                <div className="select-filters-item">Price</div>
                <div className="select-filters-item">Creator</div>
                <div className="select-filters-item">Metadata</div>
              </div>
            }
          </div>
          <div ref={sortRef} className="select-sort-wrapper">
            <div
              onClick={onChangeSortPopUp}
              style={{
                backgroundColor: `var(--${primaryColor})`,
                color: `var(--${textColor})`
              }}
              className="select-sort"
            >
              <div className="select-sort-title">
                <div className="title-left">
                  <i class="fas fa-sort-amount-down-alt"></i>Sort by name
                </div>
                <div className="title-right-arrow">
                  {sortPopUp ? <i class="fas fa-chevron-up"></i> : <i class="fas fa-chevron-down"></i>}
                </div>
              </div>
            </div>
            {
              sortPopUp && <div style={{
                backgroundColor: `var(--${primaryColor})`,
                color: `var(--${textColor})`
              }}
                className="select-sort-title-pop-up"
              >
                <div className="select-sort-item">
                  <i class="fas fa-sort-amount-up"></i>
                </div>
              </div>
            }
          </div>
        </div>
        <TabPanel>
          <NftList primaryColor={primaryColor} textColor={textColor} handleClick={handleClick} data={data} />
        </TabPanel>
        <TabPanel>
          <VideoList mediaList={mediaList} titleSearch={titleSearch} />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default SearchPanel;
