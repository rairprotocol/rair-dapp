import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { Hex } from 'viem';

import { dataStatuses } from './commonTypes';

import {
  SingleContractResponse,
  SingleTokenResponse
} from '../types/apiResponseTypes';
import { PaginatedApiCall } from '../types/commonTypes';
import {
  Contract,
  MintedToken,
  Offer,
  Product,
  TokenMetadata,
  User
} from '../types/databaseTypes';

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

interface GetCollectionResponse {
  tokens: Array<CollectionTokens>;
  success: boolean;
  totalNumber: number;
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

export interface CollectionTokens extends Omit<MintedToken, 'offer'> {
  ownerData?: User;
  offer: Offer;
}

export interface TokensState {
  catalogStatus: dataStatuses;
  catalogTotal: number;
  catalog: Array<CatalogItem>;
  currentCollectionStatus: dataStatuses;
  currentCollectionTotal: number;
  currentCollection: { [index: string]: CollectionTokens };
  currentCollectionMetadata?: Contract;
  currentCollectionMetadataStatus: dataStatuses;
  itemsPerPage: number;
  currentPage: number;
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
  // Collection contract data
  currentCollectionMetadataStatus: dataStatuses.Uninitialized,
  currentCollectionMetadata: undefined,
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
  async ({ contractId }: { contractId?: string }) => {
    if (!contractId) {
      return;
    }
    const contractData = await axios.get<SingleContractResponse>(
      `/api/contracts/${contractId}`
    );
    return contractData.data.contract;
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
    const response = await axios.get<GetCollectionResponse>(
      `/api/nft/network/${blockchain}/${contract}/${product}?${queryParams.toString()}`
    );
    dispatch(
      loadCollectionMetadata({
        contractId: response.data.tokens.at(0)?.contract
      })
    );

    return response.data;

    /*
            const resaleData = await rFetch(
        `/api/resales/open?contract=${contract}&blockchain=${blockchain}`
      );
      const resaleMapping = {};
      if (resaleData.success) {
        resaleData.data.forEach((resale) => {
          resale.price = formatEther(resale.price);
          resaleMapping[resale.tokenIndex] = resale;
        });
      }
    */
  }
);

export const tokenSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {},
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
          state.currentCollectionTotal = action.payload.totalNumber;
          state.currentCollection = tokenMapping;
        }
      )
      .addCase(loadCollection.rejected, (state) => {
        state.currentCollectionStatus = dataStatuses.Failed;
      })
      .addCase(loadCollectionMetadata.pending, (state) => {
        state.currentCollectionMetadataStatus = dataStatuses.Loading;
      })
      .addCase(
        loadCollectionMetadata.fulfilled,
        (state, action: PayloadAction<Contract | undefined>) => {
          state.currentCollectionMetadataStatus = dataStatuses.Complete;
          if (action.payload) {
            state.currentCollectionMetadata = action.payload;
          }
        }
      )
      .addCase(loadCollectionMetadata.rejected, (state) => {
        state.currentCollectionMetadataStatus = dataStatuses.Failed;
      })
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
      );
  }
});

//export const { updateSetting } = settingsSlice.actions;
export default tokenSlice.reducer;
