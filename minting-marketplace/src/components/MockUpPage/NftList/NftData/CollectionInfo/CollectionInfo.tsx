import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import { utils } from 'ethers';
import Swal from 'sweetalert2';

import { BlockItemCollection, CollectionInfoBody } from './CollectionInfoItems';

import {
  TNftItemResponse,
  TTokenData
} from '../../../../../axios.responseTypes';
import { RootState } from '../../../../../ducks';
import { ColorChoice } from '../../../../../ducks/colors/colorStore.types';
import useWindowDimensions from '../../../../../hooks/useWindowDimensions';
import PurchaseTokenButton from '../../../../common/PurchaseToken';
import { ImageLazy } from '../../../ImageLazy/ImageLazy';
import { TParamsNftItemForCollectionView } from '../../../mockupPage.types';
import { ICollectionInfo } from '../../nftList.types';

import chainData from './../../../../../utils/blockchainData';

import './CollectionInfo.css';

const CollectionInfo: React.FC<ICollectionInfo> = ({
  blockchain,
  offerData,
  openTitle,
  mintToken,
  contractAddress,
  setPurchaseStatus
}) => {
  const primaryColor = useSelector<RootState, ColorChoice>(
    (store) => store.colorStore.primaryColor
  );
  const params = useParams<TParamsNftItemForCollectionView>();
  const navigate = useNavigate();
  const [tokenData, setTokenData] = useState<TTokenData[] | null>(null);
  const { width } = useWindowDimensions();

  const defaultPhoto =
    'https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW';

  const getTokens = async () => {
    const { data } = await axios.get<TNftItemResponse>(
      `/api/nft/network/${params.blockchain}/${params.contract}/${params.product}?fromToken=0&toToken=0`
    );

    setTokenData(data.result.tokens);
  };

  useEffect(() => {
    getTokens();
  }, []);

  return (
    <div
      className={`wrapper-collection-info ${mintToken ? 'mint' : ''} ${
        primaryColor === 'rhyno' ? 'rhyno' : ''
      }`}>
      {openTitle && <div className="collection-info-head">Collection Info</div>}
      <div className="contianer-collection-info">
        {mintToken && width < 1025 ? (
          <></>
        ) : (
          <div className="collection-info-title">
            <div className="collection-part-text">Item name</div>
            {!mintToken && <div className="collection-part-text">Rank</div>}
            <div className="collection-part-text">Availability</div>
            <div className="collection-part-text">Floor Price</div>
          </div>
        )}
        <CollectionInfoBody
          primaryColor={primaryColor}
          className={`collection-info-body ${mintToken ? 'mint' : ''}`}>
          {offerData &&
            offerData
              ?.sort((a, b) => {
                if (b.offerIndex > a.offerIndex) {
                  return 1;
                }
                return 0;
              })
              .filter((offer) => offer.hidden !== true && !offer.sold)
              .map((token, index) => {
                return (
                  <BlockItemCollection
                    className="block-item-collection"
                    key={index + token.price}>
                    <div className="item-name">
                      <ImageLazy
                        src={
                          tokenData && tokenData[0].metadata
                            ? token.range[0] &&
                              tokenData[token.range[0]].metadata.image
                            : defaultPhoto
                        }
                        alt="Created by user"
                      />
                      <div className="item-name-text">{token.offerName}</div>
                    </div>
                    {!mintToken && (
                      <div className="item-rank">
                        {token.diamond ? (
                          <>
                            {/* {index.toString() === '0' && (
                              <i
                                style={{ color: 'red' }}
                                className="fas fa-key"
                              />
                            )}
                            {index.toString() === '1' && '🔑'}
                            {index.toString() >= '2' && (
                              <i
                                style={{ color: 'silver' }}
                                className="fas fa-key"
                              />
                            )} */}
                          </>
                        ) : (
                          <>
                            {/* {token.offerIndex === '0' && (
                              <i
                                style={{ color: 'red' }}
                                className="fas fa-key"
                              />
                            )}
                            {token.offerIndex === '1' && '🔑'}
                            {token.offerIndex >= '2' && (
                              <i
                                style={{ color: 'silver' }}
                                className="fas fa-key"
                              />
                            )} */}
                          </>
                        )}{' '}
                        &nbsp;
                        {token.diamond ? (
                          <>
                            {index.toString() === '0' && 'Ultra Rair'}
                            {index.toString() === '1' && 'Rair'}
                            {index.toString() &&
                              index.toString() >= '2' &&
                              'Common'}
                          </>
                        ) : (
                          <>
                            {token.offerIndex === '0' && 'Ultra Rair'}
                            {token.offerIndex === '1' && 'Rair'}
                            {token.offerIndex >= '2' && 'Common'}
                          </>
                        )}
                      </div>
                    )}
                    <div className="item-availa">
                      <p>
                        {token.copies - token.soldCopies} / {token.copies}
                      </p>
                    </div>
                    <div className="item-price">
                      <img
                        alt="Blockchain network"
                        src={blockchain && chainData[blockchain]?.image}
                      />
                      {utils
                        .formatEther(
                          +token.price !== Infinity && token.price !== undefined
                            ? token.price.toString()
                            : 0
                        )
                        .toString()}{' '}
                      {blockchain && chainData[blockchain]?.symbol}
                    </div>
                    {mintToken && (
                      <div className="collection-mint-button">
                        <PurchaseTokenButton
                          contractAddress={contractAddress}
                          requiredBlockchain={blockchain}
                          collection={true}
                          offerIndex={[token.offerIndex]}
                          buttonLabel="Buy"
                          diamond={token.diamond}
                          setPurchaseStatus={setPurchaseStatus}
                          customSuccessAction={(nextToken) => {
                            Swal.fire(
                              'Success',
                              `You own token #${nextToken}!`,
                              'success'
                            ).then((result) => {
                              if (result.isConfirmed || result.isDismissed) {
                                navigate(
                                  `/tokens/${blockchain}/${params.contract}/${params.product}/${nextToken}`
                                );
                              }
                            });
                          }}
                        />
                      </div>
                    )}
                  </BlockItemCollection>
                );
              })}
        </CollectionInfoBody>
      </div>
    </div>
  );
};

export default CollectionInfo;
