//@ts-nocheck
import React, { memo } from "react";
// import firstPict from "../assets/Graphics-WEB-2021-01.png";
// import secondPict from "../assets/Graphics-WEB-2021-02.png";
// import thirdPict from "../assets/Graphics-WEB-2021-03.png";
import Skeleton from "@mui/material/Skeleton";
import { NftItem } from "./NftItem";

const NftListComponent = ({
  data,
  // dataAll,
  primaryColor,
  textColor,
  titleSearch,
  sortItem,
}) => {
  const defaultImg =
    "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW";

  const filteredData =
    data &&
    data
      .filter((item) => {
        return item.name.toLowerCase().includes(titleSearch.toLowerCase());
      })
      .sort((a, b) => {
        if (sortItem === "up") {
          if (a.name < b.name) {
            return 1;
          }
        }

        if (sortItem === "down") {
          if (a.name > b.name) {
            return -1;
          }
        }

        return 0;
      });

  return (
    <div className={"list-button-wrapper"}>
      {
        filteredData
          ? filteredData.map((contractData, index) => {
            if (contractData.cover !== "none") {
              return (
                <NftItem
                  key={`${contractData.id + "-" + contractData.productId + index
                    }`}
                  pict={contractData.cover ? contractData.cover : defaultImg}
                  allData={contractData}
                  contractName={contractData.contract}
                  price={contractData.offerData.map((p) => p.price)}
                  primaryColor={primaryColor}
                  textColor={textColor}
                  blockchain={contractData.blockchain}
                  collectionName={contractData.name}
                  ownerCollectionUser={contractData.user}
                  collectionIndexInContract={contractData.collectionIndexInContract}
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
          })
        // <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "20px" }} className="preloader-product">
        //     <CircularProgress size="70px" />
        // </div>
      }
      {/* <img
        className={
          "col-12 col-sm-6 col-md-4 col-lg-3 px-1 text-start pictures-wrapper"
        }
        width="291"
        height="291"
        src={firstPict}
        alt="first"
      />
      <img
        className={
          "col-12 col-sm-6 col-md-4 col-lg-3 px-1 text-start pictures-wrapper"
        }
        width="291"
        height="291"
        src={secondPict}
        alt="first"
      />
      <img
        className={
          "col-12 col-sm-6 col-md-4 col-lg-3 px-1 text-start pictures-wrapper"
        }
        width="291"
        height="291"
        src={thirdPict}
        alt="first"
      /> */}
    </div>
  );
};

// export default NftList
export const NftList = memo(NftListComponent);
