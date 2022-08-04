//@ts-nocheck
import React, { memo, useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { NftCollectionPage } from './NftCollectionPage';
import NftDataPageMain from './NftDataPageMain';
import NftUnlockablesPage from './NftUnlockablesPage';
import { useDispatch, useSelector } from 'react-redux';
import { setRealChain } from '../../../../ducks/contracts/actions';
import axios, { AxiosError } from 'axios';
import {
  IOffersResponseType,
  TNftFilesResponse,
  TNftItemResponse,
  TUserResponse
} from '../../../../axios.responseTypes';
import { utils } from 'ethers';

const NftDataCommonLinkComponent = ({ userData }) => {
  const [collectionName, setCollectionName] = useState();
  const [tokenData, setTokenData] = useState([]);
  const [tokenDataFiltered, setTokenDataFiltered] = useState([]);
  const [totalCount, setTotalCount] = useState();
  const [selectedData, setSelectedData] = useState([]);
  const [selectedOfferIndex, setSelectedOfferIndex] = useState();
  const [selectedToken, setSelectedToken] = useState();
  const [offerPrice, setOfferPrice] = useState([]);
  const [offerData, setOfferData] = useState([]);
  const [offerDataInfo, setOfferDataInfo] = useState();
  const [ownerInfo, setOwnerInfo] = useState();
  const [productsFromOffer, setProductsFromOffer] = useState([]);
  const [showToken, setShowToken] = useState(15);
  const [isLoading, setIsLoading] = useState(false);
  const [someUsersData, setSomeUsersData] = useState();
  const [dataForUser, setDataForUser] = useState();
  const [userToken, setUserToken] = useState();

  const dispatch = useDispatch();

  const { currentUserAddress } = useSelector((store) => store.contractStore);
  const { primaryColor, textColor } = useSelector((store) => store.colorStore);

  const navigate = useNavigate();
  const params = useParams();
  const { pathname } = useLocation();
  const mode = pathname?.split('/')?.at(1);

  const { contract, product, tokenId, blockchain } = params;

  // console.log(tokenData, 'tokenData');

  const checkUserConnect = useCallback(() => {
    if (currentUserAddress) {
      setUserToken(localStorage.getItem('token'));
    }
  }, [currentUserAddress]);

  useEffect(() => {
    dispatch(setRealChain(blockchain));
  }, [blockchain, dispatch]);

  useEffect(() => {
    checkUserConnect();
  }, [checkUserConnect]);

  const getAllProduct = useCallback(
    async (fromToken, toToken) => {
      setIsLoading(true);
      let responseAllProduct;
      if (tokenId > 15) {
        responseAllProduct = await axios.get(
          `/api/nft/network/${blockchain}/${contract}/${product}`
        );
      } else if (tokenId <= 15) {
        responseAllProduct = await axios.get<TNftItemResponse>(
          `/api/nft/network/${blockchain}/${contract}/${product}?fromToken=${fromToken}&toToken=${toToken}`
        );
      }
      setIsLoading(false);

      setTokenData(responseAllProduct.data.result.tokens);
      setTotalCount(responseAllProduct.data.result.totalCount);

      if (responseAllProduct.data.result.tokens.length >= Number(tokenId)) {
        setSelectedData(
          responseAllProduct.data.result?.tokens[tokenId]?.metadata
        );
      }

      setSelectedToken(tokenId);
    },
    [product, contract, tokenId, blockchain]
  );

  // ---- return only offers for particular contract with x-token ----

  // const getParticularOffer = useCallback(async () => {
  //   let response = await (
  //     await fetch(`/api/contracts/${contract}/products/offers`, {
  //     // await fetch(`/api/nft/${contract}/${product}/offers`, {
  //       method: "GET",
  //       headers: {
  //         "x-rair-token": localStorage.token,
  //       },
  //     })
  //   ).json();

  //   if (response.success) {
  //     response?.products.map((patOffer) => {
  //       if (patOffer.collectionIndexInContract === Number(product)) {
  //         setOffer(patOffer);
  //         const priceOfData = patOffer?.offers.map((p) => {
  //           return p.price;
  //         });
  //         setOfferPrice(priceOfData);
  //       }
  //       return patOffer;
  //     });
  //   } else if (
  //     response?.message === "jwt expired" ||
  //     response?.message === "jwt malformed"
  //   ) {
  //     localStorage.removeItem("token");
  //   } else {
  //     console.log(response?.message);
  //   }
  // }, [product, contract]);

  // ---- return only offers for particular contract with x-token END ----

  const getParticularOffer = useCallback(async () => {
    try {
      const response = await axios.get<IOffersResponseType>(
        `/api/nft/network/${blockchain}/${contract}/${product}/offers`
      );

      if (response.data.success) {
        setDataForUser(response.data.product);
        setOfferData(
          response.data.product.offers.find(
            (neededOfferIndex) =>
              neededOfferIndex.offerIndex === selectedOfferIndex
          )
        );

        setOfferPrice(
          response?.data.product.offers.map((p) => {
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

  const getProductsFromOffer = useCallback(async () => {
    if (userToken) {
      const responseIfUserConnect = await axios.get<TNftFilesResponse>(
        // `/api/nft/network/${blockchain}/${contract}/${product}/files/${tokenId}`,
        `/api/nft/network/${blockchain}/${contract}/${product}/files`,
        {
          headers: {
            Accept: 'application/json',
            'X-rair-token': userToken
          }
        }
      );
      setProductsFromOffer(responseIfUserConnect.data.files);
      setSelectedOfferIndex(tokenData[tokenId]?.offer);
    } else {
      const response = await axios.get<TNftFilesResponse>(
        // `/api/nft/network/${blockchain}/${contract}/${product}/files/${tokenId}`,
        `/api/nft/network/${blockchain}/${contract}/${product}/files`
      );

      setProductsFromOffer(response.data.files);
      setSelectedOfferIndex(tokenData[tokenId]?.offer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockchain, contract, product, tokenId, userToken]);

  const onSelect = useCallback(
    (id) => {
      tokenData.forEach((p) => {
        if (p._id === id) {
          setSelectedData(p.metadata);
        }
      });
    },
    [tokenData]
  );

  const handleClickToken = async (tokenId) => {
    navigate(`/tokens/${blockchain}/${contract}/${product}/${tokenId}`);

    if (tokenData.length >= Number(tokenId)) {
      setSelectedData(tokenData[tokenId].metadata);
    }

    setSelectedToken(tokenId);
  };

  useEffect(() => {
    getAllProduct(0, showToken);
    getParticularOffer();
    getProductsFromOffer();
  }, [getAllProduct, getParticularOffer, getProductsFromOffer, showToken]);

  // TODO:for feature - get automatically all blockchains
  //   const getBlockchains = async () => {
  //     var res = await (await fetch('/api/blockchains')).json();
  //      console.log(res, 'res');

  //   }
  //   getBlockchains();

  if (mode === 'collection') {
    return (
      <NftCollectionPage
        userData={userData}
        blockchain={blockchain}
        contract={contract}
        currentUser={currentUserAddress}
        handleClickToken={handleClickToken}
        onSelect={onSelect}
        offerData={offerData}
        offerPrice={offerPrice}
        primaryColor={primaryColor}
        productsFromOffer={productsFromOffer}
        setSelectedToken={setSelectedToken}
        someUsersData={someUsersData}
        selectedData={selectedData}
        selectedToken={selectedToken}
        textColor={textColor}
        tokenData={tokenData}
        tokenDataFiltered={tokenDataFiltered}
        totalCount={totalCount}
        product={product}
        getAllProduct={getAllProduct}
        setShowToken={setShowToken}
        showToken={showToken}
        isLoading={isLoading}
        setTokenData={setTokenData}
        setTokenDataFiltered={setTokenDataFiltered}
        offerDataCol={offerDataInfo}
        offerAllData={ownerInfo}
        collectionName={collectionName}
      />
    );
  } else if (mode === 'unlockables') {
    return (
      <NftUnlockablesPage
        userData={userData}
        blockchain={blockchain}
        contract={contract}
        currentUser={currentUserAddress}
        handleClickToken={handleClickToken}
        onSelect={onSelect}
        offerData={offerData}
        offerPrice={offerPrice}
        primaryColor={primaryColor}
        productsFromOffer={productsFromOffer}
        setSelectedToken={setSelectedToken}
        selectedData={selectedData}
        selectedToken={selectedToken}
        textColor={textColor}
        tokenData={tokenData}
        totalCount={totalCount}
        product={product}
        setTokenDataFiltered={setTokenDataFiltered}
        someUsersData={someUsersData}
        collectionName={collectionName}
      />
    );
  } else if (mode === 'tokens') {
    return (
      <NftDataPageMain
        userData={userData}
        blockchain={blockchain}
        contract={contract}
        currentUser={currentUserAddress}
        handleClickToken={handleClickToken}
        onSelect={onSelect}
        offerData={offerData}
        offerPrice={offerPrice}
        primaryColor={primaryColor}
        productsFromOffer={productsFromOffer}
        setTokenData={setTokenData}
        getAllProduct={getAllProduct}
        setSelectedToken={setSelectedToken}
        someUsersData={someUsersData}
        selectedData={selectedData}
        selectedToken={selectedToken}
        textColor={textColor}
        tokenData={tokenData}
        totalCount={totalCount}
        product={product}
        ownerInfo={ownerInfo}
        offerDataInfo={offerDataInfo}
      />
    );
  } else {
    return <></>;
  }
};

export const NftDataCommonLink = memo(NftDataCommonLinkComponent);

// import React, { useState, useEffect, useCallback } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { NftCollectionPage } from "./NftCollectionPage";
// import NftDataPageTest from "./NftDataPageTest";

// const NftDataCommonLink = ({ currentUser, primaryColor, textColor }) => {
//   // const [, /*offer*/ setOffer] = useState({});

//   const [tokenData, setTokenData] = useState([]);
//   const [selectedData, setSelectedData] = useState([]);
//   const [selectedOfferIndex, setSelectedOfferIndex] = useState();
//   const [selectedToken, setSelectedToken] = useState();
//   const [offerPrice, setOfferPrice] = useState([]);
//   const [offerData, setOfferData] = useState([]);
//   const [productsFromOffer, setProductsFromOffer] = useState([]);
//   const [totalCount, setTotalCount] = useState();

//   // eslint-disable-next-line no-unused-vars
//   const navigate = useNavigate();
//   const params = useParams();

//   const {  contract, product, tokenId, blockchain } = params;

//   const getAllProduct = useCallback(async () => {
//     const responseAllProduct = await (
//       await fetch(`/api/nft/network/${blockchain}/${contract}/${product}`, {
//         method: "GET",
//       })
//     ).json();

//     setTokenData(responseAllProduct.result.tokens);
//     setTotalCount(responseAllProduct.result.totalCount);

//     if (responseAllProduct.result.tokens.length >= Number(tokenId)) {
//       setSelectedData(responseAllProduct.result?.tokens[tokenId]?.metadata);
//     }

//     setSelectedToken(tokenId);
//   }, [product, contract, tokenId, blockchain]);

//   // ---- return only offers for particular contract with x-token ----

//   // const getParticularOffer = useCallback(async () => {
//   //   let response = await (
//   //     await fetch(`/api/contracts/${contract}/products/offers`, {
//   //     // await fetch(`/api/nft/${contract}/${product}/offers`, {
//   //       method: "GET",
//   //       headers: {
//   //         "x-rair-token": localStorage.token,
//   //       },
//   //     })
//   //   ).json();

//   //   if (response.success) {
//   //     response?.products.map((patOffer) => {
//   //       if (patOffer.collectionIndexInContract === Number(product)) {
//   //         setOffer(patOffer);
//   //         const priceOfData = patOffer?.offers.map((p) => {
//   //           return p.price;
//   //         });
//   //         setOfferPrice(priceOfData);
//   //       }
//   //       return patOffer;
//   //     });
//   //   } else if (
//   //     response?.message === "jwt expired" ||
//   //     response?.message === "jwt malformed"
//   //   ) {
//   //     localStorage.removeItem("token");
//   //   } else {
//   //     console.log(response?.message);
//   //   }
//   // }, [product, contract]);

//   // ---- return only offers for particular contract with x-token END ----

//   const getParticularOffer = useCallback(async () => {
//     let response = await (
//       await fetch(
//         `/api/nft/network/${blockchain}/${contract}/${product}/offers`,
//         {
//           method: "GET",
//         }
//       )
//     ).json();

//     if (response.success) {
//       setOfferData(
//         response.product.offers.find(
//           (neededOfferIndex) =>
//             neededOfferIndex.offerIndex === selectedOfferIndex
//         )
//       );

//       setOfferPrice(
//         response?.product.offers.map((p) => {
//           return p.price;
//         })
//       );
//     } else if (
//       response?.message === "jwt expired" ||
//       response?.message === "jwt malformed"
//     ) {
//       localStorage.removeItem("token");
//     } else {
//       console.log(response?.message);
//     }
//   }, [product, contract, selectedOfferIndex, blockchain]);

//   const getProductsFromOffer = useCallback(async () => {
//     const response = await (
//       await fetch(
//         `/api/nft/network/${blockchain}/${contract}/${product}/files/${tokenId}`,
//         {
//           method: "GET",
//         }
//       )
//     ).json();

//     setProductsFromOffer(response.files);
//     setSelectedOfferIndex(tokenData[tokenId]?.offer);
//   }, [blockchain, contract, product, tokenId, tokenData]);

//   function onSelect(id) {
//     tokenData.forEach((p) => {
//       if (p._id === id) {
//         setSelectedData(p.metadata);
//       }
//     });
//   }

//   const handleClickToken = async (tokenId) => {
//     navigate(`/tokens/${blockchain}/${contract}/${product}/${tokenId}`);

//     if (tokenData.length >= Number(tokenId)) {
//       setSelectedData(tokenData[tokenId].metadata);
//     }

//     setSelectedToken(tokenId);
//   };

//   useEffect(() => {
//     getAllProduct();
//     getParticularOffer();
//     getProductsFromOffer();

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [getAllProduct, getParticularOffer]);

//   if (params.tokens === "collection") {
//     return (
//       <NftCollectionPage
//         blockchain={blockchain}
//         contract={contract}
//         currentUser={currentUser}
//         handleClickToken={handleClickToken}
//         onSelect={onSelect}
//         offerData={offerData}
//         offerPrice={offerPrice}
//         primaryColor={primaryColor}
//         productsFromOffer={productsFromOffer}
//         setSelectedToken={setSelectedToken}
//         selectedData={selectedData}
//         selectedToken={selectedToken}
//         textColor={textColor}
//         tokenData={tokenData}
//         totalCount={totalCount}
//         product={product}
//       />
//     );
//   }
//   return (
//     <NftDataPageTest
//       blockchain={blockchain}
//       contract={contract}
//       currentUser={currentUser}
//       handleClickToken={handleClickToken}
//       onSelect={onSelect}
//       offerData={offerData}
//       offerPrice={offerPrice}
//       primaryColor={primaryColor}
//       productsFromOffer={productsFromOffer}
//       setSelectedToken={setSelectedToken}
//       selectedData={selectedData}
//       selectedToken={selectedToken}
//       textColor={textColor}
//       tokenData={tokenData}
//       totalCount={totalCount}
//       product={product}
//     />
//   );
// };

// export default NftDataCommonLink;
