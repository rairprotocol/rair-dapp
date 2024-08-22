import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { dataStatuses } from './commonTypes';

import { User } from '../types/databaseTypes';

interface WithLoginData extends User {
  loginType?: string;
  adminRights?: boolean;
  superAdmin?: boolean;
}

interface UserDataResponse {
  user: WithLoginData;
  success: boolean;
}

interface UserState extends WithLoginData {
  loginStatus: dataStatuses;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  loginStatus: dataStatuses.Uninitialized,
  isLoggedIn: false,
  email: undefined,
  avatar: undefined,
  firstName: undefined,
  lastName: undefined,
  publicAddress: undefined,
  nickName: undefined,
  adminRights: undefined,
  superAdmin: undefined,
  ageVerified: undefined,
  loginType: undefined
};

export const loadCurrentUser = createAsyncThunk(
  'user/loadCurrentUser',
  async () => {
    const response = await axios.get<UserDataResponse>('/api/auth/me');
    return response.data.user;
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCurrentUser.pending, (state) => {
        // eslint-disable-next-line no-console
        state.loginStatus = dataStatuses.Loading;
      })
      .addCase(
        loadCurrentUser.fulfilled,
        (state, action: PayloadAction<Partial<WithLoginData>>) => {
          state.loginStatus = dataStatuses.Complete;
          state.email = action.payload?.email;
          state.avatar = action.payload?.avatar;
          state.firstName = action.payload?.firstName;
          state.lastName = action.payload?.lastName;
          state.publicAddress = action.payload?.publicAddress;
          state.nickName = action.payload?.nickName;
          state.adminRights = action.payload?.adminRights;
          state.superAdmin = action.payload?.superAdmin;
          state.ageVerified = action.payload?.ageVerified;
          state.isLoggedIn = !!action.payload?.publicAddress;
          state.loginType = action.payload?.loginType;
        }
      )
      .addCase(loadCurrentUser.rejected, (state) => {
        state.loginStatus = dataStatuses.Failed;
      });
  }
});

//export const { setSEOInfo, resetSEOInfo } = userSlice.actions;
export default userSlice.reducer;
