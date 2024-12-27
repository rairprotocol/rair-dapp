import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { Hex } from 'viem';

import { dataStatuses } from './commonTypes';

import {
  SingleContractResponse,
  SingleTokenResponse
} from '../types/apiResponseTypes';
import { ApiCallResponse, PaginatedApiCall } from '../types/commonTypes';
import {
  Contract,
  MintedToken,
  Offer,
  Product,
  ResaleData,
  TokenMetadata,
  User
} from '../types/databaseTypes';

interface FactoryResponseProduct extends ApiCallResponse {
  result: number;
  data?: {
    doc?: Array<Product>;
  };
}

interface MetadataForCollection {
  contract?: Contract;
  product?: Product;
}

interface ProductAndOffers extends Product {
  offers: Array<Offer>;
}

export interface CatalogItem extends Contract {
  product: ProductAndOffers;
  frontToken: {
    metadata: Pick<
      TokenMetadata,
      'image' | 'image_thumbnail' | 'animation_url'
    >;
  };
  userData?: User;
}

interface GetCatalogResponse {
  contracts: Array<CatalogItem>;
  success: boolean;
  totalNumber: number;
  pageNumber: number;
  itemsPerPage: number;
}

interface GetCollectionResponse extends ApiCallResponse {
  tokens: Array<CollectionTokens>;
  totalCount: number;
}

interface GetResaleResponse extends ApiCallResponse {
  data: Array<ResaleData>;
}

interface CatalogQuery extends PaginatedApiCall {
  blockchains?: Array<Hex>;
  categories?: Array<string>;
  contractTitle?: string;
}

interface CollectionQuery {
  blockchain: Hex;
  contract: Hex;
  product: string;
  fromToken: string;
  toToken: string;
  attributes?: { [name: string]: string };
}

export interface CollectionTokens
  extends Omit<MintedToken, 'offer' | 'contract'> {
  ownerData?: User;
  offer: Offer;
  resaleData?: ResaleData;
  contract: string;
}

export interface TokensState {
  catalogStatus: dataStatuses;
  catalogTotal: number;
  catalog: Array<CatalogItem>;
  currentCollectionStatus: dataStatuses;
  currentCollectionTotal: number;
  currentCollection: { [index: string]: CollectionTokens };
  currentCollectionNextPageStatus: boolean;
  currentCollectionMetadata: MetadataForCollection;
  currentCollectionMetadataStatus: dataStatuses;
  itemsPerPage: number;
  currentPage: number;
  currentCollectionParams?: CollectionQuery;
}

const initialState: TokensState = {
  // Front page catalog data
  catalogStatus: dataStatuses.Uninitialized,
  catalogTotal: 0,
  catalog: [],
  // Collection tokens data
  currentCollectionStatus: dataStatuses.Uninitialized,
  currentCollectionTotal: 0,
  currentCollection: {},
  currentCollectionNextPageStatus: false,
  currentCollectionParams: undefined,
  // Collection contract data
  currentCollectionMetadataStatus: dataStatuses.Uninitialized,
  currentCollectionMetadata: {},
  // Catalog search params
  itemsPerPage: 20,
  currentPage: 1
};

export const loadFrontPageCatalog = createAsyncThunk(
  'tokens/loadCatalog',
  async (
    {
      itemsPerPage,
      pageNum,
      blockchains,
      categories,
      contractTitle
    }: CatalogQuery,
    { getState }
  ) => {
    const { tokens } = getState() as { tokens: TokensState };
    const queryParams = new URLSearchParams({
      itemsPerPage: (itemsPerPage || tokens.itemsPerPage).toString(),
      pageNum: (pageNum || tokens.currentPage).toString()
    });
    if (blockchains) {
      blockchains.forEach((chain) => {
        queryParams.append('blockchain[]', chain);
      });
    }
    if (categories) {
      categories.forEach((category) => {
        queryParams.append('category[]', category);
      });
    }
    if (contractTitle) {
      queryParams.append('contractTitle', contractTitle);
    }
    const response = await axios.get<GetCatalogResponse>(
      `/api/contracts/full?${queryParams.toString()}`
    );
    return {
      ...response.data,
      pageNumber: pageNum || tokens.currentPage,
      itemsPerPage: itemsPerPage || tokens.itemsPerPage
    };
  }
);

export const loadCollectionMetadata = createAsyncThunk(
  'tokens/loadCollectionMetadata',
  async ({
    contractId,
    productId
  }: {
    contractId?: string;
    productId: string;
  }) => {
    if (!contractId) {
      return;
    }
    const contractData = await axios.get<SingleContractResponse>(
      `/api/contracts/${contractId}`
    );
    const queryParams = new URLSearchParams({
      contract: contractId,
      collectionIndexInContract: productId
    });
    const productData = await axios.get<FactoryResponseProduct>(
      `/api/products?${queryParams.toString()}`
    );
    return {
      contract: contractData.data.contract,
      product: productData.data.data?.doc?.[0]
    };
  }
);

export const reloadTokenData = createAsyncThunk(
  'tokens/reloadTokenData',
  async ({ tokenId }: { tokenId?: string }) => {
    if (!tokenId) {
      return;
    }
    const response = await axios.get<SingleTokenResponse>(
      `/api/tokens/id/${tokenId}`
    );
    return response.data.tokenData;
  }
);

export const loadCollection = createAsyncThunk(
  'tokens/loadCollection',
  async (
    {
      blockchain,
      contract,
      product,
      fromToken,
      toToken,
      attributes
    }: CollectionQuery,
    { dispatch }
  ) => {
    const queryParams = new URLSearchParams({
      fromToken: fromToken,
      toToken: toToken
    });
    if (attributes) {
      queryParams.append('metadataFilters', JSON.stringify(attributes));
    }
    dispatch(clearCollectionData());
    dispatch(
      setCollectionSearchParams({
        blockchain,
        contract,
        product,
        fromToken,
        toToken,
        attributes
      })
    );
    const response = await axios.get<GetCollectionResponse>(
      `/api/nft/network/${blockchain}/${contract}/${product}?${queryParams.toString()}`
    );
    dispatch(
      loadCollectionMetadata({
        contractId: response.data.tokens.at(0)?.contract,
        productId: product
      })
    );
    dispatch(
      loadResaleDataForCollection({
        contract,
        blockchain
      })
    );

    return response.data;
  }
);

export const loadResaleDataForCollection = createAsyncThunk(
  'tokens/loadResaleDataForCollection',
  async ({ contract, blockchain }: { contract: Hex; blockchain: Hex }) => {
    const resaleData = await axios.get<GetResaleResponse>(
      `/api/resales/open?contract=${contract}&blockchain=${blockchain}`
    );
    if (resaleData.data.success) {
      return resaleData.data.data;
    }
  }
);

export const loadNextCollectionPage = createAsyncThunk(
  'tokens/loadNextCollectionPage',
  async (_, { getState, dispatch }) => {
    const { tokens } = getState() as { tokens: TokensState };
    if (!tokens.currentCollectionParams) {
      return;
    }
    const lastTokenLoaded = Object.keys(tokens.currentCollection).at(-1);
    const { blockchain, contract, product, fromToken, toToken, attributes } =
      tokens.currentCollectionParams;
    const startingToken = BigInt(lastTokenLoaded || toToken) + BigInt(1);
    const queryParams = new URLSearchParams({
      fromToken: startingToken.toString(),
      toToken: (startingToken + BigInt(20)).toString()
    });
    if (attributes) {
      queryParams.append('metadataFilters', JSON.stringify(attributes));
    }
    const response = await axios.get<GetCollectionResponse>(
      `/api/nft/network/${blockchain}/${contract}/${product}?${queryParams.toString()}`
    );
    if (response.data.success) {
      dispatch(
        setCollectionSearchParams({
          blockchain,
          contract,
          product,
          fromToken,
          toToken: (startingToken + BigInt(20)).toString(),
          attributes
        })
      );
    }

    return response.data;
  }
);

export const tokenSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    setCollectionSearchParams: (state, action) => {
      state.currentCollectionParams = action.payload;
    },
    clearCollectionData: (state) => {
      state.currentCollectionStatus = dataStatuses.Uninitialized;
      state.currentCollectionTotal = 0;
      state.currentCollection = {};
      state.currentCollectionNextPageStatus = false;
      state.currentCollectionMetadataStatus = dataStatuses.Uninitialized;
      state.currentCollectionMetadata = {};
      state.currentCollectionParams = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      // Front page catalog
      .addCase(loadFrontPageCatalog.pending, (state) => {
        state.catalogStatus = dataStatuses.Loading;
      })
      .addCase(
        loadFrontPageCatalog.fulfilled,
        (state, action: PayloadAction<GetCatalogResponse>) => {
          state.catalogStatus = dataStatuses.Complete;
          state.catalogTotal = action.payload.totalNumber;
          state.catalog = action.payload.contracts;
          state.itemsPerPage = action.payload.itemsPerPage;
          state.currentPage = action.payload.pageNumber;
        }
      )
      .addCase(loadFrontPageCatalog.rejected, (state) => {
        state.catalogStatus = dataStatuses.Failed;
      })

      // Collection tokens
      .addCase(loadCollection.pending, (state) => {
        state.currentCollectionStatus = dataStatuses.Loading;
      })
      .addCase(
        loadCollection.fulfilled,
        (state, action: PayloadAction<GetCollectionResponse>) => {
          const tokenMapping: { [index: string]: CollectionTokens } = {};
          action.payload.tokens.forEach((token) => {
            tokenMapping[token.uniqueIndexInContract.toString()] = token;
          });
          state.currentCollectionStatus = dataStatuses.Complete;
          state.currentCollectionTotal = action.payload.totalCount;
          state.currentCollection = tokenMapping;
        }
      )
      .addCase(loadCollection.rejected, (state) => {
        state.currentCollectionStatus = dataStatuses.Failed;
      })

      // Reuse collection data for next page
      .addCase(loadNextCollectionPage.pending, (state) => {
        state.currentCollectionNextPageStatus = true;
      })

      .addCase(
        loadNextCollectionPage.fulfilled,
        (state, action: PayloadAction<GetCollectionResponse | undefined>) => {
          if (action?.payload?.tokens) {
            action.payload.tokens.forEach((token) => {
              state.currentCollection[token.uniqueIndexInContract.toString()] =
                token;
            });
            state.currentCollectionNextPageStatus = false;
          }
        }
      )

      .addCase(loadNextCollectionPage.rejected, (state) => {
        state.currentCollectionNextPageStatus = false;
      })

      // Load metadata for collection
      .addCase(loadCollectionMetadata.pending, (state) => {
        state.currentCollectionMetadataStatus = dataStatuses.Loading;
      })
      .addCase(
        loadCollectionMetadata.fulfilled,
        (state, action: PayloadAction<MetadataForCollection | undefined>) => {
          state.currentCollectionMetadataStatus = dataStatuses.Complete;
          if (action.payload) {
            state.currentCollectionMetadata = action.payload;
          } else {
            state.currentCollectionMetadata = {};
          }
        }
      )
      .addCase(loadCollectionMetadata.rejected, (state) => {
        state.currentCollectionMetadataStatus = dataStatuses.Failed;
      })

      // Reload data for single token
      .addCase(
        reloadTokenData.fulfilled,
        (state, action: PayloadAction<CollectionTokens | undefined>) => {
          if (
            action.payload &&
            state.currentCollection[action.payload.uniqueIndexInContract] &&
            state.currentCollection[action.payload.uniqueIndexInContract]
              ._id === action.payload._id
          ) {
            state.currentCollection[action.payload.uniqueIndexInContract] =
              action.payload;
          }
        }
      )

      // Load resale data for collection
      .addCase(
        loadResaleDataForCollection.fulfilled,
        (state, action: PayloadAction<Array<ResaleData> | undefined>) => {
          action.payload?.forEach((resale) => {
            if (state.currentCollection[resale.tokenIndex]) {
              state.currentCollection[resale.tokenIndex].resaleData = resale;
            }
          });
        }
      );
  }
});

export const { clearCollectionData, setCollectionSearchParams } =
  tokenSlice.actions;
export default tokenSlice.reducer;
