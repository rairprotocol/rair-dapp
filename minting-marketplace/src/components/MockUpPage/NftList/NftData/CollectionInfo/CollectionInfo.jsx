import React, { useEffect } from "react";
import "./CollectionInfo.css";
import { utils } from "ethers";
import chainDataFront from "./../../../utils/blockchainDataFront";

const CollectionInfo = ({ defaultImg, blockchain, offerData }) => {
  return (
    <div className="wrapper-collection-info">
      {/* <div className="collection-info-head">
            Collection info
        </div> */}
      <div className="contianer-collection-info">
        <div className="collection-info-title">
          <div className="collection-part-text">Item rank</div>
          <div className="collection-part-text">Rank</div>
          <div className="collection-part-text">Availability</div>
          <div className="collection-part-text">Floor Price</div>
        </div>
        <div className="collection-info-body">
          {offerData &&
            offerData?.map((token, index) => {
              return (
                <div
                  key={index + token.price}
                  className="block-item-collection"
                >
                  <div className="item-name">
                    <img src={defaultImg} alt="rair-tech" />
                    <div className="item-name-text">{token.offerName}</div>
                  </div>
                  <div className="item-rank">
                    {token.offerIndex === 0 && "Ultra Rair"}
                    {token.offerIndex === 1 && "Rair"}
                    {token.offerIndex >= 2 && "Common"}
                  </div>
                  <div className="item-availa">
                    <p>
                      {token.soldCopies} / {token.copies}
                    </p>
                  </div>
                  <div className="item-price">
                    <img
                      src={chainDataFront[blockchain]?.image}
                      alt="blockchain"
                    />
                    {utils
                      .formatEther(
                        token.price !== Infinity && token.price !== undefined ? token.price : 0
                      )
                      .toString()}{" "}
                      {chainDataFront[blockchain]?.name}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default CollectionInfo;
