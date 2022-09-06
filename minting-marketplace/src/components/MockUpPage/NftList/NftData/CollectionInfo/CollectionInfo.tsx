import React from 'react';
import './CollectionInfo.css';
import { utils } from 'ethers';
import chainData from './../../../../../utils/blockchainData';
import { useSelector } from 'react-redux';
import { BlockItemCollection, CollectionInfoBody } from './CollectionInfoItems';
import { ICollectionInfo } from '../../nftList.types';
import { RootState } from '../../../../../ducks';
import { ColorChoice } from '../../../../../ducks/colors/colorStore.types';

const CollectionInfo: React.FC<ICollectionInfo> = ({
  blockchain,
  offerData,
  openTitle,
  someUsersData
}) => {
  const primaryColor = useSelector<RootState, ColorChoice>(
    (store) => store.colorStore.primaryColor
  );
  const defaultPhoto =
    'https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW';

  return (
    <div className="wrapper-collection-info">
      {openTitle && <div className="collection-info-head">Collection Info</div>}
      <div
        className="contianer-collection-info"
        style={{
          background: `${primaryColor === 'rhyno' ? '#bdbdbd' : '#383637'}`
        }}>
        <div className="collection-info-title">
          <div className="collection-part-text">Item name</div>
          <div className="collection-part-text">Rank</div>
          <div className="collection-part-text">Availability</div>
          <div className="collection-part-text">Floor Price</div>
        </div>
        <CollectionInfoBody
          primaryColor={primaryColor}
          className="collection-info-body">
          {offerData &&
            offerData
              ?.sort((a, b) => {
                if (b.offerIndex > a.offerIndex) {
                  return -1;
                }
                return 0;
              })
              .map((token, index) => {
                return (
                  <BlockItemCollection
                    className="block-item-collection"
                    key={index + token.price}>
                    <div className="item-name">
                      <img
                        src={
                          someUsersData?.avatar
                            ? someUsersData?.avatar
                            : defaultPhoto
                        }
                        alt="rair-tech"
                      />
                      <div className="item-name-text">{token.offerName}</div>
                    </div>
                    <div className="item-rank">
                      {token.offerIndex === '0' ? (
                        <i style={{ color: 'red' }} className="fas fa-key" />
                      ) : token.offerIndex === '1' ? (
                        '🔑'
                      ) : (
                        <i style={{ color: 'silver' }} className="fas fa-key" />
                      )}{' '}
                      &nbsp;
                      {token.offerIndex === '0' && 'Ultra Rair'}
                      {token.offerIndex === '1' && 'Rair'}
                      {token.offerIndex >= '2' && 'Common'}
                    </div>
                    <div className="item-availa">
                      <p>
                        {token.copies - token.soldCopies} / {token.copies}
                      </p>
                    </div>
                    <div className="item-price">
                      <img
                        src={blockchain && chainData[blockchain]?.image}
                        alt="blockchain"
                      />
                      {utils
                        .formatEther(
                          +token.price !== Infinity && token.price !== undefined
                            ? token.price.toString()
                            : 0
                        )
                        .toString()}{' '}
                      {blockchain && chainData[blockchain]?.symbol}
                      {/* {token.price} */}
                    </div>
                  </BlockItemCollection>
                );
              })}
        </CollectionInfoBody>
      </div>
    </div>
  );
};

export default CollectionInfo;
