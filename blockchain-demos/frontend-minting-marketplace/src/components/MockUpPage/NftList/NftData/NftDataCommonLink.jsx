import React, { useState, useEffect, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import NftDataPageTest from "./NftDataPageTest";

const NftDataCommonLink = () => {
  const [tokenData, setTokenData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [selectedToken, setSelectedToken] = useState();

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


  console.log(selectedData, "selectedData");
  // console.log(tokenId, 'tokenId');

  useEffect(() => {
        // const responseAllProduct = 
        //     fetch(`/api/nft/${contract}/${product}`).then(res => {
        //         return res.json()
        //     }).then(res => res)
        
        // console.log(responseAllProduct)
        // setSelectedData(responseAllProduct?.result[tokenId].metadata);
        // setSelectedToken(tokenId);
        
    console.log(tokenId, "tokenId");
  }, [tokenId, contract, product]);


  useEffect(() => {
    getAllProduct();
  }, [getAllProduct]);

  return (
    <NftDataPageTest
      onSelect={onSelect}
      handleClickToken={handleClickToken}
      setSelectedToken={setSelectedToken}
      contract={contract}
      tokenData={tokenData}
      selectedData={selectedData}
      selectedToken={selectedToken}
    />
  );
};

export default NftDataCommonLink;
