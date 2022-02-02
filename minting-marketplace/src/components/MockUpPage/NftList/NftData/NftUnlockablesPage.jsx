import React, { useState /*useCallback*/ } from "react";
import CustomButton from "../../utils/button/CustomButton";
import { BreadcrumbsView } from "../Breadcrumbs/Breadcrumbs";
import NftSingleUnlockables from "./NftSingleUnlockables";
import NftDifferentRarity from "./UnlockablesPage/NftDifferentRarity/NftDifferentRarity";
import VideoPlayerView from "./UnlockablesPage/VideoPlayerView";

const NftUnlockablesPage = ({
  blockchain,
  contract,
  currentUser,
  data,
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
}) => {
  return (
    <div>
      <BreadcrumbsView />
      <VideoPlayerView productsFromOffer={productsFromOffer} />
      <NftDifferentRarity />
      <div style={{ maxWidth: "1240px", margin: "auto" }} className="">
        <NftSingleUnlockables
          blockchain={blockchain}
          contract={contract}
          product={product}
          productsFromOffer={productsFromOffer}
          selectedData={selectedData}
          selectedToken={selectedToken}
        />
      </div>

      {productsFromOffer?.length > 2 ? (
        <CustomButton text="Show More" width="288px" height="48px" />
      ) : (
        <></>
      )}
    </div>
  );
};

export default NftUnlockablesPage;
