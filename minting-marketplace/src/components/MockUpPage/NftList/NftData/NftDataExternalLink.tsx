//@ts-nocheck
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { constants, utils } from 'ethers';
import Swal from 'sweetalert2';

import NftDataPageMain from './NftDataPageMain';

import {
  TContract,
  TFileType,
  TMetadataType,
  // TNFTDataExternalLinkContractProduct,
  TNftFilesResponse,
  TNftItemResponse,
  // TTokenData,
  TUserResponse
} from '../../../../axios.responseTypes';
import { RootState } from '../../../../ducks';
import { ColorStoreType } from '../../../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../../../ducks/contracts/contracts.types';
import {
  setTokenData,
  setTokenDataStart
} from '../../../../ducks/nftData/action';
import { UserType } from '../../../../ducks/users/users.types';
import { TOfferType } from '../../../marketplace/marketplace.types';
// import { TNftExternalLinkType } from '../nftList.types';

const NftDataExternalLink = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const { contractId, product, token } = params;

  const { currentUserAddress } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );
  const { textColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  const [dataForUser, setDataForUser] = useState<TContract>();
  const [offer, setOffer] = useState<TOfferType[]>([]);
  const [offerPrice, setOfferPrice] = useState<string[]>();
  const [totalCount, setTotalCount] = useState<number>();
  const [selectedData, setSelectedData] = useState<TMetadataType>();
  const [selectedToken, setSelectedToken] = useState<string>();
  const [neededBlockchain, setNeededBlockchain] = useState<
    BlockchainType | undefined
  >();
  const [productsFromOffer, setProductsFromOffer] = useState<TFileType[]>([]);
  const [someUsersData, setSomeUsersData] = useState<UserType | null>(null);
  const [typeOfContract, setTypeOfContract] = useState();
  const [neededContract, setNeededContract] = useState();
  const [neededTokenOffer, setNeededTokenOffer] = useState();
  const [contractOfProduct, setContractOfProduct] = useState();
  const [neededProduct, setNeededProduct] = useState();
  const [lastToken, setLastToken] = useState();
  const [showToken, setShowToken] = useState<number>(15);

  const [, /*dataFromOneToken*/ setDataFromOneToken] = useState();
  const [, /*dataFromOneContract*/ setDataFromOneContract] = useState();
  const [, /*dataFromOneOffer*/ setDataFromOneOffers] = useState();
  const [dataFromListTokens, setDataFromListTokens] = useState();
  const [ifClassicContract, setIfClassicContract] = useState();

  const getData = useCallback(async () => {
    if (contractId && product && token) {
      try {
        const response = await axios.get(
          `/api/tokens/${token}?contract=${contractId}&product=${product}`
        );
        const { success, data } = response.data;
        if (success) {
          setNeededContract(data.doc.contract);
          setNeededTokenOffer(data.doc.offer);
          setDataFromOneToken(data.doc);
          setSelectedData(data.doc?.metadata);
          setSelectedToken(token);
          if (data.doc.offerPool) {
            setIfClassicContract(data.doc.offerPool);
          }
        }
      } catch (err) {
        const error = err as AxiosError;
        Swal.fire('Error', `${error.message}`, 'error');
      }
    } else return null;
  }, [contractId, product, token]);

  const getContractInfo = useCallback(async () => {
    if (neededContract) {
      try {
        const response = await axios.get(`/api/contracts/${neededContract}`);
        const { success, contract } = response.data;
        if (success) {
          setDataFromOneContract(contract);
          setTypeOfContract(contract.diamond);
          setNeededBlockchain(contract.blockchain);
          setContractOfProduct(contract.contractAddress);
        }
      } catch (err) {
        const error = err as AxiosError;
        Swal.fire('Error', `${error.message}`, 'error');
      }
    } else return null;
  }, [neededContract]);

  const getOfferInfo = useCallback(
    async (typeOfContract) => {
      switch (typeOfContract) {
        case true:
          // eslint-disable-next-line no-case-declarations
          const diamondResponse = await axios.get(
            `/api/offers/?contract=${neededContract}&diamondRangeIndex=${neededTokenOffer}`
          );
          setDataFromOneOffers(diamondResponse);
          setOfferPrice(diamondResponse.data.data.doc?.map((p) => p.price));
          setOffer(diamondResponse.data.data.doc[0]);
          setNeededProduct(diamondResponse.data.data.doc[0].product);
          return diamondResponse;
        case false:
          // eslint-disable-next-line no-case-declarations
          const classicResponse = await axios.get(
            `/api/offers/?contract=${neededContract}&offerPool=${ifClassicContract}&offerIndex=${product}`
          );
          setDataFromOneOffers(classicResponse);
          setOfferPrice(classicResponse.data.data.doc?.map((p) => p.price));
          setOffer(classicResponse.data.data.doc[0]);
          setNeededProduct(classicResponse.data.data.doc[0].product);
          break;
      }
    },
    [ifClassicContract, neededContract, neededTokenOffer, product]
  );

  const getAllTokensData = useCallback(
    async (fromToken: number, toToken: number) => {
      let responseAllProduct;

      if (token && neededBlockchain && contractOfProduct && neededProduct) {
        responseAllProduct = await axios.get<TNftItemResponse>(
          `/api/nft/network/${neededBlockchain}/${contractOfProduct}/${neededProduct}?fromToken=${fromToken}&toToken=${toToken}`
        );

        const { success, result } = responseAllProduct.data;
        const tokenMapping = {};

        if (success) {
          result.tokens.forEach((item) => {
            tokenMapping[item.token] = item;
          });
          dispatch(setTokenData(tokenMapping));
          setTotalCount(result.totalCount);
        }
      }
    },

    [token, neededBlockchain, contractOfProduct, neededProduct, dispatch]
  );

  const getListTokensData = useCallback(async () => {
    if (neededContract) {
      try {
        const response = await axios.get(
          `/api/tokens/?contract=${neededContract}`
        );
        const { success, tokens } = response.data;
        if (success) {
          setDataFromListTokens(tokens);
        }
      } catch (err) {
        const error = err as AxiosError;
        Swal.fire('Error', `${error.message}`, 'error');
      }
    } else return null;
  }, [neededContract]);

  const getProductsFromOffer = useCallback(async () => {
    if (neededBlockchain && contractOfProduct) {
      const response = await axios.get<TNftFilesResponse>(
        `/api/nft/network/${neededBlockchain}/${contractOfProduct}/${neededTokenOffer}/files`
      );
      setProductsFromOffer(response.data.files);
      setDataForUser(response.data.files[0]?.authorPublicAddress);
    }
  }, [neededBlockchain, contractOfProduct, neededTokenOffer]);

  const getListOfTokens = useCallback(async () => {
    if (currentUserAddress) {
      const response = await axios.get(`/api/tokens/tokenNumbers`, {
        params: {
          product: neededProduct,
          networkId: neededBlockchain,
          contractAddress: contractOfProduct,
          contract: neededContract
        },
        headers: {
          Accept: 'application/json'
        }
      });
      const { success, tokens } = response.data;

      if (success) {
        const lastElem = tokens[tokens.length - 1];
        setLastToken(Number(lastElem));
        setShowToken(lastToken);
      }
    }
  }, [
    contractOfProduct,
    lastToken,
    neededBlockchain,
    neededContract,
    neededProduct,
    currentUserAddress
  ]);

  const handleTokenBoughtButton = () => {
    setTokenBought((prev) => !prev);
  };

  const handleClickToken = async (token: string | undefined) => {
    navigate(
      `/tokens/${neededBlockchain}/${contractOfProduct}/${product}/${token}`
    );
    token && setSelectedData(dataFromListTokens[token]?.metadata);
    setSelectedToken(token);
  };

  const getInfoFromUser = useCallback(async () => {
    if (
      dataForUser &&
      utils.isAddress(dataForUser) &&
      dataForUser !== constants.AddressZero
    ) {
      const result = await axios
        .get<TUserResponse>(`/api/users/${dataForUser}`)
        .then((res) => res.data);
      setSomeUsersData(result.user);
    }
  }, [dataForUser]);

  useEffect(() => {
    dispatch(setTokenDataStart());
  }, [dispatch]);

  useEffect(() => {
    getAllTokensData(0, showToken);
  }, [getAllTokensData, showToken]);

  useEffect(() => {
    getData();
    getContractInfo();
    getOfferInfo(typeOfContract);
  }, [getData, getContractInfo, getOfferInfo, typeOfContract]);

  useEffect(() => {
    getListOfTokens();
  }, [getListOfTokens]);

  useEffect(() => {
    getListTokensData();
  }, [getListTokensData]);

  useEffect(() => {
    getInfoFromUser();
  }, [getInfoFromUser]);

  useEffect(() => {
    getProductsFromOffer();
  }, [getProductsFromOffer]);

  return (
    <NftDataPageMain
      blockchain={neededBlockchain}
      contract={contractOfProduct}
      handleClickToken={handleClickToken}
      offerPrice={offerPrice}
      offerDataInfo={offer.length > 0 && offer}
      offerData={offer.length > 0 && offer}
      totalCount={totalCount}
      textColor={textColor}
      selectedData={selectedData}
      selectedToken={selectedToken}
      someUsersData={someUsersData}
      setSelectedToken={setSelectedToken}
      productsFromOffer={productsFromOffer}
      product={product}
      handleTokenBoughtButton={handleTokenBoughtButton}
    />
  );
};

export default NftDataExternalLink;
