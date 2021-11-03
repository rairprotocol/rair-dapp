import React, { useState, useEffect, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import NftDataPageTest from "./NftDataPageTest";

const NftDataCommonLink = ({currentUser, primaryColor, textColor}) => {
  const [tokenData, setTokenData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [selectedToken, setSelectedToken] = useState();
  const [offer, setOffer] = useState({});

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


const getParticularOffer = useCallback( async () => {
		let response = await (await fetch(`/api/contracts/${contract}/products/offers`, {
            method: "GET",
			headers: {
				'x-rair-token': localStorage.token
			}
		})).json()
		if (response.success) {
			setOffer(response.products)
		} else if (response?.message === 'jwt expired' || response?.message === 'jwt malformed') {
			localStorage.removeItem('token');
		} else {
			console.log(response?.message);
		}
	}, [contract])



console.log(offer, 'offer!!!!');

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
  }, [getAllProduct, getParticularOffer]);

  return (
    <NftDataPageTest
      currentUser={currentUser}
      onSelect={onSelect}
      handleClickToken={handleClickToken}
      setSelectedToken={setSelectedToken}
      contract={contract}
      tokenData={tokenData}
      selectedData={selectedData}
      selectedToken={selectedToken}
      primaryColor={primaryColor}
      textColor={textColor}
    />
  );
};

export default NftDataCommonLink;
