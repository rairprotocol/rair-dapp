//@ts-nocheck
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import NftDataPageMain from "./NftDataPageMain";
import axios, { AxiosError } from "axios";
import { TNFTDataExternalLinkContractProduct, TNftFilesResponse, TUserResponse } from "../../../../axios.responseTypes";

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

      try {
        const response = await axios.get<TNFTDataExternalLinkContractProduct>(`/api/${contractId}/${product}`);
        const { success, result } = response.data;
        if (success) {
          setData(result);
          setDataForUser(result.contract);
          setNeededContract(result.contract.contractAddress);
          setNeededBlockchain(result.contract.blockchain);
          // setSelectedContract(response.result.contract.products.contract);
          setSelectedIndexInContract(
            result.contract.products.collectionIndexInContract
          );
          setTotalCount(result.totalCount);
          setTokenData(result.tokens);
  
          if (result.tokens.length >= Number(token)) {
            setSelectedData(result?.tokens[token]?.metadata);
          }
  
          setSelectedToken(token);
          setOfferPrice(
            result.contract.products.offers.map((p) => p.price)
          );
        }
      } catch (err) {
        const error = err as AxiosError;
        Swal.fire("Error", `${error.message}`, "error");
      }
      
    } else return null;
  }, [contractId, product, token]);

  const getProductsFromOffer = useCallback(async () => {
    if (neededBlockchain && neededContract) {
      const response = await axios.get<TNftFilesResponse>(
          `/api/nft/network/${neededBlockchain}/${neededContract}/${selectedIndexInContract}/files`
        );
      setProductsFromOffer(response.data.files);
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
      const result = await axios.get<TUserResponse>(`/api/users/${neededUserAddress}`).then(
        (res) => res.data
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
