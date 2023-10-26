import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import axios, { AxiosError } from 'axios';
import Swal from 'sweetalert2';

import {
  IOffersResponseType,
  TProducts
} from '../../../../axios.responseTypes';
import { RootState } from '../../../../ducks';
import { setShowSidebarTrue } from '../../../../ducks/metadata/actions';
import { setTokenData } from '../../../../ducks/nftData/action';
import { TUsersInitialState } from '../../../../ducks/users/users.types';
import { hotDropsDefaultBanner } from '../../../../images';
import { rFetch } from '../../../../utils/rFetch';
import setDocumentTitle from '../../../../utils/setTitle';
import LoadingComponent from '../../../common/LoadingComponent';
import { ImageLazy } from '../../ImageLazy/ImageLazy';
import CustomButton from '../../utils/button/CustomButton';
import { BreadcrumbsView } from '../Breadcrumbs/Breadcrumbs';
import { NftItemForCollectionView } from '../NftItemForCollectionView';
import {
  INftCollectionPageComponent,
  TParamsNftDataCommonLink
} from '../nftList.types';
import { changeIPFSLink } from '../utils/changeIPFSLink';

import AuthenticityBlock from './AuthenticityBlock/AuthenticityBlock';
import TitleCollection from './TitleCollection/TitleCollection';

import './../../GeneralCollectionStyles.css';

const NftCollectionPageComponent: React.FC<INftCollectionPageComponent> = ({
  embeddedParams,
  selectedData,
  tokenData,
  totalCount,
  offerPrice,
  getAllProduct,
  // showToken,
  // setShowToken,
  isLoading,
  tokenDataFiltered,
  setTokenDataFiltered,
  someUsersData,
  offerDataCol,
  offerAllData,
  collectionName,
  showTokensRef,
  tokenNumber
}) => {
  const { userRd } = useSelector<RootState, TUsersInitialState>(
    (store) => store.userStore
  );

  const params = useParams<TParamsNftDataCommonLink>();
  const { contract, product, blockchain } = params;

  const hotdropsVar = process.env.REACT_APP_HOTDROPS;

  const defaultCollectionBanner =
    hotdropsVar === 'true'
      ? hotDropsDefaultBanner
      : 'https://storage.googleapis.com/rair_images/1683038949498-1548817833.jpeg';

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const myRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState<boolean>(true);
  const [playing, setPlaying] = useState<null | string>(null);
  const [loadingBg, setLoadingBg] = useState(false);
  const loader = useRef(null);
  const [fileUpload, setFileUpload] = useState<any>();
  const [bannerInfo, setBannerInfo] = useState<TProducts>();
  const [usdPrice, setUsdPrice] = useState<number | undefined>(undefined);

  const loadToken = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        showTokensRef.current = showTokensRef.current + 20;
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

  const getBannerInfo = useCallback(async () => {
    try {
      setLoadingBg(true);
      const response = await axios.get<IOffersResponseType>(
        `/api/nft/network/${blockchain}/${contract}/${product}/offers`
      );

      if (response.data.success) {
        setBannerInfo(response.data.product);
        setLoadingBg(false);
      }
    } catch (err) {
      setLoadingBg(false);
      const error = err as AxiosError;
      console.error(error?.message);
    }
  }, [product, contract, blockchain]);

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
          getBannerInfo();
          setLoadingBg(false);
          // setBackgroundUser(user.background);
          // setFileUpload(null);
        } else {
          setLoadingBg(false);
        }
      }
    }
  }, [fileUpload, offerAllData, userRd, getBannerInfo]);

  const getUSDcurrency = useCallback(async () => {
    const currencyCrypto = {
      '0x250': {
        blockchainName: 'astar'
      },
      '0x89': {
        blockchainName: 'matic-network'
      },
      '0x1': {
        blockchainName: 'ethereum'
      }
    };

    if (
      blockchain &&
      currencyCrypto[String(blockchain)] &&
      currencyCrypto[String(blockchain)].blockchainName
    ) {
      const chain = currencyCrypto[String(blockchain)].blockchainName;
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${chain}&vs_currencies=usd`
      );
      if (data && chain) {
        setUsdPrice(data[chain].usd);
      } else {
        setUsdPrice(undefined);
      }
    }
  }, [blockchain]);

  useEffect(() => {
    getUSDcurrency();
  }, [getUSDcurrency]);

  useEffect(() => {
    if (!embeddedParams) {
      if (tokenNumber && tokenNumber > 10) {
        if (tokenData && Object.keys(tokenData).length > 20) {
          const element = document.getElementById(
            `collection-view-${tokenNumber}`
          );
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenNumber, tokenData]);

  useEffect(() => {
    if (tokenData && Object.keys(tokenData).length > 20) {
      window.scroll(0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getBannerInfo();
  }, [getBannerInfo]);

  useEffect(() => {
    if (totalCount && showTokensRef.current <= totalCount) {
      const option = {
        root: null,
        rootMargin: '20px',
        threshold: 0
      };
      const observer = new IntersectionObserver(loadToken, option);
      if (loader.current) observer.observe(loader.current);
    }
  }, [loadToken, loader, isLoading, showTokensRef, totalCount]);

  useEffect(() => {
    editBackground();
  }, [editBackground]);

  useEffect(() => {
    return () => {
      showTokensRef.current = 20;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                  bannerInfo && bannerInfo?.bannerImage
                    ? `${changeIPFSLink(bannerInfo?.bannerImage)}`
                    : defaultCollectionBanner
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
            offerDataCol={offerDataCol}
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
            {/* <div className={'list-button-wrapper'}> */}
            <div className={'list-button-wrapper-grid-template'}>
              {tokenDataFiltered.length > 0
                ? tokenDataFiltered.map((token, index) => {
                    if (
                      token.metadata.image &&
                      token.metadata.image !== 'undefined'
                    ) {
                      return (
                        <NftItemForCollectionView
                          id={`collection-view-${index}`}
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
                          item={token}
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
                          resalePrice={token?.resaleData?.price}
                          usdPrice={usdPrice}
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
                          id={`collection-view-${index}`}
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
                          item={token}
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
                          resalePrice={token?.resaleData?.price}
                          usdPrice={usdPrice}
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
                <div
                  style={{
                    marginTop: '30px'
                  }}></div>
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
              {process.env.REACT_APP_HOTDROPS === 'true' ? (
                <i className="fas fa-arrow-alt-circle-left hotdrops-color"></i>
              ) : (
                <i className="fas fa-arrow-alt-circle-left"></i>
              )}
            </div>
          )}
          <h2>{"Don't have product"}</h2>
        </div>
      )}
    </>
  );
};

export const NftCollectionPage = memo(NftCollectionPageComponent);
