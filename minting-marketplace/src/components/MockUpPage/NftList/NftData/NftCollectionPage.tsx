import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';

import { setShowSidebarTrue } from '../../../../ducks/metadata/actions';
import { setTokenData } from '../../../../ducks/nftData/action';
import useWindowDimensions from '../../../../hooks/useWindowDimensions';
import setDocumentTitle from '../../../../utils/setTitle';
import LoadingComponent from '../../../common/LoadingComponent';
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
  collectionName,
  connectUserData,
  showTokensRef
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const myRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState<boolean>(true);
  const [playing, setPlaying] = useState<null | string>(null);
  const { width } = useWindowDimensions();

  const loadToken = useCallback(() => {
    showTokensRef.current = showTokensRef.current * 2;
    getAllProduct('0', showTokensRef.current.toString());
  }, [getAllProduct, showTokensRef]);

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
    return <LoadingComponent />;
  }

  return (
    <>
      {Object.keys(tokenData).length > 0 || tokenDataFiltered.length > 0 ? (
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
            offerDataCol={offerDataCol}
            connectUserData={connectUserData}
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
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center'
            }}>
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
                            token._id +
                            '-' +
                            token.uniqueIndexInContract +
                            index
                          }`}
                          pict={offerAllData?.cover}
                          metadata={token.metadata}
                          offerPrice={offerPrice}
                          blockchain={blockchain}
                          selectedData={selectedData}
                          index={token.token}
                          indexId={index.toString()}
                          offerData={offerDataCol}
                          offer={
                            token.offer.diamond
                              ? token.offer.diamondRangeIndex
                              : token.offer.offerIndex
                          }
                          someUsersData={someUsersData}
                          userName={offerAllData?.owner}
                          setPlaying={setPlaying}
                          playing={playing}
                          diamond={token.offer.diamond}
                        />
                      );
                    } else {
                      return null;
                    }
                  })
                : Object.keys(tokenData).length > 0
                ? Object.keys(tokenData).map((index) => {
                    const token = tokenData[index];
                    if (
                      token.metadata.image &&
                      token.metadata.image !== 'undefined'
                    ) {
                      return (
                        <NftItemForCollectionView
                          key={`${
                            token._id +
                            '-' +
                            token.uniqueIndexInContract +
                            index
                          }`}
                          pict={offerAllData?.cover}
                          metadata={token.metadata}
                          offerPrice={offerPrice}
                          blockchain={blockchain}
                          selectedData={selectedData}
                          index={String(index)}
                          offerData={offerDataCol}
                          indexId={index}
                          offer={
                            token.offer.diamond
                              ? token.offer.diamondRangeIndex
                              : token.offer.offerIndex
                          }
                          someUsersData={someUsersData}
                          userName={offerAllData?.owner}
                          tokenDataLength={Object.keys(tokenData).length}
                          setPlaying={setPlaying}
                          playing={playing}
                          diamond={token.offer.diamond}
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
                showTokensRef.current <= totalCount && (
                  <CustomButton
                    onClick={loadToken}
                    width="232px"
                    height="48px"
                    margin="20px 0 0 0"
                    text="Show more"
                  />
                )}
          </div>
          {width > 730 && (
            <CollectionInfo
              blockchain={blockchain}
              offerData={offerDataCol}
              openTitle={true}
              someUsersData={someUsersData}
            />
          )}
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
