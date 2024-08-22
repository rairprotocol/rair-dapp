import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { Hex } from 'viem';

import { dataStatuses } from './commonTypes';

import { ApiCallResponse, PaginatedApiCall } from '../types/commonTypes';
import { MediaFile, Offer } from '../types/databaseTypes';

interface VideoQueryResponse extends ApiCallResponse {
  list: Array<CatalogVideoItem>;
  totalNumber: number;
}

interface VideoQueryParams extends Partial<PaginatedApiCall> {
  blockchain?: Hex;
  category?: Array<string>;
  publicAddress?: Hex;
  mediaTitle?: string;
}

export interface CatalogVideoItem extends MediaFile {
  isUnlocked: boolean;
  unlockData: { offers: Array<Offer> };
}

interface VideoState {
  videoListStatus: dataStatuses;
  videos: Array<CatalogVideoItem>;
  totalVideos: number;
}

const initialState: VideoState = {
  videoListStatus: dataStatuses.Uninitialized,
  videos: [],
  totalVideos: 0
};

export const loadVideoList = createAsyncThunk(
  'video/loadVideoList',
  async (searchParams: VideoQueryParams) => {
    const queryParams = new URLSearchParams();
    Object.keys(searchParams).forEach((paramName) => {
      const value = searchParams[paramName];
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((internalValue) => {
            queryParams.append(`${paramName}[]`, internalValue);
          });
        }
        queryParams.append(paramName, value.toString());
      }
    });
    const response = await axios.get<VideoQueryResponse>(
      `/api/files/list?${queryParams.toString()}`
    );
    return response.data;
  }
);

export const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadVideoList.pending, (state) => {
        state.videoListStatus = dataStatuses.Loading;
      })
      .addCase(
        loadVideoList.fulfilled,
        (state, action: PayloadAction<VideoQueryResponse>) => {
          state.videoListStatus = dataStatuses.Complete;
          state.totalVideos = action.payload.totalNumber;
          state.videos = action.payload.list;
        }
      )
      .addCase(loadVideoList.rejected, (state) => {
        state.videoListStatus = dataStatuses.Failed;
      });
  }
});

export default videoSlice.reducer;
