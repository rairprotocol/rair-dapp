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
import InputSelect from '../../../../common/InputSelect';
import PurchaseTokenButton from '../../../../common/PurchaseToken';
import { ImageLazy } from '../../../ImageLazy/ImageLazy';
import { TParamsNftItemForCollectionView } from '../../../mockupPage.types';
import { ICollectionInfo } from '../../nftList.types';

import chainData from './../../../../../utils/blockchainData';
import { ModalContentCloseBtn } from './../../../../MockUpPage/utils/button/ShowMoreItems';

import './CollectionInfo.css';

const EasyMintRow = ({
  token,
  tokenData,
  defaultPhoto,
  blockchain,
  contractAddress,
  setPurchaseStatus,
  mintToken
}) => {
  const hotdropsVar = process.env.REACT_APP_HOTDROPS;
  const [tokensToMint, setTokensToMint] = useState('1');
  const remainingCopies = token.copies - token.soldCopies;
  const navigate = useNavigate();
  const params = useParams<TParamsNftItemForCollectionView>();
  return (
    <BlockItemCollection className="block-item-collection">
      <div className="item-name">
        <ImageLazy
          src={
            tokenData && tokenData[0]?.metadata
              ? token?.range[0] && tokenData[token.range[0]]?.metadata.image
              : defaultPhoto
          }
          alt="Created by user"
        />
        <div className="item-name-text">{token.offerName}</div>
      </div>
      <div className="item-availa">
        <p>
          {remainingCopies} / {token.copies}
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
      {remainingCopies > 0 ? (
        <div className="item-multi-mint">
          <InputSelect
            placeholder="Choose Quantity"
            options={[...Array(Math.min(remainingCopies, 30))].map(
              (_, index) => {
                return {
                  label: (index + 1).toString(),
                  value: (index + 1).toString()
                };
              }
            )}
            getter={tokensToMint}
            setter={setTokensToMint}
          />
        </div>
      ) : (
        <p>No tokens available.</p>
      )}
      {mintToken && (
        <div className={`collection-mint-button`}>
          {Number(token.copies - token.soldCopies) === Number(0) ? (
            <button disabled>Buy</button>
          ) : (
            <PurchaseTokenButton
              customButtonClassName={`${
                hotdropsVar === 'true' ? 'hotdrops-bg' : ''
              }`}
              amountOfTokensToPurchase={tokensToMint}
              contractAddress={contractAddress}
              requiredBlockchain={blockchain}
              collection={true}
              offerIndex={[token.offerIndex]}
              buttonLabel="Buy"
              diamond={token.diamond}
              setPurchaseStatus={setPurchaseStatus}
              customSuccessAction={(purchasedTokens) => {
                Swal.fire(
                  'Success',
                  `Token${tokensToMint !== '1' ? 's' : ''} purchased!`,
                  'success'
                ).then((result) => {
                  if (result.isConfirmed || result.isDismissed) {
                    navigate(
                      `/tokens/${blockchain}/${params.contract}/${params.product}/${purchasedTokens}`
                    );
                  }
                });
              }}
            />
          )}
        </div>
      )}
    </BlockItemCollection>
  );
};

const CollectionInfo: React.FC<ICollectionInfo> = ({
  blockchain,
  offerData,
  openTitle,
  mintToken,
  contractAddress,
  setPurchaseStatus,
  closeModal
}) => {
  const primaryColor = useSelector<RootState, ColorChoice>(
    (store) => store.colorStore.primaryColor
  );
  const params = useParams<TParamsNftItemForCollectionView>();
  const [tokenData, setTokenData] = useState<TTokenData[] | null>(null);
  const { width } = useWindowDimensions();

  const defaultPhoto =
    'https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW';

  const getTokens = async () => {
    const { data } = await axios.get<TNftItemResponse>(
      `/api/nft/network/${params.blockchain}/${params.contract}/${params.product}?fromToken=0&toToken=0`
    );
    // eslint-disable-next-line no-console
    console.log('API Response:', data);

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
            <div className="collection-part-text">Selection</div>
          </div>
        )}
        <CollectionInfoBody
          primaryColor={primaryColor}
          className={`collection-info-body ${mintToken ? 'mint' : ''}`}>
          {closeModal && (
            <div
              style={{
                position: 'fixed'
              }}>
              <ModalContentCloseBtn
                primaryColor={primaryColor}
                onClick={closeModal}>
                <i className="fas fa-times" style={{ lineHeight: 'inherit' }} />
              </ModalContentCloseBtn>
            </div>
          )}
          {offerData &&
            offerData
              ?.sort((a, b) => {
                if (b.offerIndex > a.offerIndex) {
                  return 1;
                }
                return 0;
              })
              .filter(
                (offer) =>
                  offer.offerIndex !== undefined &&
                  offer.hidden !== true &&
                  !offer.sold
              )
              .map((token, index) => {
                return (
                  <EasyMintRow
                    {...{
                      token,
                      tokenData,
                      defaultPhoto,
                      blockchain,
                      contractAddress,
                      setPurchaseStatus,
                      mintToken
                    }}
                    key={index}
                  />
                );
              })}
        </CollectionInfoBody>
      </div>
    </div>
  );
};

export default CollectionInfo;
