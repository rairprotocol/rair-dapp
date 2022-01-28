import React, { memo, useEffect } from "react";
import Skeleton from "@mui/material/Skeleton";
import { NftItemForCollectionView } from "../NftItemForCollectionView";
import { BreadcrumbsView } from "../Breadcrumbs/Breadcrumbs";
import { useDispatch } from "react-redux";
import setDocumentTitle from "../../../../utils/setTitle";

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
  const dispatch = useDispatch();
  useEffect(() => {
    setDocumentTitle("Collection");
    dispatch({
      type: "SHOW_SIDEBAR_TRUE",
    });
  }, [dispatch]);
  const defaultImg =
    "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW";
  if (tokenData.length === 0) {
    return <h1>Dont have product</h1>;
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
      <div>
        <h1>Show More</h1>
      </div>
    </div>
  );
};

export const NftCollectionPage = memo(NftCollectionPageComponent);
