//@ts-nocheck
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { isAddress, ZeroAddress } from "ethers";
import { Hex } from "viem";

import { NftCollectionPage } from "./NftCollectionPage";
import NftDataPageMain from "./NftDataPageMain";
import NftUnlockablesPage from "./NftUnlockablesPage";

import {
  IOffersResponseType,
  TNftFilesResponse,
  TProducts,
  TTokenData,
  TUserResponse,
} from "../../../../axios.responseTypes";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../hooks/useReduxHooks";
import { dataStatuses } from "../../../../redux/commonTypes";
import { loadCollection } from "../../../../redux/tokenSlice";
import { setRequestedChain } from "../../../../redux/web3Slice";
import { CatalogVideoItem } from "../../../../types/commonTypes";
import {
  MediaFile,
  TokenMetadata,
  User,
} from "../../../../types/databaseTypes";
import { TOfferType } from "../../../marketplace/marketplace.types";
import {
  INftDataCommonLinkComponent,
  TParamsNftDataCommonLink,
} from "../nftList.types";

const NftDataCommonLinkComponent: React.FC<INftDataCommonLinkComponent> = ({
  embeddedParams,
  tokenNumber,
  setTokenNumber,
}) => {
  const [collectionName, setCollectionName] = useState<string>();
  const [tokenDataFiltered, setTokenDataFiltered] = useState<TTokenData[]>([]);
  const [selectedData, setSelectedData] = useState<TokenMetadata>();
  const [selectedOfferIndex, setSelectedOfferIndex] = useState<string>();
  const [selectedToken, setSelectedToken] = useState<string>();
  const [offerPrice, setOfferPrice] = useState<string[] | undefined>([]);
  const [offerData, setOfferData] = useState<TOfferType>();
  const [offerDataInfo, setOfferDataInfo] = useState<TOfferType[]>();
  const [ownerInfo, setOwnerInfo] = useState<TProducts>();
  const [productsFromOffer, setProductsFromOffer] = useState<
    CatalogVideoItem[] | undefined
  >(undefined);
  const [showToken, setShowToken] = useState<number>(15);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [someUsersData, setSomeUsersData] = useState<User | null>();
  const [dataForUser, setDataForUser] = useState<TProducts>();
  const showTokensRef = useRef<number>(20);

  const dispatch = useAppDispatch();
  const { currentUserAddress } = useAppSelector((store) => store.web3);
  const {
    currentCollection,
    currentCollectionMetadata,
    currentCollectionStatus,
    currentCollectionMetadataStatus,
  } = useAppSelector((state) => state.tokens);

  const navigate = useNavigate();
  const params = useParams<TParamsNftDataCommonLink>();
  const { pathname } = useLocation();

  const mode = embeddedParams
    ? embeddedParams.mode
    : pathname?.split("/")?.at(1);

  const { contract, product, tokenId, blockchain } = embeddedParams
    ? embeddedParams
    : params;

  const getAllProduct = useCallback(
    async (fromToken: string, toToken: string, attributes: any) => {
      if (
        !product ||
        currentCollectionStatus === dataStatuses.Loading ||
        currentCollectionMetadataStatus === dataStatuses.Loading
      ) {
        return;
      }

      const tokensFlag = window.location.href.includes("/tokens") && tokenId;

      if (
        tokensFlag &&
        contract === currentCollectionMetadata?.contract?.contractAddress &&
        currentCollection[tokenId]
      ) {
        return;
      }

      dispatch(
        loadCollection({
          blockchain: blockchain as Hex,
          contract: contract as Hex,
          product,
          fromToken: tokensFlag ? tokenId : fromToken,
          toToken: tokensFlag ? tokenId : toToken,
          attributes,
        })
      );

      setIsLoading(false);
    },
    [
      product,
      tokenId,
      currentCollection,
      dispatch,
      blockchain,
      contract,
      currentCollectionStatus,
      currentCollectionMetadata,
      currentCollectionMetadataStatus,
    ]
  );

  useEffect(() => {
    if (!tokenId || !currentCollectionMetadata.product) {
      return;
    }
    const realNumber = (
      BigInt(tokenId) +
      BigInt(currentCollectionMetadata.product?.firstTokenIndex)
    ).toString();
    if (realNumber && currentCollection[realNumber]?.metadata) {
      setSelectedData(currentCollection[realNumber]?.metadata);
    }
  }, [tokenId, currentCollection, currentCollectionMetadata]);

  const getProductsFromOffer = useCallback(async () => {
    setIsLoading(true);
    const response = await axios.get<TNftFilesResponse>(
      `/api/nft/network/${blockchain}/${contract}/${product}/files`
    );
    setIsLoading(false);
    const loadedFiles: string[] = [];
    setProductsFromOffer(
      response.data.files.filter((item: MediaFile) => {
        if (item._id && !loadedFiles.includes(item._id)) {
          loadedFiles.push(item._id);
          return true;
        }
        return false;
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockchain, contract, product, currentUserAddress]);

  const initialTokenData = useCallback(() => {
    if (currentCollection && selectedToken) {
      if (currentCollection[selectedToken]?.offer?.diamond) {
        setSelectedOfferIndex(
          currentCollection &&
            currentCollection[selectedToken]?.offer?.diamondRangeIndex
        );
      } else if (currentCollection) {
        setSelectedOfferIndex(
          currentCollection[selectedToken]?.offer?.offerIndex
        );
      }
    }
  }, [currentCollection, selectedToken]);

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
      console.error(error?.message);
    }
  }, [product, contract, selectedOfferIndex, blockchain]);

  const neededUserAddress = dataForUser?.owner;

  const getInfoFromUser = useCallback(async () => {
    // find user
    if (
      neededUserAddress &&
      isAddress(neededUserAddress) &&
      neededUserAddress !== ZeroAddress
    ) {
      const result = await axios
        .get<TUserResponse>(`/api/users/${neededUserAddress}`)
        .then((res) => res.data);
      setSomeUsersData(result.user);
    }
  }, [neededUserAddress]);

  useEffect(() => {
    getInfoFromUser();
  }, [getInfoFromUser]);

  const handleClickToken = useCallback(
    async (tokenId: string | undefined) => {
      if (embeddedParams && tokenId) {
        embeddedParams.setTokenId(tokenId);
      } else {
        navigate(`/tokens/${blockchain}/${contract}/${product}/${tokenId}`);
      }

      if (
        currentCollection &&
        tokenId &&
        Object.keys(currentCollection).length >= Number(tokenId)
      ) {
        setSelectedData(
          currentCollection &&
            currentCollection[tokenId] &&
            currentCollection[tokenId].metadata
        );
      }

      setSelectedToken(tokenId);
    },
    [blockchain, contract, currentCollection, embeddedParams, navigate, product]
  );

  useEffect(() => {
    if (blockchain) {
      dispatch(setRequestedChain(blockchain));
    }
  }, [blockchain, dispatch]);

  useEffect(() => {
    if (!tokenId || !currentCollectionMetadata.product) {
      return;
    }
    const realNumber = (
      BigInt(tokenId) +
      BigInt(currentCollectionMetadata.product?.firstTokenIndex)
    ).toString();
    if (realNumber) {
      setSelectedToken(realNumber);
    }
  }, [currentCollectionMetadata, tokenId]);

  useEffect(() => {
    let tokenStart = BigInt(0);
    let tokenEnd = tokenStart + BigInt(15);
    if (tokenStart < BigInt(0)) {
      tokenStart = BigInt(0);
    }
    if (tokenNumber && tokenNumber > 20) {
      tokenEnd = BigInt(tokenNumber);
    } else {
      tokenEnd = tokenStart + BigInt(showTokensRef.current);
      setTokenNumber(undefined);
    }
    getAllProduct(tokenStart.toString(), tokenEnd.toString(), undefined);
  }, [setTokenNumber, tokenNumber]);

  useEffect(() => {
    getParticularOffer();
  }, [getParticularOffer]);

  useEffect(() => {
    getProductsFromOffer();
  }, [getProductsFromOffer]);

  useEffect(() => {
    showTokensRef.current = 20;
  }, []);

  useEffect(() => {
    if (currentCollection === undefined || !currentCollection) {
      setTokenNumber(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCollection]);

  useEffect(() => {
    initialTokenData();
  }, [initialTokenData]);

  useEffect(() => {
    return () => {
      setTokenNumber(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (mode === "collection") {
    return (
      <NftCollectionPage
        embeddedParams={embeddedParams}
        blockchain={blockchain}
        offerPrice={offerPrice}
        someUsersData={someUsersData}
        selectedData={selectedData}
        tokenDataFiltered={tokenDataFiltered}
        getAllProduct={getAllProduct}
        setShowToken={setShowToken}
        showToken={showToken}
        isLoading={isLoading}
        setTokenDataFiltered={setTokenDataFiltered}
        offerDataCol={offerDataInfo}
        offerAllData={ownerInfo}
        collectionName={collectionName}
        showTokensRef={showTokensRef}
        tokenNumber={tokenNumber}
      />
    );
  } else if (mode === "unlockables") {
    return (
      <NftUnlockablesPage
        embeddedParams={embeddedParams}
        productsFromOffer={productsFromOffer}
        selectedToken={selectedToken}
        setTokenDataFiltered={setTokenDataFiltered}
        someUsersData={someUsersData}
        collectionName={collectionName}
      />
    );
  } else if (mode === "tokens") {
    return (
      <NftDataPageMain
        embeddedParams={embeddedParams}
        blockchain={blockchain}
        contract={contract}
        handleClickToken={handleClickToken}
        offerData={offerData}
        offerPrice={offerPrice}
        productsFromOffer={productsFromOffer}
        setSelectedToken={setSelectedToken}
        someUsersData={someUsersData}
        selectedData={selectedData}
        selectedToken={selectedToken}
        product={product}
        ownerInfo={ownerInfo}
        offerDataInfo={offerDataInfo}
        setTokenNumber={setTokenNumber}
        getProductsFromOffer={getProductsFromOffer}
      />
    );
  } else {
    return <></>;
  }
};

export const NftDataCommonLink = memo(NftDataCommonLinkComponent);
