import React, {
  useState,
  useEffect,
  useCallback /*createElement*/,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { rFetch /*useRfetch*/ } from "../../utils/rFetch.js";
import { /*Link*/ useHistory } from "react-router-dom";
import setDocumentTitle from "../../utils/setTitle";
import MyDiamondItems from './myDiamondItems.jsx';

// React Redux types
import * as authTypes from "../../ducks/auth/types";

import InputField from "../common/InputField.jsx";
import FilteringBlock from "../MockUpPage/FilteringBlock/FilteringBlock.jsx";
import ModalItem from "../MockUpPage/FilteringBlock/portal/ModalItem/ModalItem.jsx";
import chainDataFront from "../MockUpPage/utils/blockchainDataFront.js";

const MyItems = (props) => {
  const dispatch = useDispatch();

  const defaultImg =
    "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW";

  const { primaryColor, textColor } = useSelector((state) => state.colorStore);
  // const { token } = useSelector((store) => store.accessStore);
  const history = useHistory();
  const [tokens, setTokens] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [titleSearch, setTitleSearch] = useState("");
  const [sortItem, setSortItem] = useState("");
  const [isOpenBlockchain, setIsOpenBlockchain] = useState(false);

  const fetchData = useCallback(async () => {
    let response = await rFetch("/api/nft");

    if (response.success) {
      // console.log(response);
      let tokenData = [];
      for await (let token of response.result) {
        let contractData = await rFetch(
          `/api/contracts/singleContract/${token.contract}`
        );
        tokenData.push({
          ...token,
          ...contractData.contract,
        });
      }
      setTokens(tokenData);
    }

    if (response.error && response.message) {
      dispatch({ type: authTypes.GET_TOKEN_ERROR, error: response.error });
    }
  }, [dispatch]);

  const openModal = () => {
    setIsOpenBlockchain(true);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setDocumentTitle(`My Items`);
  }, []);

  const filteredData =
    tokens &&
    tokens
      .filter((item) => {
        return item?.title?.toLowerCase()?.includes(titleSearch?.toLowerCase());
      })
      .sort((a, b) => {
        if (sortItem === "up") {
          if (a.title < b.title) {
            return -1;
          }
        }

        if (sortItem === "down") {
          if (a.title > b.title) {
            return 1;
          }
        }

        return 0;
      });
  // const onChangeFilterPopUp = () => {
  //   setFilterPopUp((prev) => !prev);
  // };
  // console.log(filteredData, "filteredData");
  // console.log(tokens, "token");
  return (
    <div className="my-items-wrapper">
      <div className="my-items-header-wrapper">
        <div
          onClick={() => history.goBack()}
          className="my-items-title-wrapper"
        >
          <i className="fas fa-arrow-left fa-arrow-custom"></i>
          <h1 className="my-items-title">My Items</h1>
        </div>
        <div className="my-items-bar-wrapper">
          <InputField
            getter={titleSearch}
            setter={setTitleSearch}
            placeholder={"Search..."}
            customCSS={{
              backgroundColor: `var(--${primaryColor})`,
              color: `var(--${textColor})`,
              width: "100%",
            }}
            customClass="form-control input-styled my-items-search"
          />
          <i className="fas fa-search fa-lg fas-custom" aria-hidden="true"></i>
          <FilteringBlock
            setSortItem={setSortItem}
            sortItem={sortItem}
            isFilterShow={false}
          />
        </div>
      </div>
      <div className="my-items-product-wrapper row px-0 mx-0">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => {
          // tokens.map((item, index) => {
            return (
              <div
                onClick={() => {
                  openModal();
                  setSelectedData(item);
                }}
                key={index}
                style={{ width: "291px", height: "291px" }}
                className="p-1 my-1 col-2"
              >
                <div
                  className="w-100 bg-my-items p-2"
                  style={{
                    maxWidth: "291px",
                    height: "291px",
                    cursor: "pointer",
                    //   border: `solid 1px ${textColor}`,
                    backgroundImage: `url(${
                      // chainData[item?.blockchain]?.image
                      item.metadata.image || defaultImg
                    })`,
                    backgroundColor: `var(--${primaryColor}-transparent)`,
                    overflow: "hidden",
                  }}
                >
                  {/* <small style={{ fontSize: "0.7rem" }}>
                      {item.contract}:{item.uniqueIndexInContract}
                    </small> */}
                  {/* <br /> */}

                  <div className="col my-items-description-wrapper my-items-pic-description-wrapper">
                    <span className="description-title">
                      {item.metadata ? (
                        <>
                          {/* <div className="w-100"> */}
                          {/* <img
                            alt="NFT"
                            src={item.metadata.image}
                            style={{
                              width: "auto",
                              height: "auto",
                              maxHeight: "30vh",
                            }}
                          /> */}
                          {/* </div> */}
                          <span>{item.title}</span>
                          {/* <small>{item.user}</small> */}
                          {/* <br /> */}
                          {/* <small>{item.metadata.description}</small> */}
                          {/* <br /> */}
                          {/* <small>
                          {item.metadata.attributes.length} attributes!
                        </small> */}
                        </>
                      ) : (
                        <b> No metadata available </b>
                      )}
                      {/* {collectionName} */}
                      {/* {collectionName.slice(0, 14)} */}
                      {/* {collectionName.length > 12 ? "..." : ""} */}
                      <br />
                    </span>
                    {/* <small className="description">
                        {item.user.slice(0, 12)}
                        {item.user.length > 10 ? "..." : ""}
                      </small> */}
                    <small className="description">
                      {item.contract}
                      {/* {item.contract.length > 10 ? "..." : ""} */}
                    </small>
                    <div
                      className="description-small"
                      style={{
                        paddingRight: "16px",
                        position: "relative",
                        right: "-227px",
                        top: "-48px",
                      }}
                    >
                      <img
                        className="my-items-blockchain-img"
                        src={`${chainDataFront[item?.blockchain]?.image}`}
                        alt=""
                      />
                      {/* <span className="description ">{minPrice} ETH </span> */}
                    </div>
                  </div>
                  {/* <br />
                    <Link
                      to={`/token/${item.contract}/${item.uniqueIndexInContract}`}
                      className="btn btn-stimorol"
                    >
                      View Token
                    </Link> */}
                </div>
              </div>
            );
          })
        ) : (
          <p style={{ color: textColor, fontSize: "20px" }}>
            There is no such item with that name
          </p>
        )}
      </div>

      {isOpenBlockchain ? (
        <ModalItem
          setIsOpenBlockchain={setIsOpenBlockchain}
          isOpenBlockchain={isOpenBlockchain}
          selectedData={selectedData}
          primaryColor={primaryColor}
          defaultImg={defaultImg}
        />
      ) : (
        <></>
      )}
      <MyDiamondItems />
    </div>
  );
};

export default MyItems;
