import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { dataStatuses } from './commonTypes';

import { ApiCallResponse } from '../types/commonTypes';
import { MintedToken, Product, User } from '../types/databaseTypes';

interface SearchResults {
  users?: Array<User>;
  products?: Array<Product>;
  tokens?: Array<MintedToken>;
}

interface SearchbarResponse extends ApiCallResponse {
  data: SearchResults;
}

interface SearchBarParam {
  searchTerm: string;
}

export const startSearch = createAsyncThunk(
  'searchbar/startSearch',
  async ({ searchTerm }: SearchBarParam) => {
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const response = await axios.get<SearchbarResponse>(
      `/api/search/${encodedSearchTerm}`
    );
    return response.data;
  }
);

interface SearchbarState {
  searchStatus: dataStatuses;
  searchResults: SearchResults;
}

const initialState: SearchbarState = {
  searchStatus: dataStatuses.Uninitialized,
  searchResults: {}
};

export const searchbarSlice = createSlice({
  name: 'searchbar',
  initialState,
  reducers: {
    clearResults: (state) => {
      state.searchResults = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(startSearch.pending, (state) => {
        state.searchStatus = dataStatuses.Loading;
      })
      .addCase(
        startSearch.fulfilled,
        (state, action: PayloadAction<SearchbarResponse>) => {
          state.searchStatus = dataStatuses.Complete;
          state.searchResults = action.payload.data;
        }
      )
      .addCase(startSearch.rejected, (state) => {
        state.searchStatus = dataStatuses.Failed;
      });
  }
});

export const { clearResults } = searchbarSlice.actions;
export default searchbarSlice.reducer;
