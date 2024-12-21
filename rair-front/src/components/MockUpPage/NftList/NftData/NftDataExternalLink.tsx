//@ts-nocheck
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { isAddress, ZeroAddress } from "ethers";
import { Hex } from "viem";

import NftDataPageMain from "./NftDataPageMain";

import {
  TMetadataType,
  // TNFTDataExternalLinkContractProduct,
  TNftFilesResponse,
  // TTokenData,
  TUserResponse,
} from "../../../../axios.responseTypes";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../hooks/useReduxHooks";
import useSwal from "../../../../hooks/useSwal";
import { loadCollection } from "../../../../redux/tokenSlice";
import { CatalogVideoItem } from "../../../../types/commonTypes";
import { User } from "../../../../types/databaseTypes";
import { TOfferType } from "../../../marketplace/marketplace.types";
// import { TNftExternalLinkType } from '../nftList.types';

const NftDataExternalLink = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const { contractId, product, token } = params;

  const { currentUserAddress } = useAppSelector((store) => store.web3);

  const [dataForUser, setDataForUser] = useState<Hex | undefined>();
  const [offer, setOffer] = useState<TOfferType[]>([]);
  const [offerPrice, setOfferPrice] = useState<string[]>();
  const [selectedData, setSelectedData] = useState<TMetadataType>();
  const [selectedToken, setSelectedToken] = useState<string>();
  const [neededBlockchain, setNeededBlockchain] = useState<Hex | undefined>();
  const [productsFromOffer, setProductsFromOffer] = useState<
    CatalogVideoItem[]
  >([]);
  const [someUsersData, setSomeUsersData] = useState<User | null>(null);
  const [typeOfContract, setTypeOfContract] = useState();
  const [neededContract, setNeededContract] = useState();
  const [neededTokenOffer, setNeededTokenOffer] = useState();
  const [contractOfProduct, setContractOfProduct] = useState<Hex | undefined>();
  const [neededProduct, setNeededProduct] = useState<string>("");
  const [lastToken, setLastToken] = useState<number>(0);
  const [showToken, setShowToken] = useState<number>(15);

  const [ifClassicContract, setIfClassicContract] = useState();

  const rSwal = useSwal();

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
          setSelectedData(data.doc?.metadata);
          setSelectedToken(token);
          if (data.doc.offerPool) {
            setIfClassicContract(data.doc.offerPool);
          }
        }
      } catch (err) {
        const error = err as AxiosError;
        rSwal.fire("Error", `${error.message}`, "error");
      }
    } else return null;
  }, [contractId, product, token, rSwal]);

  const getContractInfo = useCallback(async () => {
    if (neededContract) {
      try {
        const response = await axios.get(`/api/contracts/${neededContract}`);
        const { success, contract } = response.data;
        if (success) {
          setTypeOfContract(contract.diamond);
          setNeededBlockchain(contract.blockchain);
          setContractOfProduct(contract.contractAddress);
        }
      } catch (err) {
        const error = err as AxiosError;
        rSwal.fire("Error", `${error.message}`, "error");
      }
    } else return null;
  }, [neededContract, rSwal]);

  const getOfferInfo = useCallback(
    async (typeOfContract) => {
      switch (typeOfContract) {
        case true:
          // eslint-disable-next-line no-case-declarations
          const diamondResponse = await axios.get<any>(
            `/api/offers/?contract=${neededContract}&diamondRangeIndex=${neededTokenOffer}`
          );
          setOfferPrice(diamondResponse.data.data.doc?.map((p) => p.price));
          setOffer(diamondResponse.data.data.doc[0]);
          setNeededProduct(diamondResponse.data.data.doc[0].product);
          return diamondResponse;
        case false:
          // eslint-disable-next-line no-case-declarations
          const classicResponse = await axios.get(
            `/api/offers/?contract=${neededContract}&offerPool=${ifClassicContract}&offerIndex=${product}`
          );
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
      if (neededBlockchain && contractOfProduct && neededProduct !== "") {
        dispatch(
          loadCollection({
            blockchain: neededBlockchain,
            contract: contractOfProduct,
            product: neededProduct,
            fromToken: fromToken.toString(),
            toToken: toToken.toString(),
          })
        );
      }
    },
    [neededBlockchain, contractOfProduct, neededProduct, dispatch]
  );

  const getProductsFromOffer = useCallback(async () => {
    if (neededBlockchain && contractOfProduct) {
      const response = await axios.get<TNftFilesResponse>(
        `/api/nft/network/${neededBlockchain}/${contractOfProduct}/${neededTokenOffer}/files`
      );
      setProductsFromOffer(response.data.files);
      setDataForUser(response.data.files[0]?.uploader);
    }
  }, [neededBlockchain, contractOfProduct, neededTokenOffer]);

  const getListOfTokens = useCallback(async () => {
    if (currentUserAddress) {
      const response = await axios.get(`/api/tokens/tokenNumbers`, {
        params: {
          product: neededProduct,
          networkId: neededBlockchain,
          contractAddress: contractOfProduct,
          contract: neededContract,
        },
        headers: {
          Accept: "application/json",
        },
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
    currentUserAddress,
  ]);

  const handleClickToken = async (token: string | undefined) => {
    navigate(
      `/tokens/${neededBlockchain}/${contractOfProduct}/${product}/${token}`
    );
    //token && setSelectedData(dataFromListTokens[token]?.metadata);
    //setSelectedToken(token);
  };

  const getInfoFromUser = useCallback(async () => {
    if (dataForUser && isAddress(dataForUser) && dataForUser !== ZeroAddress) {
      const result = await axios
        .get<TUserResponse>(`/api/users/${dataForUser}`)
        .then((res) => res.data);
      setSomeUsersData(result.user);
    }
  }, [dataForUser]);

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
      offerDataInfo={offer}
      offerData={offer[0]}
      selectedData={selectedData}
      selectedToken={selectedToken}
      someUsersData={someUsersData}
      setSelectedToken={setSelectedToken}
      productsFromOffer={productsFromOffer}
      product={product}
    />
  );
};

export default NftDataExternalLink;
