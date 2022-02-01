import React, { useState /*useCallback*/ } from "react";
import CustomButton from "../../utils/button/CustomButton";
import { BreadcrumbsView } from "../Breadcrumbs/Breadcrumbs";
import NftSingleUnlockables from "./NftSingleUnlockables";
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
      <VideoPlayerView />
      <NftSingleUnlockables
        blockchain={blockchain}
        contract={contract}
        product={product}
        productsFromOffer={productsFromOffer}
        selectedData={selectedData}
        selectedToken={selectedToken}
      />

      <CustomButton 
        text='Show More' 
        width="288px"
        height="48px"
      />
    </div>
  );
};

export default NftUnlockablesPage;
