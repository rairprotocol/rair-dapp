//@ts-nocheck
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import NftDataPageMain from "./NftDataPageMain";

const NftDataExternalLink = () => {
  const { currentUserAddress } = useSelector((store) => store.contractStore);
  const { primaryColor, textColor } = useSelector((store) => store.colorStore);

  const [data, setData] = useState();
  const [dataForUser, setDataForUser] = useState();
  const [offer, setOffer] = useState([]);
  const [offerPrice, setOfferPrice] = useState();
  const [totalCount, setTotalCount] = useState();
  const [tokenData, setTokenData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [selectedToken, setSelectedToken] = useState();
  const [neededBlockchain, setNeededBlockchain] = useState();
  const [neededContract, setNeededContract] = useState();
  const [productsFromOffer, setProductsFromOffer] = useState([]);
  const [someUsersData, setSomeUsersData] = useState();
  const [selectedIndexInContract, setSelectedIndexInContract] = useState();
  // const [/*selectedContract*/, setSelectedContract] = useState();

  const history = useHistory();
  const params = useParams();
  const { contractId, product, token } = params;

  const getData = useCallback(async () => {
    if (contractId && product) {
      const response = await (
        await fetch(`/api/${contractId}/${product}`, {
          method: "GET",
        })
      ).json();
      if (response.success) {
        setData(response.result);
        setDataForUser(response.result.contract);
        setNeededContract(response.result.contract.contractAddress);
        setNeededBlockchain(response.result.contract.blockchain);
        // setSelectedContract(response.result.contract.products.contract);
        setSelectedIndexInContract(
          response.result.contract.products.collectionIndexInContract
        );
        setTotalCount(response.result.totalCount);
        setTokenData(response.result.tokens);
        setOffer(response.result.contract.products.offers)
        if (response.result.tokens.length >= Number(token)) {
          setSelectedData(response.result?.tokens[token]?.metadata);
        }

        setSelectedToken(token);
        setOfferPrice(
          response.result.contract.products.offers.map((p) => p.price)
        );
      } else {
        Swal.fire("Error", `${response.message}`, "error");
      }
    } else return null;
  }, [contractId, product, token]);

  const getProductsFromOffer = useCallback(async () => {
    if (neededBlockchain && neededContract) {
      const response = await (
        await fetch(
          `/api/nft/network/${neededBlockchain}/${neededContract}/${selectedIndexInContract}/files`,
          {
            method: "GET",
          }
        )
      ).json();
      setProductsFromOffer(response.files);
    }
  }, [neededContract, selectedIndexInContract, neededBlockchain]);

  function onSelect(id) {
    tokenData.forEach((p) => {
      if (p._id === id) {
        setSelectedData(p.metadata);
      }
    });
  }
  const handleClickToken = async (token) => {
    history.push(
      `/tokens/${neededBlockchain}/${neededContract}/${product}/${token}`
    );
    setSelectedData(tokenData[token].metadata);
    setSelectedToken(token);
  };

  const neededUserAddress = dataForUser?.user;

  const getInfoFromUser = useCallback(async () => {
    if (neededUserAddress) {
      const result = await fetch(`/api/users/${neededUserAddress}`).then(
        (blob) => blob.json()
      );
      setSomeUsersData(result.user);
    }
  }, [neededUserAddress]);

  useEffect(() => {
    getData();
    getProductsFromOffer();
    getInfoFromUser();
  }, [getData, getProductsFromOffer, getInfoFromUser]);

  return (
    <NftDataPageMain
      blockchain={neededBlockchain}
      contract={neededContract}
      currentUser={currentUserAddress}
      data={data}
      handleClickToken={handleClickToken}
      onSelect={onSelect}
      offerPrice={offerPrice}
      offerDataInfo={offer}
      tokenData={tokenData}
      totalCount={totalCount}
      textColor={textColor}
      selectedData={selectedData}
      selectedToken={selectedToken}
      someUsersData={someUsersData}
      setSelectedToken={setSelectedToken}
      primaryColor={primaryColor}
      productsFromOffer={productsFromOffer}
      product={product}
    />
  );
};

export default NftDataExternalLink;
