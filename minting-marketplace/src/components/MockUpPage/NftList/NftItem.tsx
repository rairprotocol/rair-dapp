//@ts-nocheck
import React, { useState, useCallback, useEffect, memo } from "react";
import { useHistory } from "react-router-dom";
import { SvgKey } from "./SvgKey";
import chainDataFront from "../utils/blockchainDataFront";
import ReactPlayer from "react-player";
// import { utils } from "ethers";

// import Swal from 'sweetalert2';
// import 'react-accessible-accordion/dist/fancy-example.css';
// import VideoList from "../../video/videoList";

const NftItemComponent = ({
  blockchain,
  price,
  pict,
  contractName,
  collectionIndexInContract,
  // primaryColor,
  // textColor,
  collectionName,
  ownerCollectionUser,
}) => {
  const history = useHistory();
  const [metaDataProducts, setMetaDataProducts] = useState();
  const [playing, setPlaying] = useState(false);

  const handlePlaying = () => {
    setPlaying((prev) => !prev);
  };
  const getProductAsync = useCallback(async () => {
    // if (pict === defaultImg) {
      const responseProductMetadata = await (
        await fetch(`/api/nft/network/${blockchain}/${contractName}/${collectionIndexInContract}`, {
          method: "GET",
        })
      ).json();
      if (responseProductMetadata.result.tokens.length > 0) {
        setMetaDataProducts(responseProductMetadata.result?.tokens[0]);
      }
    // }
  }, [collectionIndexInContract, contractName, blockchain]);

  useEffect(() => {
    getProductAsync();
  }, [getProductAsync]);

  function RedirectToMockUp() {
    redirection();
  }

  // const waitResponse = useCallback(async () => {
  // const data = await getData();
  // if (data && data.metadata) {
  // setSelected(data.metadata);
  // setSelectedToken(data.token);
  // openModal();
  // }
  // }, [getData, openModal, setSelected]);

  const redirection = () => {
    history.push(`/collection/${blockchain}/${contractName}/${collectionIndexInContract}/0`);
  };

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

  function ch(){
    if(maxPrice === minPrice){
     const samePrice = maxPrice;
      return `${samePrice} ${chainDataFront[blockchain]?.name}`
    } return `${minPrice} – ${maxPrice} ${chainDataFront[blockchain]?.name}`
  }

  const minPrice = arrayMin(price);
  const maxPrice = arrayMax(price);

  return (
    <>
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
          onClick={() => { if (!metaDataProducts?.metadata?.animation_url) RedirectToMockUp() }}
          className="col-12 rounded"
          style={{
            top: 0,
            position: "relative",
            height: "96%",
            cursor: "pointer"
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
              src={metaDataProducts?.metadata?.image ? metaDataProducts?.metadata?.image : pict}
              style={{ position: "absolute", bottom: 0, borderRadius: "16px", objectFit: "contain" }}
              className="col-12 h-100 w-100"
            />
          )}
          {<SvgKey color={'white'} />}
        </div>
        <div className="col description-wrapper pic-description-wrapper">
          <span className="description-title">
            {/* {collectionName} */}
            {collectionName.slice(0, 14)}
            {collectionName.length > 12 ? "..." : ""}
            <br />
          </span>
          <span className="description">
            {ownerCollectionUser.slice(0, 7)}
            {ownerCollectionUser.length > 10 ? "..." : ""}
            <br></br>
          </span>
          <div className="description-small" style={{ paddingRight: "16px" }}>
            <img
              className="blockchain-img"
              src={`${chainDataFront[blockchain]?.image}`}
              alt=""
            />
            <span className="description ">{minPrice} {chainDataFront[blockchain]?.name} </span>
            {/* <span className="description ">{utils
            .formatEther(minPrice !== Infinity && minPrice !== undefined ? minPrice : 0)
            .toString()} {chainDataFront[blockchain]?.name} </span> */}
          </div>
          <div onClick={RedirectToMockUp} className="description-big">
            <img
              className="blockchain-img"
              src={`${chainDataFront[blockchain]?.image}`}
              alt=""
            />
            <span className="description description-price">
              {ch()}
              {/* {minPrice} - {maxPrice} {chainDataFront[blockchain]?.name} */}
              {/* {minPrice} - {maxPrice} ETH{" "} */}
            </span>
            <span className="description-more">View item</span>
          </div>
        </div>
      </div>
    </>
  );
};
// export default NftItem;
export const NftItem = memo(NftItemComponent);