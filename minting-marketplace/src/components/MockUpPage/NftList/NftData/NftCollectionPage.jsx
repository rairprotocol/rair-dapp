import React, { memo, useEffect } from "react";
import Skeleton from "@mui/material/Skeleton";
import { NftItemForCollectionView } from "../NftItemForCollectionView";
import { BreadcrumbsView } from "../Breadcrumbs/Breadcrumbs";
import { useDispatch } from "react-redux";
import setDocumentTitle from "../../../../utils/setTitle";
import { useHistory } from "react-router-dom";
import TitleCollection from "./TitleCollection/TitleCollection";

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
  data,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    setDocumentTitle("Collection");
    dispatch({
      type: "SHOW_SIDEBAR_TRUE",
    });
  }, [dispatch]);

  useEffect(() => {
    window.scroll(0, 0)
  }, [])

  const goBack = () => {
    history.goBack();
  }


  const defaultImg =
    "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW";



  if (tokenData.length === 0) {
    return <>
      <div style={{
        cursor: "pointer",
        color: "rgb(232, 130, 213)",
        fontSize: "2rem"
      }} onClick={() => goBack()} className="arrow-back">
        <i className="fas fa-arrow-alt-circle-left"></i>
      </div>
      <h1>Don't have product</h1>
    </>
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignContent: "flex-start",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <BreadcrumbsView />
      {/* <div className="df"><h1>title</h1></div> */}
      <TitleCollection title={tokenData[0].contract} userName={tokenData[0].ownerAddress} />
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
        <button>Show more</button>
      </div>
    </div>
  );
};

export const NftCollectionPage = memo(NftCollectionPageComponent);
