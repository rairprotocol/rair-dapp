//@ts-nocheck
import React, { useEffect, useRef, useState } from "react";

import NftSingleUnlockables from "./NftSingleUnlockables";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../../hooks/useReduxHooks";
import { CatalogVideoItem } from "../../../../types/commonTypes";
import { MediaFile } from "../../../../types/databaseTypes";
import setDocumentTitle from "../../../../utils/setTitle";
import LoadingComponent from "../../../common/LoadingComponent";
import CustomButton from "../../utils/button/CustomButton";
import { BreadcrumbsView } from "../Breadcrumbs/Breadcrumbs";
import { INftUnlockablesPage } from "../nftList.types";

import TitleCollection from "./TitleCollection/TitleCollection";
import VideoPlayerView from "./UnlockablesPage/VideoPlayerView";

const NftUnlockablesPage: React.FC<INftUnlockablesPage> = ({
  embeddedParams,
  productsFromOffer,
  selectedToken,
  someUsersData,
  collectionName,
  setTokenDataFiltered,
}) => {
  const [selectVideo, setSelectVideo] = useState<CatalogVideoItem>();
  const [isDiamond, setIsDiamond] = useState<undefined | boolean>(undefined);

  const myRef = useRef<HTMLDivElement>(null);

  const { currentCollection } = useAppSelector((store) => store.tokens);

  const dispatch = useAppDispatch();

  useEffect(() => {
    setDocumentTitle("Unlockables");
  }, [dispatch]);

  useEffect(() => {
    if (embeddedParams) {
      myRef.current?.scrollIntoView();
    } else {
      window.scroll(0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentCollection && Object.keys(currentCollection).length > 0) {
      setIsDiamond(currentCollection[0].offer.diamond);
    }
  }, [currentCollection]);

  useEffect(() => {
    if (productsFromOffer) {
      setSelectVideo(productsFromOffer[0]);
    }
  }, [setSelectVideo, productsFromOffer]);

  if (productsFromOffer === undefined) {
    return <LoadingComponent />;
  }

  return (
    <div ref={myRef} className="wrapper-unlockables-page">
      <BreadcrumbsView embeddedParams={embeddedParams} />
      {currentCollection && selectedToken && (
        <TitleCollection
          title={collectionName}
          someUsersData={someUsersData}
          userName={currentCollection[selectedToken]?.ownerAddress}
        />
      )}
      <div style={{ marginBottom: 108 }}>
        <VideoPlayerView
          productsFromOffer={productsFromOffer}
          selectVideo={selectVideo}
          setSelectVideo={setSelectVideo}
          unlockables={true}
        />
        <div style={{ width: "85vw", margin: "auto" }} className="">
          <NftSingleUnlockables
            embeddedParams={embeddedParams}
            productsFromOffer={productsFromOffer}
            setSelectVideo={setSelectVideo}
            setTokenDataFiltered={setTokenDataFiltered}
            isDiamond={isDiamond}
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
    </div>
  );
};

export default NftUnlockablesPage;
