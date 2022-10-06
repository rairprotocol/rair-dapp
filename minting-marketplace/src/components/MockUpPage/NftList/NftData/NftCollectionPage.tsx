import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';

import { setShowSidebarTrue } from '../../../../ducks/metadata/actions';
import { setTokenData } from '../../../../ducks/nftData/action';
import setDocumentTitle from '../../../../utils/setTitle';
import CustomButton from '../../utils/button/CustomButton';
import { BreadcrumbsView } from '../Breadcrumbs/Breadcrumbs';
import { NftItemForCollectionView } from '../NftItemForCollectionView';
import { INftCollectionPageComponent } from '../nftList.types';

import AuthenticityBlock from './AuthenticityBlock/AuthenticityBlock';
import CollectionInfo from './CollectionInfo/CollectionInfo';
import TitleCollection from './TitleCollection/TitleCollection';

import './../../GeneralCollectionStyles.css';

const NftCollectionPageComponent: React.FC<INftCollectionPageComponent> = ({
  embeddedParams,
  blockchain,
  selectedData,
  tokenData,
  totalCount,
  offerPrice,
  getAllProduct,
  showToken,
  setShowToken,
  isLoading,
  tokenDataFiltered,
  setTokenDataFiltered,
  userData,
  someUsersData,
  offerDataCol,
  offerAllData,
  collectionName
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const myRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState<boolean>(true);

  const loadToken = useCallback(() => {
    setShowToken(showToken * 2);
    getAllProduct(0, showToken);
  }, [getAllProduct, setShowToken, showToken]);

  useEffect(() => {
    setDocumentTitle('Collection');
    dispatch(setShowSidebarTrue());
  }, [dispatch]);

  useEffect(() => {
    if (!embeddedParams) {
      window.scroll(0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goBack = () => {
    navigate('/');
  };

  if (!tokenData) {
    return (
      <div className="list-wrapper-empty">
        <CircularProgress
          sx={{ color: '#E882D5' }}
          size={100}
          thickness={4.6}
        />
      </div>
    );
  }

  return (
    <>
      {tokenData.length > 0 || tokenDataFiltered.length > 0 ? (
        <div
          className="wrapper-collection"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'flex-start',
            justifyContent: 'center',
            marginBottom: '66px'
          }}>
          <BreadcrumbsView />
          <TitleCollection
            selectedData={tokenData[0]?.metadata}
            title={collectionName}
            someUsersData={someUsersData}
            userName={offerAllData?.owner}
            currentUser={userData}
          />
          {tokenDataFiltered.length > 0 ? (
            <div className="filter__btn__wrapper">
              {show ? (
                <CustomButton
                  text={'Clean filter'}
                  onClick={() => {
                    setTokenDataFiltered([]);
                    dispatch(setTokenData(tokenData));
                    setShow(false);
                  }}
                />
              ) : null}
            </div>
          ) : null}
          <div className={'list-button-wrapper'}>
            {tokenDataFiltered.length > 0
              ? tokenDataFiltered.map((token, index) => {
                  if (
                    token.metadata.image &&
                    token.metadata.image !== 'undefined'
                  ) {
                    return (
                      <NftItemForCollectionView
                        key={`${
                          token._id + '-' + token.uniqueIndexInContract + index
                        }`}
                        pict={offerAllData?.cover}
                        metadata={token.metadata}
                        offerPrice={offerPrice}
                        blockchain={blockchain}
                        selectedData={selectedData}
                        index={token.token}
                        offer={token.offer.offerIndex}
                        someUsersData={someUsersData}
                        userName={offerAllData?.owner}
                      />
                    );
                  } else {
                    return null;
                  }
                })
              : tokenData.length > 0
              ? tokenData.map((token, index) => {
                  if (
                    token.metadata.image &&
                    token.metadata.image !== 'undefined'
                  ) {
                    return (
                      <NftItemForCollectionView
                        key={`${
                          token._id + '-' + token.uniqueIndexInContract + index
                        }`}
                        pict={offerAllData?.cover}
                        metadata={token.metadata}
                        offerPrice={offerPrice}
                        blockchain={blockchain}
                        selectedData={selectedData}
                        index={String(index)}
                        offer={token.offer.offerIndex}
                        someUsersData={someUsersData}
                        userName={offerAllData?.owner}
                        tokenDataLength={tokenData.length}
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
                      className={'skeloton-product'}
                      variant="rectangular"
                      width={283}
                      height={280}
                      style={{ borderRadius: 20 }}
                    />
                  );
                })}
          </div>
          <div className="collection-btn-more">
            {isLoading && (
              <div className="progress-token">
                <CircularProgress
                  style={{
                    width: '50px',
                    height: '50px'
                  }}
                />
              </div>
            )}
            {tokenDataFiltered.length
              ? null
              : totalCount &&
                showToken <= totalCount && (
                  <CustomButton
                    onClick={loadToken}
                    width="232px"
                    height="48px"
                    margin="20px 0 0 0"
                    text="Show more"
                  />
                )}
          </div>
          <CollectionInfo
            blockchain={blockchain}
            offerData={offerDataCol}
            openTitle={true}
            someUsersData={someUsersData}
          />
          <AuthenticityBlock
            collectionToken={tokenData[0]?.authenticityLink}
            title={true}
            tokenData={tokenData}
          />
        </div>
      ) : (
        <div className="collection-no-products" ref={myRef}>
          {!!embeddedParams || (
            <div
              style={{
                cursor: 'pointer',
                color: 'rgb(232, 130, 213)',
                fontSize: '2rem'
              }}
              onClick={() => goBack()}
              className="arrow-back">
              <i className="fas fa-arrow-alt-circle-left"></i>
            </div>
          )}
          <h1>{"Don't have product"}</h1>
        </div>
      )}
    </>
  );
};

export const NftCollectionPage = memo(NftCollectionPageComponent);
