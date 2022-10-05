import React, { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { utils } from 'ethers';

import { NftCollectionPage } from './NftCollectionPage';
import NftDataPageMain from './NftDataPageMain';
import NftUnlockablesPage from './NftUnlockablesPage';

import {
  IOffersResponseType,
  TFileType,
  TMetadataType,
  TNftFilesResponse,
  TNftItemResponse,
  TProducts,
  TTokenData,
  TUserResponse
} from '../../../../axios.responseTypes';
import { RootState } from '../../../../ducks';
import { ColorStoreType } from '../../../../ducks/colors/colorStore.types';
import { setRealChain } from '../../../../ducks/contracts/actions';
import {
  setTokenData,
  setTokenDataStart
} from '../../../../ducks/nftData/action';
import { UserType } from '../../../../ducks/users/users.types';
import { TOfferType } from '../../../marketplace/marketplace.types';
import {
  INftDataCommonLinkComponent,
  TParamsNftDataCommonLink
} from '../nftList.types';

const NftDataCommonLinkComponent: React.FC<INftDataCommonLinkComponent> = ({
  embeddedParams,
  userData,
  loginDone
}) => {
  const [collectionName, setCollectionName] = useState<string>();
  const [tokenDataFiltered, setTokenDataFiltered] = useState<TTokenData[]>([]);
  const [totalCount, setTotalCount] = useState<number>();
  const [selectedData, setSelectedData] = useState<TMetadataType>();
  const [selectedOfferIndex, setSelectedOfferIndex] = useState<string>();
  const [selectedToken, setSelectedToken] = useState<string>();
  const [offerPrice, setOfferPrice] = useState<string[] | undefined>([]);
  const [offerData, setOfferData] = useState<TOfferType>();
  const [offerDataInfo, setOfferDataInfo] = useState<TOfferType[]>();
  const [ownerInfo, setOwnerInfo] = useState<TProducts>();
  const [productsFromOffer, setProductsFromOffer] = useState<TFileType[]>([]);
  const [showToken, setShowToken] = useState<number>(15);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [someUsersData, setSomeUsersData] = useState<UserType | null>();
  const [dataForUser, setDataForUser] = useState<TProducts>();
  const [userToken, setUserToken] = useState<string | null>();

  const dispatch = useDispatch();
  const currentUserAddress = useSelector<RootState, string | undefined>(
    (store) => store.contractStore.currentUserAddress
  );
  const { primaryColor, textColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );
  const tokenData = useSelector<RootState, TTokenData[] | null>(
    (state) => state.nftDataStore.tokenData
  );

  const navigate = useNavigate();
  const params = useParams<TParamsNftDataCommonLink>();
  const { pathname } = useLocation();

  const mode = embeddedParams
    ? embeddedParams.mode
    : pathname?.split('/')?.at(1);

  const { contract, product, tokenId, blockchain } = embeddedParams
    ? embeddedParams
    : params;

  //unused-snippet
  const checkUserConnect = useCallback(() => {
    if (currentUserAddress) {
      setUserToken(localStorage.getItem('token'));
    }
  }, [currentUserAddress]);

  const getAllProduct = useCallback(
    async (fromToken: number, toToken: number) => {
      let responseAllProduct;
      setIsLoading(true);
      // if (Number(tokenId) > 15) {
      //   responseAllProduct = await axios.get(
      //     `/api/nft/network/${blockchain}/${contract}/${product}`
      //   );
      // } else {
      if (tokenId) {
        responseAllProduct = await axios.get<TNftItemResponse>(
          `/api/nft/network/${blockchain}/${contract}/${product}?fromToken=${fromToken}&toToken=${toToken}`
        );
      }

      // }
      dispatch(setTokenData(responseAllProduct.data.result.tokens));
      setTotalCount(responseAllProduct.data.result.totalCount);
      setIsLoading(false);

      if (tokenId && responseAllProduct.data.result.tokens.length >= tokenId) {
        if (tokenId) {
          setSelectedData(
            responseAllProduct.data.result?.tokens[tokenId]?.metadata
          );
          setIsLoading(false);
        }
      }

      setSelectedToken(tokenId);
    },
    [product, contract, tokenId, blockchain, dispatch]
  );

  const getProductsFromOffer = useCallback(async () => {
    setIsLoading(true);
    if (userToken) {
      const responseIfUserConnect = await axios.get<TNftFilesResponse>(
        `/api/nft/network/${blockchain}/${contract}/${product}/files`,
        {
          headers: {
            Accept: 'application/json',
            'X-rair-token': userToken
          }
        }
      );
      setProductsFromOffer(responseIfUserConnect.data.files);
      if (tokenData && tokenId) {
        if (tokenData[tokenId]?.offer?.diamond) {
          setSelectedOfferIndex(
            tokenData && tokenData[tokenId]?.offer?.diamondRangeIndex
          );
        } else {
          setSelectedOfferIndex(
            tokenData && tokenData[tokenId]?.offer?.offerIndex
          );
        }
      }
    } else {
      const response = await axios.get<TNftFilesResponse>(
        `/api/nft/network/${blockchain}/${contract}/${product}/files`
      );
      setIsLoading(false);
      setProductsFromOffer(response.data.files);
      if (tokenData && tokenId) {
        if (tokenData[tokenId]?.offer?.diamond) {
          setSelectedOfferIndex(
            tokenData && tokenData[tokenId]?.offer?.diamondRangeIndex
          );
        } else {
          setSelectedOfferIndex(
            tokenData && tokenData[tokenId]?.offer?.offerIndex
          );
        }
      }
    }
  }, [blockchain, contract, product, tokenId, userToken, tokenData]);

  const getParticularOffer = useCallback(async () => {
    try {
      const response = await axios.get<IOffersResponseType>(
        `/api/nft/network/${blockchain}/${contract}/${product}/offers`
      );

      if (response.data.success) {
        setDataForUser(response.data.product);
        setOfferData(
          response.data.product.offers?.find((neededOfferIndex) => {
            if (neededOfferIndex && neededOfferIndex.diamond) {
              return neededOfferIndex.diamondRangeIndex === selectedOfferIndex;
            } else {
              return neededOfferIndex.offerIndex === selectedOfferIndex;
            }
          })
        );

        setOfferPrice(
          response.data.product.offers?.map((p) => {
            return p.price.toString();
          })
        );

        setOwnerInfo(response.data.product);
        setOfferDataInfo(response.data.product.offers);
        setCollectionName(response.data.product.name);
      }
    } catch (err) {
      const error = err as AxiosError;
      if (
        error?.message === 'jwt expired' ||
        error?.message === 'jwt malformed'
      ) {
        localStorage.removeItem('token');
      } else {
        console.error(error?.message);
      }
    }
  }, [product, contract, selectedOfferIndex, blockchain]);

  const neededUserAddress = dataForUser?.owner;

  const getInfoFromUser = useCallback(async () => {
    // find user
    if (neededUserAddress && utils.isAddress(neededUserAddress)) {
      const result = await axios
        .get<TUserResponse>(`/api/users/${neededUserAddress}`)
        .then((res) => res.data);
      setSomeUsersData(result.user);
    }
  }, [neededUserAddress]);

  useEffect(() => {
    getInfoFromUser();
  }, [getInfoFromUser]);

  //unused-snippet
  const onSelect = useCallback(
    (id: string) => {
      tokenData?.forEach((p) => {
        if (p._id === id) {
          setSelectedData(p.metadata);
        }
      });
    },
    [tokenData]
  );

  const handleClickToken = async (tokenId: string | undefined) => {
    if (embeddedParams && tokenId) {
      embeddedParams.setTokenId(tokenId);
    } else {
      navigate(`/tokens/${blockchain}/${contract}/${product}/${tokenId}`);
    }

    if (tokenData && tokenId && tokenData.length >= Number(tokenId)) {
      setSelectedData(tokenData && tokenData[tokenId].metadata);
    }

    setSelectedToken(tokenId);
  };

  useEffect(() => {
    dispatch(setTokenDataStart());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setRealChain(blockchain));
  }, [blockchain, dispatch]);

  useEffect(() => {
    checkUserConnect();
  }, [checkUserConnect]);

  useEffect(() => {
    getAllProduct(0, showToken);
  }, [getAllProduct, showToken]);

  useEffect(() => {
    getParticularOffer();
  }, [getParticularOffer]);

  useEffect(() => {
    getProductsFromOffer();
  }, [getProductsFromOffer]);

  if (mode === 'collection') {
    return (
      <NftCollectionPage
        userData={userData}
        embeddedParams={embeddedParams}
        blockchain={blockchain}
        offerPrice={offerPrice}
        someUsersData={someUsersData}
        selectedData={selectedData}
        tokenData={tokenData}
        tokenDataFiltered={tokenDataFiltered}
        totalCount={totalCount}
        getAllProduct={getAllProduct}
        setShowToken={setShowToken}
        showToken={showToken}
        isLoading={isLoading}
        setTokenDataFiltered={setTokenDataFiltered}
        offerDataCol={offerDataInfo}
        offerAllData={ownerInfo}
        collectionName={collectionName}
      />
    );
  } else if (mode === 'unlockables') {
    return (
      <NftUnlockablesPage
        embeddedParams={embeddedParams}
        primaryColor={primaryColor}
        productsFromOffer={productsFromOffer}
        selectedToken={selectedToken}
        tokenData={tokenData}
        setTokenDataFiltered={setTokenDataFiltered}
        someUsersData={someUsersData}
        collectionName={collectionName}
      />
    );
  } else if (mode === 'tokens') {
    return (
      <NftDataPageMain
        userData={userData}
        embeddedParams={embeddedParams}
        blockchain={blockchain}
        contract={contract}
        currentUser={currentUserAddress}
        handleClickToken={handleClickToken}
        offerData={offerData}
        offerPrice={offerPrice}
        primaryColor={primaryColor}
        productsFromOffer={productsFromOffer}
        setSelectedToken={setSelectedToken}
        someUsersData={someUsersData}
        selectedData={selectedData}
        selectedToken={selectedToken}
        textColor={textColor}
        totalCount={totalCount}
        product={product}
        ownerInfo={ownerInfo}
        offerDataInfo={offerDataInfo}
        loginDone={loginDone}
      />
    );
  } else {
    return <></>;
  }
};

export const NftDataCommonLink = memo(NftDataCommonLinkComponent);
