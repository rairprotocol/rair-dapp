import React, { useEffect } from "react";
import CustomButton from "../../utils/button/CustomButton";
import { BreadcrumbsView } from "../Breadcrumbs/Breadcrumbs";
import NftSingleUnlockables from "./NftSingleUnlockables";
import VideoPlayerView from "./UnlockablesPage/VideoPlayerView";
import { useDispatch } from "react-redux";
import setDocumentTitle from "../../../../utils/setTitle";
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
  setTokenDataFiltered,
}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    setDocumentTitle("Unlockables");
    dispatch({
      type: "SHOW_SIDEBAR_TRUE",
    });
  }, [dispatch]);
  return (
    <div>
      <BreadcrumbsView />
      <VideoPlayerView productsFromOffer={productsFromOffer} />

      <div style={{ maxWidth: "1250px", margin: "auto" }} className="">
        <NftSingleUnlockables
          blockchain={blockchain}
          contract={contract}
          product={product}
          productsFromOffer={productsFromOffer}
          selectedData={selectedData}
          selectedToken={selectedToken}
          tokenData={tokenData}
          setTokenDataFiltered={setTokenDataFiltered}
        />
      </div>

      {productsFromOffer?.length < 2 ? (
        <CustomButton
          text="Show More"
          width="288px"
          height="48px"
          margin={"0 auto"}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default NftUnlockablesPage;
