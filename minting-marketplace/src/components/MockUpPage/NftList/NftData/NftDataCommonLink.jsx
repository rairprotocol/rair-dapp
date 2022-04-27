import React, { memo, useState, useEffect, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { NftCollectionPage } from "./NftCollectionPage";
import NftDataPageTest from "./NftDataPageTest";
import NftUnlockablesPage from "./NftUnlockablesPage";
import { useDispatch, useSelector } from "react-redux";

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

  
  const dispatch = useDispatch();

  const { currentUserAddress } = useSelector((store) => store.contractStore);
  const { primaryColor, textColor } = useSelector((store) => store.colorStore);

  const history = useHistory();
  const params = useParams();

  const { contract, product, tokenId, blockchain } = params;

  useEffect(() => {
    dispatch({ type: "SET_REAL_CHAIN", payload: blockchain });
  }, [blockchain, dispatch]);

  const getAllProduct = useCallback(
    async (fromToken, toToken) => {
      setIsLoading(true);

      const responseAllProduct = await (
        await fetch(
          `/api/nft/network/${blockchain}/${contract}/${product}?fromToken=${fromToken}&toToken=${toToken}`,
          {
            method: "GET",
          }
        )
      ).json();

      setIsLoading(false);

      setTokenData(responseAllProduct.result.tokens);
      setTotalCount(responseAllProduct.result.totalCount);

      if (responseAllProduct.result.tokens.length >= Number(tokenId)) {
        setSelectedData(responseAllProduct.result?.tokens[tokenId]?.metadata);
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
    let response = await (
      await fetch(
        `/api/nft/network/${blockchain}/${contract}/${product}/offers`,
        {
          method: "GET",
        }
      )
    ).json();

    if (response.success) {
      setDataForUser(response.product);
      setOfferData(
        response.product.offers.find(
          (neededOfferIndex) =>
            neededOfferIndex.offerIndex === selectedOfferIndex
        )
      );

      setOfferPrice(
        response?.product.offers.map((p) => {
          return p.price;
        })
      );
      
      setOwnerInfo(response.product);
      setOfferDataInfo(response.product.offers);
      setCollectionName(response.product.name);
      
    } else if (
      response?.message === "jwt expired" ||
      response?.message === "jwt malformed"
    ) {
      localStorage.removeItem("token");
    } else {
      console.log(response?.message);
    }
  }, [product, contract, selectedOfferIndex, blockchain]);

  const neededUserAddress = dataForUser?.owner;

  const getInfoFromUser = useCallback(async () => {
    // find user
    if(neededUserAddress){
      const result = await fetch(`/api/users/${neededUserAddress}`).then((blob) =>
      blob.json()
    );
    setSomeUsersData(result.user);
    }
  }, [neededUserAddress]);

  useEffect(() => {
    getInfoFromUser();
  }, [getInfoFromUser]);

  const getProductsFromOffer = useCallback(async () => {
    const response = await (
      await fetch(
        // `/api/nft/network/${blockchain}/${contract}/${product}/files/${tokenId}`,
        `/api/nft/network/${blockchain}/${contract}/${product}/files`,
        {
          method: "GET",
        }
      )
    ).json();

    setProductsFromOffer(response.files);
    setSelectedOfferIndex(tokenData[tokenId]?.offer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockchain, contract, product, tokenId]);

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
    history.push(`/tokens/${blockchain}/${contract}/${product}/${tokenId}`);

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

  //   const getBlockchains = async () => {
  //     var res = await (await fetch('/api/blockchains')).json();
  // console.log(res, 'res');

  //   }
  //   getBlockchains();
  if (params.tokens === "collection") {
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
  } else if (params.tokens === "unlockables") {
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
      />
    );
  } else {
    return (
      <NftDataPageTest
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
        totalCount={totalCount}
        product={product}
        ownerInfo={ownerInfo}
        offerDataInfo={offerDataInfo}
      />
    );
  }
};

export const NftDataCommonLink = memo(NftDataCommonLinkComponent);

// import React, { useState, useEffect, useCallback } from "react";
// import { useParams, useHistory } from "react-router-dom";
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
//   const history = useHistory();
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
//     history.push(`/tokens/${blockchain}/${contract}/${product}/${tokenId}`);

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
