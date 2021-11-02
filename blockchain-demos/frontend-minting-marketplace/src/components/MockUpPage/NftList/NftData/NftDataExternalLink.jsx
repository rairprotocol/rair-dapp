import React, { useState, useEffect, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import NftDataPageTest from "./NftDataPageTest";

const NftDataExternalLink = ({ primaryColor, textColor }) => {
  const [data, setData] = useState();
  const [offerPrice, setOfferPrice] = useState();

  const [tokenData, setTokenData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [selectedToken, setSelectedToken] = useState();

  // eslint-disable-next-line no-unused-vars
  const history = useHistory();
  const params = useParams();
  const { adminToken, contract, product, token, offer } = params;

  const getData = useCallback(async () => {
    if (adminToken && contract && product) {
      const response = await (
        await fetch(`/api/${adminToken}/${contract}/${product}`, {
          method: "GET",
        })
      ).json();

      setData(response.result);

      setTokenData(response.result.tokens);
      setSelectedData(response.result.tokens[token].metadata);
      setSelectedToken(token);
      setOfferPrice(
        response.result.product.products.offers.map((p) => p.price)
      );
    } else return null;
  }, [adminToken, contract, product, token]);

  function onSelect(id) {
    tokenData.forEach((p) => {
      if (p._id === id) {
        setSelectedData(p.metadata);
      }
    });
  }
  const handleClickToken = async (token) => {
    history.push(`/${adminToken}/${contract}/${product}/${offer}/${token}`);
    setSelectedData(tokenData[token].metadata);
    setSelectedToken(token);
  };
  
  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <NftDataPageTest
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
      textColor={textColor}
    />
  );
};

export default NftDataExternalLink;
