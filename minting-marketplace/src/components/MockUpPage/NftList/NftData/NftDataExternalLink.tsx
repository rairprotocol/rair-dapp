import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { utils } from 'ethers';
import Swal from 'sweetalert2';

import NftDataPageMain from './NftDataPageMain';

import {
  TContract,
  TFileType,
  TMetadataType,
  TNFTDataExternalLinkContractProduct,
  TNftFilesResponse,
  TTokenData,
  TUserResponse
} from '../../../../axios.responseTypes';
import { RootState } from '../../../../ducks';
import { ColorStoreType } from '../../../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../../../ducks/contracts/contracts.types';
import { UserType } from '../../../../ducks/users/users.types';
import { TOfferType } from '../../../marketplace/marketplace.types';
import { TNftExternalLinkType } from '../nftList.types';

const NftDataExternalLink = () => {
  const { currentUserAddress } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );
  const { primaryColor, textColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  const [, /*data*/ setData] = useState<TNftExternalLinkType>();
  const [dataForUser, setDataForUser] = useState<TContract>();
  const [offer /*setOffer*/] = useState<TOfferType[]>([]);
  const [offerPrice, setOfferPrice] = useState<string[]>();
  const [totalCount, setTotalCount] = useState<number>();
  const [tokenData, setTokenData] = useState<TTokenData[]>([]);
  const [selectedData, setSelectedData] = useState<TMetadataType>();
  const [selectedToken, setSelectedToken] = useState<string>();
  const [neededBlockchain, setNeededBlockchain] = useState<
    BlockchainType | undefined
  >();
  const [neededContract, setNeededContract] = useState<string>();
  const [productsFromOffer, setProductsFromOffer] = useState<TFileType[]>([]);
  const [someUsersData, setSomeUsersData] = useState<UserType | null>(null);
  const [selectedIndexInContract, setSelectedIndexInContract] =
    useState<string>();

  const navigate = useNavigate();
  const params = useParams();
  const { contractId, product, token } = params;

  const getData = useCallback(async () => {
    if (contractId && product) {
      try {
        const response = await axios.get<TNFTDataExternalLinkContractProduct>(
          `/api/${contractId}/${product}`
        );
        const { success, result } = response.data;
        if (success) {
          setData(result);
          setDataForUser(result.contract);
          setNeededContract(result.contract.contractAddress);
          setNeededBlockchain(result.contract.blockchain);
          setSelectedIndexInContract(
            result.contract.products.collectionIndexInContract
          );
          setTotalCount(result.totalCount);
          setTokenData(result.tokens);

          if (result.tokens.length >= Number(token)) {
            setSelectedData(token && result?.tokens[token]?.metadata);
          }

          setSelectedToken(token);
          setOfferPrice(result.contract.products.offers?.map((p) => p.price));
        }
      } catch (err) {
        const error = err as AxiosError;
        Swal.fire('Error', `${error.message}`, 'error');
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

  //unused-snippet
  function onSelect(id: string) {
    tokenData.forEach((p) => {
      if (p._id === id) {
        setSelectedData(p.metadata);
      }
    });
  }
  const handleClickToken = async (token: string | undefined) => {
    navigate(
      `/tokens/${neededBlockchain}/${neededContract}/${product}/${token}`
    );
    token && setSelectedData(tokenData[token].metadata);
    setSelectedToken(token);
  };

  const neededUserAddress = dataForUser?.user;

  const getInfoFromUser = useCallback(async () => {
    if (neededUserAddress && utils.isAddress(neededUserAddress)) {
      const result = await axios
        .get<TUserResponse>(`/api/users/${neededUserAddress}`)
        .then((res) => res.data);
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
      handleClickToken={handleClickToken}
      offerPrice={offerPrice}
      offerDataInfo={offer}
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
