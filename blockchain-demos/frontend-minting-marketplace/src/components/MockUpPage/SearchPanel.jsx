import React, { useState, useEffect } from "react";
import InputField from "../common/InputField.jsx";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
// import 'react-tabs/style/react-tabs.css';
import NftList from "./NftList/NftList.jsx";
import VideoList from "../video/videoList.jsx";

const SearchPanel = ({ primaryColor, textColor }) => {
  const [titleSearch, setTitleSearch] = useState("");
  const [mediaList, setMediaList] = useState();
  const [data, setData] = useState();

  useEffect(() => {
    getContract();
  }, []);

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
      collectionIndexInContract: item.products.collectionIndexInContract,
      contract: item.contractAddress,
      cover: item.products.cover,
      title: item.title,
      name: item.products.name,
      offerData: item.products.offers.map((elem) => ({
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
        <div style={{ position: "relative" }}>
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
          <i className="fas fa-search fa-lg fas-custom" aria-hidden="true"></i>
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
