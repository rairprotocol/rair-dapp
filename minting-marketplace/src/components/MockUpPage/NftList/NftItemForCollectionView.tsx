//@ts-nocheck
import React, { useState, memo, useCallback, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { utils } from "ethers";
import { SvgKey } from "./SvgKey";
import chainData from "../../../utils/blockchainData";
import defaultImage from "./../assets/defultUser.png";
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
  someUsersData,
  userName,
  tokenDataLength
}) => {
  const params = useParams();
  const history = useHistory();
  // const [metaDataProducts /*setMetaDataProducts*/] = useState();
  const [playing, setPlaying] = useState(false);
  const handlePlaying = () => {
    setPlaying((prev) => !prev);
  };

  const [isFileUrl, setIsFileUrl] = useState();

  const checkUrl = useCallback(() => {
    if (selectedData?.animation_url) {
      let fileUrl = selectedData?.animation_url,
        parts,
        ext =
          (parts = fileUrl.split("/").pop().split(".")).length > 1
            ? parts.pop()
            : "";
      setIsFileUrl(ext);
    }

  }, [selectedData?.animation_url, setIsFileUrl]);

  useEffect(() => {
    checkUrl()
  }, [checkUrl])

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
          .toString().slice(0, 4)} ${chainData[blockchain]?.symbol}`;
      }
      // return `${minPrice} – ${maxPrice} ${chainDataFront[blockchain]?.name}`;

      if (maxPriceF && minPriceF && maxPriceF !== Infinity && minPriceF !== Infinity) {
        return `${utils
          .formatEther(
            minPriceF !== Infinity && minPriceF !== undefined ? minPriceF : 0
          )
          .toString().slice(0, 4)} 
          – 
          ${utils
            .formatEther(
              maxPriceF !== Infinity && maxPriceF !== undefined ? maxPriceF : 0
            )
            .toString().slice(0, 5)} 
          ${chainData[blockchain]?.symbol}`
      }

    }
  }

  function fullPrice() {
    let maxPriceF = maxPrice;
    let minPriceF = minPrice;

    if (maxPrice && minPrice) {
      if (maxPrice === minPrice) {
        const samePrice = maxPrice;
        // return `${samePrice} ${chainDataFront[blockchain]?.name}`;
        return `${utils
          .formatEther(
            samePrice !== Infinity && samePrice !== undefined ? samePrice : 0
          )} ${chainData[blockchain]?.symbol}`;
      }
      // return `${minPrice} – ${maxPrice} ${chainDataFront[blockchain]?.name}`;

      if (maxPriceF && minPriceF && maxPriceF !== Infinity && minPriceF !== Infinity) {
        return `${utils
          .formatEther(
            minPriceF !== Infinity && minPriceF !== undefined ? minPriceF : 0
          )} 
          – 
          ${utils
            .formatEther(
              maxPriceF !== Infinity && maxPriceF !== undefined ? maxPriceF : 0
            )} 
          ${chainData[blockchain]?.symbol}`
      }

    }
  }

  let className = "col-12 p-1 col-sm-6 col-md-4 col-lg-3 text-start video-wrapper nft-item-collection";

  if (tokenDataLength < 4) {
    className += " standartSize";
  }

  return (

    <div className={className}>
      <div
        onClick={() => {
          if (!metadata?.animation_url) RedirectToMockUp();
        }}
        className="col-12 rounded"
        style={{
          top: 0,
          position: "relative",
          height: "100%",
          cursor: "pointer",
        }}
      >
        {metadata?.animation_url && (
          isFileUrl === 'gif' ? <></> :
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
        {metadata?.animation_url ? (
          isFileUrl === 'gif' ?
            <img
              alt="thumbnail"
              src={
                metadata?.animation_url
                  ?
                  metadata?.animation_url
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
            :
            <div
              style={{
                borderRadius: "16px",
                overflow: "hidden",
              }}
            >
              <ReactPlayer
                alt="thumbnail"
                url={`${metadata?.animation_url}`}
                light={
                  metadata?.image
                    ? metadata?.image
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
        {offer === "0" ? (
          <SvgKey color={"#E4476D"} bgColor={'rgba(34, 32, 33, 0.5)'} />
        ) : offer === "1" ? (
          <SvgKey color={"#CCA541"} bgColor={'rgba(34, 32, 33, 0.5)'} />
        ) : (
          <SvgKey color={"silver"} bgColor={'rgba(34, 32, 33, 0.5)'} />
        )}

        {/* <div className="description-collectionItem-hover">
            {metadata?.name === "none" ? contract : metadata?.name}
          </div> */}
        <div className="col description-wrapper pic-description-wrapper wrapper-for-collection-view">
          <div className="description-title">
            <div className="description-item-name"
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start"
              }}
            >
              {/* {"#" + index} */}
              {metadata?.name === "none" ? "#" + index : metadata?.name}
              <div
                className="brief-infor-nftItem"
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                {/* {metadata?.name === "none" ? contract : metadata?.name} */}
                <div>
                  {
                    someUsersData ? <div className="collection-block-user-creator">
                      <img
                        src={someUsersData.avatar ? someUsersData.avatar : defaultImage}
                        alt="user"
                      />
                      <h5 style={{ wordBreak: "break-all" }}>
                        {someUsersData.nickName ? someUsersData.nickName.length > 16 ? someUsersData.nickName.slice(0, 5) + "..." + someUsersData.nickName.slice(someUsersData.nickName.length - 4) :
                          someUsersData.nickName : userName.slice(0, 5) + "...." + userName.slice(userName.length - 4)}
                      </h5>
                    </div> : <div className="collection-block-user-creator">
                      <img
                        src={defaultImage}
                        alt="user"
                      />
                      <h5 style={{ wordBreak: "break-all" }}>
                        {userName && userName.slice(0, 5) + "...." + userName.slice(userName.length - 4)}
                      </h5>
                    </div>
                  }
                </div>
                <div className="collection-block-price">
                  <img src={chainData[blockchain]?.image} alt="blockchain" />
                  {checkPrice()}
                </div>
              </div>
            </div>
          </div>

          {/* <div
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
              {utils
                .formatEther(
                  minPrice !== Infinity && minPrice !== undefined ? minPrice : 0
                )
                .toString()}{" "}
              {chainDataFront[blockchain]?.name}
            </span>
          </div> */}
          <div onClick={RedirectToMockUp} className="description-big">
            <div>
              <img
                className="blockchain-img"
                src={`${chainData[blockchain]?.image}`}
                alt=""
              />
            </div>
            <span className="description description-price description-price-unlockables-page">
              {fullPrice()}
            </span>
            <span className="description-more">View item</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NftItemForCollectionView = memo(NftItemForCollectionViewComponent);
