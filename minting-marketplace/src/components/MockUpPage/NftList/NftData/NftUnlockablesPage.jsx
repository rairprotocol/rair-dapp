import React, { useState /*useCallback*/ } from "react";
import { BreadcrumbsView } from "../Breadcrumbs/Breadcrumbs";
import NftSingleUnlockables from "./NftSingleUnlockables";

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

      <NftSingleUnlockables
        blockchain={blockchain}
        contract={contract}
        product={product}
        productsFromOffer={productsFromOffer}
        selectedData={selectedData}
        selectedToken={selectedToken}
      />
    </div>
  );
};

export default NftUnlockablesPage;
