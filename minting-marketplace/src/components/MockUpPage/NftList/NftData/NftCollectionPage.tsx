//@ts-nocheck
import React, { memo, useEffect, useCallback, useState } from "react";
import { NftItemForCollectionView } from "../NftItemForCollectionView";
import { BreadcrumbsView } from "../Breadcrumbs/Breadcrumbs";
import { useDispatch } from "react-redux";
import Skeleton from "@mui/material/Skeleton";
import CollectionInfo from "./CollectionInfo/CollectionInfo";
import setDocumentTitle from "../../../../utils/setTitle";
import { useHistory } from "react-router-dom";
import TitleCollection from "./TitleCollection/TitleCollection";
import CircularProgress from "@mui/material/CircularProgress";
import AuthenticityBlock from "./AuthenticityBlock/AuthenticityBlock";

// import styles
import "./../../GeneralCollectionStyles.css";
import CustomButton from "../../utils/button/CustomButton";
import { setShowSidebarTrue } from "../../../../ducks/metadata";

const NftCollectionPageComponent = ({
  blockchain,
  // contract,
  currentUser,
  handleClickToken,
  product,
  productsFromOffer,
  primaryColor,
  selectedData,
  selectedToken,
  setSelectedToken,
  tokenData,
  totalCount,
  textColor,
  offerData,
  offerPrice,
  getAllProduct,
  showToken,
  setShowToken,
  isLoading,
  // data,
  tokenDataFiltered,
  setTokenDataFiltered,
  setTokenData,
  userData,
  someUsersData,
  offerDataCol,
  offerAllData,
  collectionName,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [show, setShow] = useState(true);

  const loadToken = useCallback(() => {
    setShowToken(showToken * 2);
    getAllProduct(0, showToken);
  }, [getAllProduct, setShowToken, showToken]);

  useEffect(() => {
    setDocumentTitle("Collection");
    dispatch(setShowSidebarTrue());
  }, [dispatch]);

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const goBack = () => {
    history.goBack();
  };

  const defaultImg =
    "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW";

  if (tokenData.length === 0) {
    return (
      <>
        <div
          style={{
            cursor: "pointer",
            color: "rgb(232, 130, 213)",
            fontSize: "2rem",
          }}
          onClick={() => goBack()}
          className="arrow-back"
        >
          <i className="fas fa-arrow-alt-circle-left"></i>
        </div>
        <h1>Don't have product</h1>
      </>
    );
  }
  return (
    <div
      className="wrapper-collection"
      style={{
        display: "flex",
        flexDirection: "column",
        alignContent: "flex-start",
        justifyContent: "center",
        // alignItems: "flex-start",
        marginBottom: "66px",
        // overflow: "hidden"
      }}
    >
      <BreadcrumbsView />
      <TitleCollection
        selectedData={tokenData[0]?.metadata}
        title={collectionName}
        someUsersData={someUsersData}
        userName={offerAllData?.owner}
        currentUser={userData}
      />
      {tokenDataFiltered.length > 0 ? (
        <div className="filter__btn__wrapper">
          {show ? (
            <CustomButton
              text={"Clean filter"}
              onClick={() => {
                setTokenDataFiltered(0);
                setTokenData(tokenData);
                setShow(false);
              }}
            />
          ) : null}
        </div>
      ) : null}
      <div className={"list-button-wrapper"}>
        {tokenDataFiltered.length > 0
          ? tokenDataFiltered.map((token, index) => {
            if (token.cover !== "none") {
              return (
                <NftItemForCollectionView
                  key={`${token.id + "-" + token.productId + index}`}
                  pict={token.cover ? token.cover : defaultImg}
                  metadata={token.metadata}
                  contract={token.contract}
                  token={token.token}
                  handleClickToken={handleClickToken}
                  setSelectedToken={setSelectedToken}
                  selectedToken={selectedToken}
                  offerPrice={offerPrice}
                  ownerAddress={token.ownerAddress}
                  blockchain={blockchain}
                  currentUser={currentUser}
                  offerData={offerData}
                  primaryColor={primaryColor}
                  productsFromOffer={productsFromOffer}
                  selectedData={selectedData}
                  textColor={textColor}
                  tokenData={tokenData}
                  totalCount={totalCount}
                  product={product}
                  index={token.token}
                  offer={token.offer}
                  someUsersData={someUsersData}
                  userName={offerAllData?.owner}
                />
              );
            } else {
              return null;
            }
          })
          : tokenData.length > 0
            ? tokenData.map((token, index) => {
              if (token.cover !== "none") {
                return (
                  <NftItemForCollectionView
                    key={`${token.id + "-" + token.productId + index}`}
                    pict={token.cover ? token.cover : defaultImg}
                    metadata={token.metadata}
                    contract={token.contract}
                    token={token.token}
                    handleClickToken={handleClickToken}
                    setSelectedToken={setSelectedToken}
                    selectedToken={selectedToken}
                    offerPrice={offerPrice}
                    ownerAddress={token.ownerAddress}
                    blockchain={blockchain}
                    currentUser={currentUser}
                    offerData={offerData}
                    primaryColor={primaryColor}
                    productsFromOffer={productsFromOffer}
                    selectedData={selectedData}
                    textColor={textColor}
                    tokenData={tokenData}
                    totalCount={totalCount}
                    product={product}
                    index={index}
                    offer={token.offer}
                    someUsersData={someUsersData}
                    userName={offerAllData?.owner}
                    tokenDataLength={tokenData.length}
                  />
                );
              } else {
                return null;
              }
            })
            : Array.from(new Array(10)).map((item, index) => {
              return (
                <Skeleton
                  key={index}
                  className={"skeloton-product"}
                  variant="rectangular"
                  width={283}
                  height={280}
                  style={{ borderRadius: 20 }}
                />
              );
            })}
      </div>
      <div className="collection-btn-more">
        {isLoading && (
          <div className="progress-token">
            <CircularProgress
              style={{
                width: "50px",
                height: "50px",
              }}
            />
          </div>
        )}
        {tokenDataFiltered.length
          ? null
          : showToken <= totalCount && (
            <CustomButton
              onClick={loadToken}
              width="232px"
              height="48px"
              margin="20px 0 0 0"
              text="Show more"
            />
          )}
      </div>
      <CollectionInfo
        blockchain={blockchain}
        defaultImg={defaultImg}
        offerData={offerDataCol}
        openTitle={true}
        someUsersData={someUsersData}
      />
      <AuthenticityBlock
        collectionToken={tokenData[0]?.authenticityLink}
        title={true}
        ownerInfo={offerAllData}
        tokenData={tokenData}
      />
    </div>
  );
};

export const NftCollectionPage = memo(NftCollectionPageComponent);
