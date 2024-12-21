import type { Action, ThunkAction } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';

import colorSlice from './colorSlice';
import notificationsSlice from './notificationsSlice';
import searchbarSlice from './searchbarSlice';
import seoSlice from './seoSlice';
import settingsSlice from './settingsSlice';
import tokenSlice from './tokenSlice';
import userSlice from './userSlice';
import videoSlice from './videoSlice';
import web3Slice from './web3Slice';

export const store = configureStore({
  reducer: {
    settings: settingsSlice,
    colors: colorSlice,
    tokens: tokenSlice,
    web3: web3Slice,
    seo: seoSlice,
    user: userSlice,
    videos: videoSlice,
    searchbar: searchbarSlice,
    notifications: notificationsSlice
  }
});

// Infer the type of `store`
export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore['dispatch'];
// Define a reusable type describing thunk functions
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
