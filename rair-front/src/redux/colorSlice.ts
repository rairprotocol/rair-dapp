import { headerLogoBlack, headerLogoWhite } from '../images';
import { bgLogoBlack, bgLogoWhite } from '../images';
import {
  headerLogoBlackMobile,
  headerLogoWhiteMobile,
  HotDropsLogo,
  HotDropsLogoLight,
  HotDropsLogoMobile,
} from '../images';
import evergreenLogo from '../images/logo.svg'

export const charcoal = '#222021';
export const rhyno = '#dedede';
export const bubblegum = '#e882d5';
export const royalPurple = '#725bdb';
export const arcticBlue = '#19a7f6';
export const hotdropsOrange = '#f95631';
export const black = '#000';
export const white = '#fff';
export const blue = 'linear-gradient(90deg, #063CA9 0%, #0052FF 100%)';

type CustomButtonColorData = Pick<
  ServerSettings,
  'buttonPrimaryColor' | 'buttonFadeColor' | 'buttonSecondaryColor'
>;
interface ButtonInfo {
  primaryButtonColor: string;
  secondaryButtonColor: string;
}

type DarkModeLogoInfo = Pick<
  ServerSettings,
  'darkModeBannerLogo' | 'darkModeMobileLogo'
>;

type LightModeLogoInfo = Pick<
  ServerSettings,
  'lightModeBannerLogo' | 'lightModeMobileLogo'
>;

type CustomColorData = Pick<
  ServerSettings,
  'darkModePrimary' | 'darkModeSecondary' | 'darkModeText' | 'iconColor'
>;

interface ColorInfo {
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  secondaryTextColor?: string;
  iconColor?: string;
  headerLogo: string;
  headerLogoMobile: string;
  backgroundImage: string;
  backgroundImageEffect: { backgroundBlendMode?: string };
}

interface ColorLibrary {
  [key: string]: ColorInfo;
}

export interface ColorState extends ColorInfo, ButtonInfo {
  isDarkMode: boolean;
}

const hotdropsVar = import.meta.env.VITE_TESTNET;

const logos = {
  light: {
    headerLogo: evergreenLogo,
    headerLogoMobile: evergreenLogo
  },
  dark: {
    headerLogo: evergreenLogo,
    headerLogoMobile: evergreenLogo
  }
};

import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { ServerSettings } from '../types/databaseTypes';

const buttons: ButtonInfo = {
  primaryButtonColor: `linear-gradient(to right, ${royalPurple}, ${bubblegum})`,
  secondaryButtonColor: `linear-gradient(to right, ${bubblegum}, ${royalPurple})`
};

const colorThemes: ColorLibrary = {
  light: {
    primaryColor: black,
    secondaryColor: blue,
    headerLogo: evergreenLogo,
    headerLogoMobile: headerLogoWhiteMobile,
    textColor: '#ffffff88',
    secondaryTextColor: '#fafafa',
    backgroundImage: bgLogoWhite,
    backgroundImageEffect: { backgroundBlendMode: 'lighten' },
    iconColor: bubblegum
  },
  dark: {
    primaryColor: black,
    secondaryColor: blue,
    headerLogo: evergreenLogo,
    headerLogoMobile: headerLogoWhiteMobile,
    textColor: '#ffffff88',
    secondaryTextColor: '#fafafa',
    backgroundImage: bgLogoWhite,
    backgroundImageEffect: { backgroundBlendMode: 'lighten' },
    iconColor: bubblegum
  },
  hotdrops: {
    primaryColor: '',
    secondaryColor: '',
    headerLogo: '',
    headerLogoMobile: '',
    textColor: '',
    secondaryTextColor: '#ffffff88',
    backgroundImage: '',
    backgroundImageEffect: {},
    iconColor: hotdropsOrange
  }
};

if (!Object.keys(colorThemes).includes(localStorage.colorScheme)) {
  localStorage.setItem('colorScheme', 'dark');
}

const initialState: ColorState = {
  isDarkMode: localStorage.colorScheme === 'dark',
  ...colorThemes[localStorage.colorScheme || 'dark'],
  ...buttons
};

export const colorSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setCustomColors: (
      state,
      action: PayloadAction<CustomColorData & CustomButtonColorData>
    ) => {
      const {
        darkModePrimary,
        darkModeSecondary,
        darkModeText,
        buttonFadeColor,
        buttonPrimaryColor,
        buttonSecondaryColor,
        iconColor
      } = action.payload;
      if (darkModePrimary) {
        colorThemes.dark.primaryColor = darkModePrimary;
      }
      if (darkModeSecondary) {
        colorThemes.dark.secondaryColor = darkModeSecondary;
      }
      if (darkModeText) {
        colorThemes.dark.textColor = darkModeText;
      }
      if (iconColor) {
        colorThemes.dark.iconColor = iconColor;
      }
      if (buttonPrimaryColor) {
        buttons.primaryButtonColor = buttonPrimaryColor;
        if (buttonFadeColor) {
          buttons.primaryButtonColor = `linear-gradient(to right, ${buttonFadeColor}, ${buttonPrimaryColor})`;
        }
      }
      if (buttonSecondaryColor) {
        buttons.secondaryButtonColor = buttonSecondaryColor;
        if (buttonFadeColor) {
          buttons.secondaryButtonColor = `linear-gradient(to right, ${buttonSecondaryColor}, ${buttonFadeColor})`;
        }
      }
      return {
        ...state,
        ...colorThemes[localStorage.colorScheme],
        ...logos[localStorage.colorScheme],
        ...buttons
      };
    },
    setColorScheme: (state, action: PayloadAction<string>) => {
      localStorage.setItem('colorScheme', action.payload);
      return {
        ...state,
        isDarkMode: action.payload === 'dark',
        ...colorThemes[localStorage.colorScheme],
        ...logos[action.payload],
        ...buttons
      };
    },
    setLightModeCustomLogos: (
      state,
      action: PayloadAction<Partial<LightModeLogoInfo>>
    ) => {
      if (action.payload.lightModeBannerLogo) {
        logos.light.headerLogo = action.payload.lightModeBannerLogo;
      }
      if (action.payload.lightModeMobileLogo) {
        logos.light.headerLogoMobile = action.payload.lightModeMobileLogo;
      }
      return {
        ...state,
        ...colorThemes[localStorage.colorScheme],
        ...logos[localStorage.colorScheme],
        ...buttons
      };
    },
    setDarkModeCustomLogos: (
      state,
      action: PayloadAction<Partial<DarkModeLogoInfo>>
    ) => {
      if (action.payload.darkModeBannerLogo) {
        logos.dark.headerLogo = action.payload.darkModeBannerLogo;
      }
      if (action.payload.darkModeMobileLogo) {
        logos.dark.headerLogoMobile = action.payload.darkModeMobileLogo;
      }
      return {
        ...state,
        ...colorThemes[localStorage.colorScheme],
        ...logos[localStorage.colorScheme],
        ...buttons
      };
    }
  }
});

export const {
  setCustomColors,
  setColorScheme,
  setLightModeCustomLogos,
  setDarkModeCustomLogos
} = colorSlice.actions;
export default colorSlice.reducer;
