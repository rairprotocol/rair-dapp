import React, { useState, useEffect, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from 'react-redux';
import Swal from "sweetalert2";
import NftDataPageTest from "./NftDataPageTest";

const NftDataExternalLink = () => {
  const [data, setData] = useState();
  const [offerPrice, setOfferPrice] = useState();

  const { currentUserAddress } = useSelector(store => store.contractStore);
  const { primaryColor, textColor } = useSelector(store => store.colorStore);

  const [tokenData, setTokenData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [selectedToken, setSelectedToken] = useState();
  const [productsFromOffer, setProductsFromOffer] = useState([]);
  const [selectedContract, setSelectedContract] = useState();
  const [selectedIndexInContract, setSelectedIndexInContract] = useState();

  // eslint-disable-next-line no-unused-vars
  const history = useHistory();
  const params = useParams();
  const { blockchain, adminToken, contract, product, token, offer } = params;

  const getData = useCallback(async () => {
    if (adminToken && contract && product) {
      const response = await (
        await fetch(`/api/${adminToken}/${contract}/${product}`, { //add blabla before adminToken
          method: "GET",
        })
      ).json();
      if(response.success === true){
        setData(response.result);
        setSelectedContract(response.result.product.products.contract)
        setSelectedIndexInContract(response.result.product.products.collectionIndexInContract)
  
        setTokenData(response.result.tokens);
        setSelectedData(response.result.tokens[token].metadata);
        setSelectedToken(token);
        setOfferPrice(
          response.result.product.products.offers.map((p) => p.price)
        );
      } else {
        Swal.fire('Error', `${response.message}`, 'error');
      }
      
    } else return null;
  }, [adminToken, contract, product, token]);

  const getProductsFromOffer = useCallback(async () => {
    const response = await (
      await fetch(`/api/nft/network/${blockchain}/${selectedContract}/${selectedIndexInContract}/files/${token}`, {
        method: "GET",
      })
    ).json();
    setProductsFromOffer(response.files);
  }, [selectedContract, selectedIndexInContract, token, blockchain]);

  function onSelect(id) {
    tokenData.forEach((p) => {
      if (p._id === id) {
        setSelectedData(p.metadata);
      }
    });
  }
  const handleClickToken = async (token) => {
    history.push(`/${adminToken}/${blockchain}/${contract}/${product}/${offer}/${token}`);
    setSelectedData(tokenData[token].metadata);
    setSelectedToken(token);
  };

  useEffect(() => {
    getData();
    getProductsFromOffer();
  }, [getData, getProductsFromOffer]);

  return (
    <NftDataPageTest
      currentUser={currentUserAddress}
      onSelect={onSelect}
      handleClickToken={handleClickToken}
      setSelectedToken={setSelectedToken}
      contract={contract}
      tokenData={tokenData}
      selectedData={selectedData}
      selectedToken={selectedToken}
      data={data}
      offerPrice={offerPrice}
      primaryColor={primaryColor}
      productsFromOffer={productsFromOffer}
      textColor={textColor}
    />
  );
};

export default NftDataExternalLink;
