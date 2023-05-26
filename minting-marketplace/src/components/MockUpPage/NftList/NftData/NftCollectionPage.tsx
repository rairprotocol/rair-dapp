import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import Swal from 'sweetalert2';

import { RootState } from '../../../../ducks';
import { setShowSidebarTrue } from '../../../../ducks/metadata/actions';
import { setTokenData } from '../../../../ducks/nftData/action';
import { TUsersInitialState } from '../../../../ducks/users/users.types';
import useWindowDimensions from '../../../../hooks/useWindowDimensions';
import { rFetch } from '../../../../utils/rFetch';
import setDocumentTitle from '../../../../utils/setTitle';
import LoadingComponent from '../../../common/LoadingComponent';
import { ImageLazy } from '../../ImageLazy/ImageLazy';
import CustomButton from '../../utils/button/CustomButton';
import { BreadcrumbsView } from '../Breadcrumbs/Breadcrumbs';
import { NftItemForCollectionView } from '../NftItemForCollectionView';
import { INftCollectionPageComponent } from '../nftList.types';
import { changeIPFSLink } from '../utils/changeIPFSLink';

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
  showTokensRef,
  setRenderOffers
}) => {
  const { userRd } = useSelector<RootState, TUsersInitialState>(
    (store) => store.userStore
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const myRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState<boolean>(true);
  const [playing, setPlaying] = useState<null | string>(null);
  const [loadingBg, setLoadingBg] = useState(false);
  const { width } = useWindowDimensions();
  const loader = useRef(null);
  const [fileUpload, setFileUpload] = useState<any>();

  const loadToken = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        showTokensRef.current = showTokensRef.current * 2;
        getAllProduct('0', showTokensRef.current.toString());
      }
    },
    [getAllProduct, showTokensRef]
  );

  useEffect(() => {
    setDocumentTitle('Collection');
    dispatch(setShowSidebarTrue());
  }, [dispatch]);

  const goBack = () => {
    navigate('/');
  };

  const photoUpload = useCallback(
    (e) => {
      e.preventDefault();
      const reader = new FileReader();
      const fileF = e.target.files[0];
      reader.onloadend = () => {
        if (fileF.type !== 'video/mp4') {
          setFileUpload(fileF);
        } else {
          Swal.fire(
            'Info',
            `You cannot upload video to background!`,
            'warning'
          );
        }
      };
      if (fileF) {
        reader.readAsDataURL(fileF);
      }
    },
    [setFileUpload]
  );

  const editBackground = useCallback(async () => {
    if (userRd && offerAllData && userRd.publicAddress === offerAllData.owner) {
      const formData = new FormData();
      if (fileUpload) {
        setLoadingBg(true);
        formData.append('banner', fileUpload);

        const response = await rFetch(`/api/v2/products/${offerAllData?._id}`, {
          method: 'POST',
          body: formData
        });

        if (response.success) {
          // setBackgroundUser(user.background);
          // setFileUpload(null);
          setLoadingBg(false);
          setRenderOffers((prev) => !prev);
        } else {
          setLoadingBg(false);
        }
      }
    }
  }, [fileUpload]);

  useEffect(() => {
    if (!embeddedParams) {
      window.scroll(0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 0
    };
    const observer = new IntersectionObserver(loadToken, option);
    if (loader.current) observer.observe(loader.current);
  }, [loadToken, loader, isLoading]);

  useEffect(() => {
    editBackground();
  }, [editBackground]);

  useEffect(() => {
    return () => {
      showTokensRef.current = 40;
    };
  }, []);

  if (tokenData === undefined || !tokenData) {
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
          <div className={`collection-background`}>
            {loadingBg ? (
              <div className="loadingProfile">
                <div className="loader-wrapper">
                  <div className="load" />
                </div>
              </div>
            ) : (
              <ImageLazy
                className="picture-banner"
                alt="Collection Banner"
                src={
                  offerAllData && offerAllData?.bannerImage
                    ? `${changeIPFSLink(offerAllData?.bannerImage)}`
                    : 'https://storage.googleapis.com/rair_images/1683038949498-1548817833.jpeg'
                }
              />
            )}
            {userRd &&
              offerAllData &&
              userRd.publicAddress === offerAllData.owner && (
                <div
                  className={'blockAddBack'}
                  style={{
                    position: 'absolute',
                    top: '0',
                    right: '0'
                  }}>
                  <label className={'inputFile'}>
                    <AddIcon className={'plus'} />
                    <input
                      disabled={loadingBg ? true : false}
                      type="file"
                      onChange={photoUpload}
                    />
                  </label>
                </div>
              )}
          </div>

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
                          offerItemData={token.offer}
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
          {isLoading && (
            <div className="progress-token">
              <CircularProgress
                style={{
                  width: '70px',
                  height: '70px'
                }}
              />
            </div>
          )}
          {tokenDataFiltered.length
            ? null
            : totalCount &&
              showTokensRef.current <= totalCount && (
                <div ref={loader} className="ref"></div>
              )}
          <>
            {Object.keys(tokenData).length <= 5 && (
              <>
                {width > 730 && (
                  <CollectionInfo
                    blockchain={blockchain}
                    offerData={offerDataCol}
                    openTitle={true}
                  />
                )}
                <AuthenticityBlock
                  collectionToken={tokenData[0]?.authenticityLink}
                  title={true}
                  tokenData={tokenData}
                />
              </>
            )}
          </>
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
          <h2>{"Don't have product"}</h2>
        </div>
      )}
    </>
  );
};

export const NftCollectionPage = memo(NftCollectionPageComponent);
