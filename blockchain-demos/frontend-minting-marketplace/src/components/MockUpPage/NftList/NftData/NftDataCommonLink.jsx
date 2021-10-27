import React, { useState, useEffect, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import NftDataPageTest from "./NftDataPageTest";

const NftDataCommonLink = () => {
  //   const [data, setData] = useState();
  const [tokenData, setTokenData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [selectedToken, setSelectedToken] = useState();

  // eslint-disable-next-line no-unused-vars
  const history = useHistory();
  const params = useParams();
  const { adminToken, contract, product, token, offer, tokenId } = params;

  const getAllProduct = useCallback(async () => {
    const responseAllProduct = await (
      await fetch(`/api/nft/${contract}/${product}`, {
        method: "GET",
      })
    ).json();

    setTokenData(responseAllProduct.result);
    setSelectedData(responseAllProduct.result[0].metadata);
    setSelectedToken(tokenId);
    // setData(responseAllProduct);
    // if (!Object.keys(params).length)
    //   setSelected(responseAllProduct.result[0].metadata);
  }, [product, contract, tokenId]);

  console.log(selectedToken, "selectedToken");

  function onSelect(id) {
    tokenData.forEach((p) => {
      if (p._id === id) {
        setSelectedData(p.metadata);
      }
    });
  }
  const handleClickToken = async (tokenId) => {
    // const data = await getAllProduct();
    // history.push(`/tokens/${contract}/${product}/${tokenId}`);
    setSelectedData(tokenData[tokenId].metadata)
    // setSelectedToken(tokenId);
  };

  useEffect(() => {
    getAllProduct();
  }, [getAllProduct]);

  return (
    <NftDataPageTest
      onSelect={onSelect}
      contract={contract}
      handleClickToken={handleClickToken}
      tokenData={tokenData}
      selectedData={selectedData}
      selectedToken={selectedToken}
    />
  );
};

export default NftDataCommonLink;
