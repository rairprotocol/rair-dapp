//@ts-nocheck
import { FC, memo, useContext, useState } from "react";

import { NftItem } from "./NftItem";
import { INftListComponent } from "./nftList.types";

import { useAppSelector } from "../../../hooks/useReduxHooks";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import {
  GlobalModalContext,
  TGlobalModalContext,
} from "../../../providers/ModalProvider";
import { dataStatuses } from "../../../redux/commonTypes";
import LoadingComponent from "../../common/LoadingComponent";
import HomePageFilterModal from "../../GlobalModal/FilterModal/FilterModal";
import GlobalModal from "../../GlobalModal/GlobalModal";

const NftListComponent: FC<INftListComponent> = ({ titleSearch, sortItem }) => {
  const { catalog, catalogStatus } = useAppSelector((store) => store.tokens);
  const { globalModalState } =
    useContext<TGlobalModalContext>(GlobalModalContext);
  const { width } = useWindowDimensions();
  const isMobileDesign = width < 1100;
  const modalParentNode = width > 1100 ? "filter-modal-parent" : "App";

  const [playing, setPlaying] = useState<null | number>(null);

  if (catalogStatus === dataStatuses.Loading) {
    return <LoadingComponent />;
  }

  const filteredData = catalog
    .filter((item) => {
      return (
        item.product.cover !== "none" &&
        item.product.name.toLowerCase().includes(titleSearch.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortItem === "up") {
        if (a.product.name < b.product.name) {
          return 1;
        }
      }

      if (sortItem === "down") {
        if (a.product.name > b.product.name) {
          return -1;
        }
      }

      return 0;
    });

  if (catalogStatus !== dataStatuses.Complete) {
    return <LoadingComponent />;
  }

  return (
    <div className={"nft-items-wrapper"}>
      <div
        className={`${
          width > 701
            ? "list-button-wrapper"
            : "list-button-wrapper-grid-template"
        } ${globalModalState?.isOpen ? "with-modal" : ""}`}
      >
        {filteredData && filteredData.length > 0 ? (
          filteredData.map((catalogItem, index) => {
            return (
              <NftItem
                key={index}
                item={catalogItem}
                //pict={contractData.cover ? contractData.cover : defaultImg}
                //contractName={contractData.contract}
                //price={contractData.offerData.map((p) => String(p.price))}
                //blockchain={contractData.blockchain}
                //collectionName={contractData.name}
                //ownerCollectionUser={contractData.user}
                //userData={contractData.userData}
                index={index}
                playing={playing}
                setPlaying={setPlaying}
                //collectionIndexInContract={contractData.collectionIndexInContract}
              />
            );
          })
        ) : (
          <div className="list-wrapper-empty">
            <h2>No items to display</h2>
          </div>
        )}
      </div>
      <div id="filter-modal-parent">
        <GlobalModal
          parentContainerId={modalParentNode}
          renderModalContent={() => (
            <HomePageFilterModal isMobileDesign={isMobileDesign} />
          )}
        />
      </div>
    </div>
  );
};

export const NftList = memo(NftListComponent);
