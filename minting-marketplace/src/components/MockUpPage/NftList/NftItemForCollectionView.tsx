//@ts-nocheck
import React, { useState, memo } from "react";
import { useHistory, useParams } from "react-router-dom";
import { utils } from "ethers";
import { SvgKey } from "./SvgKey";
import chainDataFront from "../utils/blockchainDataFront";
import ReactPlayer from "react-player";

const NftItemForCollectionViewComponent = ({
  blockchain,
  // price,
  pict,
  // contractName,
  // collectionIndexInContract,
  // collectionName,
  // ownerCollectionUser,
  offerPrice,
  // handleClickToken,
  // token,
  index,
  metadata,
  // setSelectedToken,
  // selectedToken,
  contract,
  ownerAddress,
  offer,
  pic,
  currentUser,
  offerData,
  primaryColor,
  productsFromOffer,
  selectedData,
  textColor,
  tokenData,
  totalCount,
  product,
}) => {
  const params = useParams();
  const history = useHistory();
  const [metaDataProducts /*setMetaDataProducts*/] = useState();
  const [playing, setPlaying] = useState(false);
  const handlePlaying = () => {
    setPlaying((prev) => !prev);
  };

  function RedirectToMockUp() {
    redirection();
  }

  const redirection = () => {
    history.push(
      `/tokens/${blockchain}/${params.contract}/${params.product}/${index}`
    );
  };

  if (offerPrice) {
    var minPrice = arrayMin(offerPrice);
    var maxPrice = arrayMax(offerPrice);
  }

  function arrayMin(arr) {
    let len = arr.length,
      min = Infinity;
    while (len--) {
      if (arr[len] < min) {
        min = arr[len];
      }
    }
    return min;
  }

  function arrayMax(arr) {
    let len = arr.length,
      max = -Infinity;
    while (len--) {
      if (arr[len] > max) {
        max = arr[len];
      }
    }
    return max;
  }

  function checkPrice() {
    let maxPriceF = maxPrice;
    let minPriceF = minPrice;

    if (maxPrice && minPrice) {
      if (maxPrice === minPrice) {
        const samePrice = maxPrice;
        // return `${samePrice} ${chainDataFront[blockchain]?.name}`;
        return `${utils
          .formatEther(
            samePrice !== Infinity && samePrice !== undefined ? samePrice : 0
          )
          .toString()} ${chainDataFront[blockchain]?.name}`;
      }
      // return `${minPrice} – ${maxPrice} ${chainDataFront[blockchain]?.name}`;

      if(maxPriceF && minPriceF && maxPriceF !== Infinity  &&  minPriceF !== Infinity){
        return `${utils
          .formatEther(
            minPriceF !== Infinity && minPriceF !== undefined ? minPriceF : 0
          )
          .toString()} 
          – 
          ${utils
            .formatEther(
              maxPriceF !== Infinity && maxPriceF !== undefined ? maxPriceF : 0
            )
            .toString()} 
          ${chainDataFront[blockchain]?.name}`;
      }
      
    }
  }

  return (
    <div>
      <div
        className="col-12 col-sm-6 col-md-4 col-lg-3 px-1 text-start video-wrapper"
        style={{
          height: "291px",
          width: "291px",
          border: "none",
          backgroundColor: "transparent",
          overflow: "hidden",
        }}
      >
        <div
          onClick={() => {
            if (!metaDataProducts?.metadata?.animation_url) RedirectToMockUp();
          }}
          className="col-12 rounded"
          style={{
            top: 0,
            position: "relative",
            height: "96%",
            cursor: "pointer",
          }}
        >
          {metaDataProducts?.metadata?.animation_url && (
            <div onClick={handlePlaying} className="btn-play">
              {playing ? (
                <div>
                  <i className="fas fa-pause"></i>
                </div>
              ) : (
                <div>
                  <i className="fas fa-play"></i>
                </div>
              )}
            </div>
          )}
          {metaDataProducts?.metadata?.animation_url ? (
            <div
              style={{
                borderRadius: "16px",
                overflow: "hidden",
              }}
            >
              <ReactPlayer
                alt="thumbnail"
                url={`${metaDataProducts.metadata?.animation_url}`}
                light={
                  metaDataProducts.metadata?.image
                    ? metaDataProducts.metadata?.image
                    : pict
                }
                style={{
                  position: "absolute",
                  bottom: 0,
                  borderRadius: "16px",
                  overflow: "hidden",
                }}
                autoPlay={false}
                className="col-12 h-100 w-100"
                onReady={handlePlaying}
                playing={playing}
                onEnded={handlePlaying}
              />
            </div>
          ) : (
            <img
              alt="thumbnail"
              src={
                // metaDataProducts?.metadata?.image
                metadata?.image
                  ? // ? metaDataProducts?.metadata?.image
                    metadata?.image
                  : pict
              }
              style={{
                position: "absolute",
                bottom: 0,
                borderRadius: "16px",
                objectFit: "contain",
              }}
              className="col-12 h-100 w-100"
            />
          )}
          {<SvgKey />}
          {offer === 0 ? (
            <SvgKey color={"#E4476D"} />
          ) : offer === 1 ? (
            <SvgKey color={"#CCA541"} />
          ) : (
            <SvgKey color={"silver"} />
          )}
        </div>
        <div className="col description-wrapper pic-description-wrapper wrapper-for-collection-view">
          <span className="description-title">
            {metadata?.name === "none" ? contract : metadata?.name}

            {/* {contract} */}
            {/* {contract.slice(0, 14)} */}
            {/* {contract.length > 12 ? "..." : ""} */}
            <br />
          </span>
          {/* <span className="description"> */}
          {/* {ownerAddress} */}
          {/* {ownerAddress.slice(0, 7)} */}
          {/* {ownerAddress.length > 10 ? "..." : ""} */}
          {/* <br></br> */}
          {/* </span> */}
          <div
            className="description-small"
            style={{
              paddingRight: "16px",
              textAlign: "center",
              lineHeight: "9px",
            }}
          >
            <img
              className="blockchain-img"
              src={`${chainDataFront[blockchain]?.image}`}
              alt=""
            />
            <span className="description ">
              {/* {minPrice} {chainDataFront[blockchain]?.name}{" "} */}
              {utils
                .formatEther(
                  minPrice !== Infinity && minPrice !== undefined ? minPrice : 0
                )
                .toString()}{" "}
              {chainDataFront[blockchain]?.name}
            </span>
          </div>
          <div onClick={RedirectToMockUp} className="description-big">
            <img
              className="blockchain-img"
              src={`${chainDataFront[blockchain]?.image}`}
              alt=""
            />
            <span className="description description-price description-price-unlockables-page">
              {checkPrice()}
              {/* {minPrice} - {maxPrice} {chainDataFront[blockchain]?.name} */}
              {/* {minPrice} - {maxPrice} ETH{" "} */}
            </span>
            <span className="description-more">View item</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NftItemForCollectionView = memo(NftItemForCollectionViewComponent);
