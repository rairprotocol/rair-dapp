import React, { useState, useEffect, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import NftDataPageTest from "./NftDataPageTest";

const NftDataExternalLink = ( primaryColor, textColor ) => {
  const [data, setData] = useState();
  const [tokenData, setTokenData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [selectedToken, setSelectedToken] = useState();
  const [offerPrice, setOfferPrice] = useState();

  // eslint-disable-next-line no-unused-vars
  const history = useHistory();
  const params = useParams();
  const { adminToken, contract, product, token, offer, tokenId } = params;

  const getData = useCallback(async () => {
    if (adminToken && contract && product) {
      const response = await (
        await fetch(`/api/${adminToken}/${contract}/${product}`, {
          method: "GET",
        })
      ).json();
      //   const data = response.result?.tokens.find(
      //     (data) => String(data.token) === token
      //   );
      setTokenData(response.result.tokens);
      setSelectedData(response.result.tokens[token].metadata)
      setData(response.result);
    // setSelectedToken(tokenId)
      setOfferPrice(
        response.result.product.products.offers.map((p) => p.price)
      );

      // setContractAddress(response.result.product.contractAddress)
      //   return response.result;
    } else return null;
  }, [adminToken, contract, product]);

  console.log(params, "selectedToken");

  useEffect(() => {
    getData();
  }, [getData]);

  return <NftDataPageTest data={data} primaryColor={primaryColor} textColor={textColor} tokenData={tokenData} selectedData={selectedData} selectedToken={selectedToken} offerPrice={offerPrice} />;
};

export default NftDataExternalLink;
