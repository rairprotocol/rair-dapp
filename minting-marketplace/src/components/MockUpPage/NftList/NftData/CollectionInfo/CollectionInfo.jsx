import React from 'react';
import "./CollectionInfo.css";
import chainDataFront from "./../../../utils/blockchainDataFront";

const CollectionInfo = ({ defaultImg, blockchain }) => {
    return <div className="wrapper-collection-info">
        <div className="collection-info-head">
            Collection info
        </div>
        <div className="contianer-collection-info">
            <div className="collection-info-title">
                <div className="collection-part-text">
                    Item rank
                </div>
                <div className="collection-part-text">
                    Rank
                </div>
                <div className="collection-part-text">
                    Availability
                </div>
                <div className="collection-part-text">
                    Floor Price
                </div>
            </div>
            <div className="collection-info-body">
                <div className="block-item-collection">
                    <div className="item-name">
                        <img src={defaultImg} alt="rair-tech" />
                        <div className="item-name-text">
                            #01 (UR)
                        </div>
                    </div>
                    <div className="item-rank">
                        <p>Ultra Rair</p>
                    </div>
                    <div className="item-availa">
                        <p>1 /1 </p>
                    </div>
                    <div className="item-price">
                        <img src={chainDataFront[blockchain].image} alt="blockchain" />
                    </div>
                </div>
            </div>
        </div>
    </div>
};

export default CollectionInfo;
