import React, { useState, useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { SvgKey } from "./SvgKey";
import chainDataFront from "../utils/blockchainDataFront";
import ReactPlayer from "react-player";

// import Swal from 'sweetalert2';
// import 'react-accessible-accordion/dist/fancy-example.css';
// import VideoList from "../../video/videoList";

const NftItem = ({
  blockchain,
  price,
  pict,
  contractName,
  collectionIndexInContract,
  primaryColor,
  textColor,
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
        await fetch(`/api/nft/${contractName}/${collectionIndexInContract}`, {
          method: "GET",
        })
      ).json();
      if (responseProductMetadata.result.length > 0) {
        setMetaDataProducts(responseProductMetadata.result[0]);
      }
    // }
  }, [collectionIndexInContract, contractName]);

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
    history.push(`/tokens/${contractName}/${collectionIndexInContract}/0`);
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
              style={{ position: "absolute", bottom: 0, borderRadius: "16px" }}
              className="col-12 h-100 w-100"
            />
          )}
          {<SvgKey />}
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
            <span className="description ">{minPrice} ETH </span>
          </div>
          <div onClick={RedirectToMockUp} className="description-big">
            <img
              className="blockchain-img"
              src={`${chainDataFront[blockchain]?.image}`}
              alt=""
            />
            <span className="description description-price">
              {minPrice} - {maxPrice} ETH{" "}
            </span>
            <span className="description-more">View item</span>
          </div>
        </div>
      </div>
    </>
  );
};
export default NftItem;
