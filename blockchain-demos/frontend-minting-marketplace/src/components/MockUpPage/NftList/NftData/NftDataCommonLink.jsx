import React, { useState, useEffect, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import NftDataPageTest from "./NftDataPageTest";

const NftDataCommonLink = ({ currentUser, primaryColor, textColor }) => {
  const [tokenData, setTokenData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [selectedToken, setSelectedToken] = useState();
  const [, /*offer*/ setOffer] = useState({});
  const [offerPrice, setOfferPrice] = useState([]);
  const [productsFromOffer, setProductsFromOffer] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const history = useHistory();
  const params = useParams();
  const { contract, product, tokenId } = params;

  const getAllProduct = useCallback(async () => {
    const responseAllProduct = await (
      await fetch(`/api/nft/${contract}/${product}`, {
        method: "GET",
      })
    ).json();

    setTokenData(responseAllProduct.result);
    setSelectedData(responseAllProduct.result[tokenId].metadata);
    setSelectedToken(tokenId);
  }, [product, contract, tokenId]);

  const getParticularOffer = useCallback(async () => {
    let response = await (
      await fetch(`/api/contracts/${contract}/products/offers`, {
        method: "GET",
        headers: {
          "x-rair-token": localStorage.token,
        },
      })
    ).json();

    if (response.success) {
      response?.products.map((patOffer) => {
        if (patOffer.collectionIndexInContract === Number(product)) {
          setOffer(patOffer);
          const priceOfData = patOffer?.offers.map((p) => {
            return p.price;
          });
          setOfferPrice(priceOfData);
        }
        return patOffer;
      });
    } else if (
      response?.message === "jwt expired" ||
      response?.message === "jwt malformed"
    ) {
      localStorage.removeItem("token");
    } else {
      console.log(response?.message);
    }
  }, [product, contract]);

  const getProductsFromOffer = useCallback(async () => {
    const response = await (
      await fetch(`/api/nft/${contract}/${product}/files/${tokenId}`, {
        method: "GET",
      })
    ).json();
    setProductsFromOffer(response.files);
  }, [product, contract, tokenId]);

  //   console.log(offer, "offer!!!!");
  //   console.log(params, "@params@");

  function onSelect(id) {
    tokenData.forEach((p) => {
      if (p._id === id) {
        setSelectedData(p.metadata);
      }
    });
  }

  const handleClickToken = async (tokenId) => {
    history.push(`/tokens/${contract}/${product}/${tokenId}`);
    setSelectedData(tokenData[tokenId].metadata);
    setSelectedToken(tokenId);
  };

  useEffect(() => {
    getAllProduct();
    getParticularOffer();
    getProductsFromOffer();
  }, [getAllProduct, getParticularOffer, getProductsFromOffer]);

  return (
    <NftDataPageTest
      contract={contract}
      currentUser={currentUser}
      handleClickToken={handleClickToken}
      onSelect={onSelect}
      offerPrice={offerPrice}
      primaryColor={primaryColor}
      productsFromOffer={productsFromOffer}
      setSelectedToken={setSelectedToken}
      selectedData={selectedData}
      selectedToken={selectedToken}
      textColor={textColor}
      tokenData={tokenData}
    />
  );
};

export default NftDataCommonLink;
