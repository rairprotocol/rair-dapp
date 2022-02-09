import React, { memo, useEffect, useCallback, useState } from "react";
import { NftItemForCollectionView } from "../NftItemForCollectionView";
import { BreadcrumbsView } from "../Breadcrumbs/Breadcrumbs";
import { useDispatch } from "react-redux";
import Skeleton from "@mui/material/Skeleton";
import CollectionInfo from "./CollectionInfo/CollectionInfo";
import setDocumentTitle from "../../../../utils/setTitle";
import { useHistory } from "react-router-dom";
import TitleCollection from "./TitleCollection/TitleCollection";
import CircularProgress from '@mui/material/CircularProgress'
import AuthenticityBlock from "./AuthenticityBlock/AuthenticityBlock";

// import styles
import "./../../GeneralCollectionStyles.css";
import CustomButton from "../../utils/button/CustomButton";

const NftCollectionPageComponent = ({
  blockchain,
  contract,
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
  data,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [offerDataCol, setOfferDataCol] = useState();
  const [offerAllData, setOfferAllData] = useState();
  const [collectionName, setCollectionName] = useState();

  const loadToken = () => {
    getAllProduct(0, showToken);
    setShowToken(showToken * 2)
  }

  const getParticularOffer = useCallback(async () => {
    let response = await (
      await fetch(
        `/api/nft/network/${blockchain}/${contract}/${product}/offers`,
        {
          method: "GET",
        }
      )
    ).json();

    if (response.success) {
      setOfferAllData(response.product);
      setOfferDataCol(response.product.offers);
    }

    if (response.success) {
      setCollectionName(response.product.name);
    }
  }, [product, contract, blockchain]);

  useEffect(() => {
    getParticularOffer();
  }, [getParticularOffer]);

  useEffect(() => {
    setDocumentTitle("Collection");
    dispatch({
      type: "SHOW_SIDEBAR_TRUE",
    });
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
        alignItems: "flex-start",
        marginBottom: "66px",
      }}
    >
      <BreadcrumbsView />
      <TitleCollection
        title={collectionName}
        userName={offerAllData?.owner}
        currentUser={currentUser}
      />
      <div className={"list-button-wrapper"}>
        {tokenData.length > 0
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
        {isLoading && <div className="progress-token">
          <CircularProgress style={
            {
              width: "50px",
              height: "50px"
            }
          }
          />
        </div>}

        {showToken <= totalCount && <CustomButton
          onClick={loadToken}
          width="232px"
          height="48px"
          margin="20px 0 0 0"
          text="Show more"
        />
        }
      </div>
      <CollectionInfo
        offerData={offerDataCol}
        defaultImg={defaultImg}
        blockchain={blockchain}
        openTitle={true}
      />
      <AuthenticityBlock
        collectionToken={tokenData[0]?.authenticityLink}
        title={true}
      />
    </div>
  );
};

export const NftCollectionPage = memo(NftCollectionPageComponent);
