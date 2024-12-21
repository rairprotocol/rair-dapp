//@ts-nocheck
import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import {
  setCustomColors,
  setDarkModeCustomLogos,
  setLightModeCustomLogos,
} from "./colorSlice";
import { dataStatuses } from "./commonTypes";

import { Blockchain, Category, ServerSettings } from "../types/databaseTypes";
import { rairSDK } from "../components/common/rairSDK";

interface CategoriesResponse {
  success: boolean;
  result: Array<Category>;
}
export interface SettingsState extends ServerSettings {
  dataStatus: dataStatuses;
  blockchainSettings: Array<Blockchain>;
  categoriesStatus: dataStatuses;
  categories: Array<Category>;
}

interface SettingsResponse {
  success: boolean;
  blockchainSettings: Array<Blockchain>;
  settings: ServerSettings;
}

const initialState: SettingsState = {
  dataStatus: dataStatuses.Uninitialized,
  onlyMintedTokensResult: false,
  demoUploadsEnabled: false,
  featuredCollection: undefined,
  nodeAddress: import.meta.env.VITE_NODE_ADDRESS,
  superAdmins: undefined,
  superAdminsOnVault: undefined,
  databaseResales: undefined,
  darkModePrimary: undefined,
  darkModeSecondary: undefined,
  darkModeText: undefined,
  darkModeBannerLogo: undefined,
  darkModeMobileLogo: undefined,
  lightModeBannerLogo: undefined,
  lightModeMobileLogo: undefined,
  buttonPrimaryColor: undefined,
  buttonFadeColor: undefined,
  buttonSecondaryColor: undefined,
  iconColor: undefined,
  footerLinks: undefined,
  legal: undefined,
  favicon: undefined,
  signupMessage: undefined,
  customValues: undefined,
  blockchainSettings: [],
  categoriesStatus: dataStatuses.Uninitialized,
  categories: [],
};

export const loadSettings = createAsyncThunk(
  "settings/loadSettings",
  async (_, { dispatch }) => {
    const response = await axios.get("/api/settings");
    dispatch(
      setCustomColors({
        ...response.data.settings,
      })
    );
    dispatch(
      setDarkModeCustomLogos({
        ...response.data.settings,
      })
    );
    dispatch(
      setLightModeCustomLogos({
        ...response.data.settings,
      })
    );
    return response.data;
  }
);

export const loadCategories = createAsyncThunk(
  "settings/loadCategories",
  async () => {
    const response = await rairSDK.categories.getCategories();
    return response;
  }
);

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadSettings.pending, (state) => {
        state.dataStatus = dataStatuses.Loading;
      })
      .addCase(
        loadSettings.fulfilled,
        (state, action: PayloadAction<SettingsResponse>) => {
          return {
            ...state,
            ...action.payload.settings,
            dataStatus: dataStatuses.Complete,
            blockchainSettings: action.payload.blockchainSettings,
          };
        }
      )
      .addCase(loadSettings.rejected, (state) => {
        state.dataStatus = dataStatuses.Failed;
      })
      .addCase(loadCategories.pending, (state) => {
        state.categoriesStatus = dataStatuses.Loading;
      })
      .addCase(
        loadCategories.fulfilled,
        (state, action: PayloadAction<CategoriesResponse>) => {
          return {
            ...state,
            categories: action.payload.result,
            categoriesStatus: dataStatuses.Complete,
          };
        }
      )
      .addCase(loadCategories.rejected, (state) => {
        state.categoriesStatus = dataStatuses.Failed;
      });
  },
});

//export const { updateSetting } = settingsSlice.actions;
export default settingsSlice.reducer;
