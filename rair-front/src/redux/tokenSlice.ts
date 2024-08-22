import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { Hex } from 'viem';

import { dataStatuses } from './commonTypes';

import { TTokenData } from '../axios.responseTypes';
import { PaginatedApiCall } from '../types/commonTypes';
import {
  Contract,
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
}

interface GetCollectionResponse {
  tokens: Array<TTokenData>;
  success: boolean;
  totalNumber: number;
}

interface CatalogQuery extends PaginatedApiCall {
  blockchain?: Hex;
  category?: string;
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

export interface TokensState {
  catalogStatus: dataStatuses;
  catalogTotal: number;
  catalog: Array<CatalogItem>;
  currentCollectionStatus: dataStatuses;
  currentCollectionTotal: number;
  currentCollection: { [index: string]: TTokenData };
  itemsPerPage: number;
  currentPage: number;
}

const initialState: TokensState = {
  catalogStatus: dataStatuses.Uninitialized,
  catalogTotal: 0,
  catalog: [],
  currentCollectionStatus: dataStatuses.Uninitialized,
  currentCollectionTotal: 0,
  currentCollection: {},
  itemsPerPage: 20,
  currentPage: 1
};

export const loadFrontPageCatalog = createAsyncThunk(
  'tokens/loadCatalog',
  async ({
    itemsPerPage,
    pageNum,
    blockchain,
    category,
    contractTitle
  }: CatalogQuery) => {
    const queryParams = new URLSearchParams({
      itemsPerPage: itemsPerPage.toString(),
      pageNum: pageNum.toString()
    });
    if (blockchain) {
      queryParams.append('blockchain', blockchain);
    }
    if (category) {
      queryParams.append('category', category);
    }
    if (contractTitle) {
      queryParams.append('contractTitle', contractTitle);
    }
    const response = await axios.get<GetCatalogResponse>(
      `/api/contracts/full?${queryParams.toString()}`
    );
    return { ...response.data, pageNumber: pageNum };
  }
);

export const loadCollection = createAsyncThunk(
  'tokens/loadCollection',
  async ({
    blockchain,
    contract,
    product,
    fromToken,
    toToken,
    attributes
  }: CollectionQuery) => {
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
          return {
            ...state,
            catalogStatus: dataStatuses.Complete,
            catalogTotal: action.payload.totalNumber,
            catalog: action.payload.contracts
          };
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
          const tokenMapping: { [index: string]: TTokenData } = {};
          action.payload.tokens.forEach((token) => {
            tokenMapping[token.uniqueIndexInContract.toString()] = token;
          });
          return {
            ...state,
            currentCollectionStatus: dataStatuses.Complete,
            currentCollectionTotal: action.payload.totalNumber,
            currentCollection: tokenMapping
          };
        }
      )
      .addCase(loadCollection.rejected, (state) => {
        state.currentCollectionStatus = dataStatuses.Failed;
      });
  }
});

//export const { updateSetting } = settingsSlice.actions;
export default tokenSlice.reducer;
