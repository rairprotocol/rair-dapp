import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  faArrowAltCircleLeft,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
import { ColorStoreType } from '../../../../ducks/colors/colorStore.types';
import { setShowSidebarTrue } from '../../../../ducks/metadata/actions';
import { setTokenData } from '../../../../ducks/nftData/action';
import { TUsersInitialState } from '../../../../ducks/users/users.types';
import useWindowDimensions from '../../../../hooks/useWindowDimensions';
import { hotDropsDefaultBanner } from '../../../../images';
import { rFetch } from '../../../../utils/rFetch';
import setDocumentTitle from '../../../../utils/setTitle';
import InputField from '../../../common/InputField';
import LoadingComponent from '../../../common/LoadingComponent';
import { MobileCloseBtn } from '../../../GlobalModal/FilterModal/FilterModalIcons';
import { HomePageModalFilter } from '../../../GlobalModal/FilterModal/HomePAgeModal';
import { MobileHeaderBlock } from '../../../GlobalModal/FilterModal/MobileHeaderBlock';
import FilteringBlock from '../../FilteringBlock/FilteringBlock';
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
import ClearMetadataBox from './TitleCollection/FilterMetadataTokens/ClearMetadataBox/ClearMetadataBox';
import FilterMetadataTokens from './TitleCollection/FilterMetadataTokens/FilterMetadataTokens';
import MetadataAttributesProperties from './TitleCollection/FilterMetadataTokens/MetadataAttrPropertyItems/MetadataAttributes';
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

  const { width } = useWindowDimensions();
  const isMobileDesign = width < 820;

  const params = useParams<TParamsNftDataCommonLink>();
  const { contract, product, blockchain } = params;
  const [metadataFilter, setMetadataFilter] = useState<boolean>(false);
  const [newAttr, setNewAttr] = useState<any>();
  const [selectedAttributeValues, setSelectedAttributeValues] =
    useState<any>(undefined);

  const { primaryColor, textColor, primaryButtonColor, iconColor } =
    useSelector<RootState, ColorStoreType>((store) => store.colorStore);

  const toggleMetadataFilter = () => {
    setMetadataFilter((prev) => !prev);
  };

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
  const [titleSearch, setTitleSearch] = useState('');
  const [sortItem, setSortItem] = useState();
  const [titleSearchAttributes, setTitleSearchAttributes] = useState('');

  const filteredDataAttributes =
    selectedAttributeValues &&
    selectedAttributeValues.map((item) => {
      if (item.values.length) {
        const result = item.values.filter((el) =>
          el.value.toLowerCase().includes(titleSearchAttributes.toLowerCase())
        );

        return { ...item, values: result };
      }
      return item;
    });

  const filteredData =
    tokenData &&
    Object.values(tokenData).length &&
    Object.values(tokenData)
      .filter((item) => {
        return item.metadata.name
          .toLowerCase()
          .includes(titleSearch.toLowerCase());
      })
      .sort((a, b) => {
        if (sortItem === 'up') {
          if (a.metadata.name < b.metadata.name) {
            return 1;
          }
        }

        if (sortItem === 'down') {
          if (a.metadata.name > b.metadata.name) {
            return -1;
          }
        }

        return 0;
      });

  const loadToken = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        showTokensRef.current = showTokensRef.current + 20;
        getAllProduct('0', showTokensRef.current.toString(), undefined);
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

  const getAttributes = useCallback(async () => {
    const { data } = await axios.get<any>(
      `/api/nft/network/${blockchain}/${contract}/${product}/attributes`
    );
    if (data.success) {
      const result = data.attributes.attributes.map((item) => {
        const newEl = item.values.map((val) => {
          return {
            value: val,
            active: false
          };
        });
        return { ...item, values: newEl };
      });
      setNewAttr(result);
    }
  }, [blockchain, contract, product]);

  useEffect(() => {
    getAttributes();
  }, [getAttributes, collectionName]);

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

        const response = await rFetch(`/api/products/${offerAllData?._id}`, {
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

  const getResetTokens = useCallback(() => {
    getAllProduct(
      '0',
      showTokensRef.current.toString(),
      selectedAttributeValues &&
        selectedAttributeValues.length &&
        selectedAttributeValues?.reduce((acc, item) => {
          const { name, values } = item;
          const newValue = values.filter((el) => el.active);

          acc[name] = newValue.map((el) => el.value);
          return acc;
        }, {})
    );
  }, [getAllProduct, selectedAttributeValues, showTokensRef]);

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

  useEffect(() => {
    if (!metadataFilter) {
      setSelectedAttributeValues(undefined);
    }
  }, [metadataFilter, setSelectedAttributeValues]);

  if (tokenData === undefined || !tokenData) {
    return <LoadingComponent />;
  }

  const selectedAttributeValuesFunction = (selectedAttributeValues) => {
    if (selectedAttributeValues) {
      const condition: any = [];
      const result: any =
        selectedAttributeValues &&
        selectedAttributeValues.length &&
        selectedAttributeValues?.reduce((acc, item) => {
          const { name, values } = item;
          const newValue = values.filter((el) => el.active);

          acc[name] = newValue.map((el) => el.value);
          return acc;
        }, {});

      if (result) {
        for (const el in result) {
          if (result[el].length === 0) {
            condition.push(false);
          } else {
            condition.push(true);
          }
        }
      }

      return condition.some((element) => element === true);
    } else {
      return false;
    }
  };

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
            toggleMetadataFilter={toggleMetadataFilter}
          />
          <div className="container-search">
            <InputField
              getter={titleSearch}
              setter={setTitleSearch}
              placeholder={'Search tokens'}
              customCSS={{
                background:
                  primaryColor === '#dedede'
                    ? `var(--rhyno-40)`
                    : `color-mix(in srgb, ${primaryColor} 50%, #aaaaaa)`,
                color: `var(--${textColor})`,
                borderTopLeftRadius: '0',
                border: `${
                  primaryColor === '#dedede'
                    ? 'solid 1px var(--rhyno)'
                    : `solid 1px color-mix(in srgb, ${primaryColor}, #888888)`
                } `,
                paddingLeft: '2rem'
              }}
              customClass="form-control input-styled border-top-radius-tablet search-mobile"
            />
            <div className="nft-form-control-icon">
              <i className="fas-custom">
                <FontAwesomeIcon
                  icon={faSearch}
                  size="lg"
                  style={{
                    color:
                      import.meta.env.VITE_TESTNET === 'true'
                        ? `${iconColor === '#1486c5' ? '#F95631' : iconColor}`
                        : `${iconColor === '#1486c5' ? '#E882D5' : iconColor}`
                  }}
                  aria-hidden="true"
                />
              </i>
              {isMobileDesign ? (
                <FilteringBlock
                  click={metadataFilter}
                  setIsClick={setMetadataFilter}
                  isFilterShow={true}
                  textColor={textColor}
                  primaryColor={primaryColor}
                  metadataFilter={metadataFilter}
                  setMetadataFilter={toggleMetadataFilter}
                  // categoryClick={categoryClick}
                  // setCategoryClick={setCategoryClick}
                  // blockchainClick={blockchainClick}
                  // setBlockchainClick={setBlockchainClick}
                  sortItem={sortItem}
                  // setBlockchain={setBlockchain}
                  // setCategory={setCategory}
                  setSortItem={setSortItem}
                  setIsShow={setMetadataFilter}
                  colletionPage={true}
                  // setIsShowCategories={setIsShowCategories}
                  // setFilterText={setFilterText}
                  // setFilterCategoriesText={setFilterCategoriesText}
                />
              ) : (
                <FilteringBlock
                  click={metadataFilter}
                  setIsClick={setMetadataFilter}
                  isFilterShow={true}
                  textColor={textColor}
                  primaryColor={primaryColor}
                  metadataFilter={metadataFilter}
                  setMetadataFilter={toggleMetadataFilter}
                  colletionPage={true}
                  // categoryClick={categoryClick}
                  // setCategoryClick={setCategoryClick}
                  // blockchainClick={blockchainClick}
                  // setBlockchainClick={setBlockchainClick}
                  sortItem={sortItem}
                  // setBlockchain={setBlockchain}
                  // setCategory={setCategory}
                  setSortItem={setSortItem}
                  setIsShow={setMetadataFilter}
                  // setIsShowCategories={setIsShowCategories}
                  // setFilterText={setFilterText}
                  // setFilterCategoriesText={setFilterCategoriesText}
                />
              )}
            </div>
          </div>
          <ClearMetadataBox
            filteredDataAttributes={filteredDataAttributes}
            setSelectedAttributeValues={setSelectedAttributeValues}
            getResetTokens={getResetTokens}
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
            <div
              className={`list-button-wrapper-grid-template ${
                metadataFilter && 'with-modal'
              }`}>
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
                        />
                      );
                    } else {
                      return null;
                    }
                  })
                : filteredData && filteredData.length > 0
                  ? filteredData.map((item, index) => {
                      if (
                        item.metadata.image &&
                        item.metadata.image !== 'undefined'
                      ) {
                        return (
                          <NftItemForCollectionView
                            id={`collection-view-${index}`}
                            key={`${
                              item._id +
                              '-' +
                              item.uniqueIndexInContract +
                              index
                            }`}
                            pict={offerAllData?.cover}
                            metadata={item.metadata}
                            offerPrice={offerPrice}
                            blockchain={blockchain}
                            selectedData={selectedData}
                            index={String(index)}
                            offerData={offerDataCol}
                            item={item}
                            indexId={index.toString()}
                            offerItemData={item.offer}
                            offer={
                              item.offer.diamond
                                ? item.offer.diamondRangeIndex
                                : item.offer.offerIndex
                            }
                            someUsersData={someUsersData}
                            userName={offerAllData?.owner}
                            tokenDataLength={Object.keys(tokenData).length}
                            setPlaying={setPlaying}
                            playing={playing}
                            diamond={item.offer.diamond}
                            resalePrice={item?.resaleData?.price}
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
            {metadataFilter && (
              <div id="filter-modal-parent">
                <HomePageModalFilter
                  isMobileDesign={isMobileDesign}
                  primaryColor={primaryColor}
                  id="home-page-modal-filter"
                  className={`filter-modal-wrapper ${
                    metadataFilter && 'with-modal'
                  }`}>
                  {isMobileDesign && (
                    <MobileHeaderBlock className="mobile-close-btn-container">
                      <span className="filter-header">Filters</span>
                      <button
                        className="mobile-close-btn"
                        onClick={toggleMetadataFilter}>
                        <MobileCloseBtn className="" />
                      </button>
                    </MobileHeaderBlock>
                  )}
                  <h6
                    style={{
                      textTransform: 'uppercase'
                    }}>
                    Traits ({newAttr.length})
                  </h6>
                  <div className="filter-metadata-collection-container">
                    {newAttr &&
                      newAttr.map((item, index) => {
                        return (
                          <FilterMetadataTokens
                            setSelectedAttributeValues={
                              setSelectedAttributeValues
                            }
                            selectedAttributeValues={selectedAttributeValues}
                            key={index}
                            selectedData={item}
                            index={index}
                            textColor={textColor}
                          />
                        );
                      })}
                  </div>
                  <div
                    style={{
                      width: '100%'
                    }}>
                    <input
                      value={titleSearchAttributes}
                      onChange={(e) => setTitleSearchAttributes(e.target.value)}
                      style={{
                        border: '1px solid #666666',
                        width: '100%',
                        borderRadius: '12px',
                        padding: '5px 10px',
                        background: 'none',
                        outline: 'none',
                        color: 'white'
                      }}
                      placeholder="Search..."
                    />
                  </div>
                  <MetadataAttributesProperties
                    filteredDataAttributes={filteredDataAttributes}
                    setSelectedAttributeValues={setSelectedAttributeValues}
                  />
                  {primaryColor && (
                    <div
                      className="filter-modal-btn-container"
                      style={{
                        marginTop: '10px'
                      }}>
                      <button
                        onClick={() => {
                          getAllProduct(
                            '0',
                            showTokensRef.current.toString(),
                            undefined
                          );
                          setSelectedAttributeValues(undefined);
                          if (isMobileDesign) {
                            setMetadataFilter(false);
                          }
                        }}
                        className={`modal-filtering-button clear-btn`}>
                        Clear all
                      </button>
                      <button
                        style={{
                          color: textColor,
                          background: `${
                            primaryColor === '#dedede'
                              ? import.meta.env.VITE_TESTNET === 'true'
                                ? 'var(--hot-drops)'
                                : 'linear-gradient(to right, #e882d5, #725bdb)'
                              : import.meta.env.VITE_TESTNET === 'true'
                                ? primaryButtonColor ===
                                  'linear-gradient(to right, #e882d5, #725bdb)'
                                  ? 'var(--hot-drops)'
                                  : primaryButtonColor
                                : primaryButtonColor
                          }`
                        }}
                        className={`modal-filtering-button apply-btn`}
                        disabled={
                          !selectedAttributeValuesFunction(
                            selectedAttributeValues
                          )
                        }
                        onClick={() => {
                          getAllProduct(
                            '0',
                            showTokensRef.current.toString(),
                            selectedAttributeValues &&
                              selectedAttributeValues.length &&
                              selectedAttributeValues?.reduce((acc, item) => {
                                const { name, values } = item;
                                const newValue = values.filter(
                                  (el) => el.active
                                );

                                acc[name] = newValue.map((el) => el.value);
                                return acc;
                              }, {})
                          );
                          if (isMobileDesign) {
                            setMetadataFilter(false);
                          }
                        }}>
                        Apply
                      </button>
                    </div>
                  )}
                </HomePageModalFilter>
              </div>
            )}
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
                color: textColor,
                fontSize: '2rem'
              }}
              onClick={() => goBack()}
              className="arrow-back">
              <FontAwesomeIcon icon={faArrowAltCircleLeft} />
            </div>
          )}
          <h2>{"Don't have product"}</h2>
        </div>
      )}
    </>
  );
};

export const NftCollectionPage = memo(NftCollectionPageComponent);
