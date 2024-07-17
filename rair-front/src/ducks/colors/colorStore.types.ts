import {
  setColorScheme,
  setCustomColors,
  setCustomLogosDark,
  setCustomLogosLight
} from './actions';

export type BackgroundBlendModeType =
  | 'difference'
  | 'exclusion'
  | 'soft-light'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity'
  | 'hard-light'
  | 'color-burn'
  | 'color-dodge'
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten';

export type ColorSchemaType = {
  primaryColor: string;
  secondaryColor: string;
  headerLogo: string;
  headerLogoMobile: string;
  textColor: string;
  backgroundImage: string;
  backgroundImageEffect: {
    backgroundBlendMode: BackgroundBlendModeType | undefined;
  };
  iconColor: string;
};
export type ColorStoreType = ColorSchemaType & {
  primaryButtonColor: string;
  secondaryButtonColor: string;
};

export type SchemaType = {
  [key: string]: ColorSchemaType;
};

export type SetColorSchemeType = ReturnType<typeof setColorScheme>;
export type SetCustomColorsType = ReturnType<typeof setCustomColors>;
export type SetCustomLogosDarkType = ReturnType<typeof setCustomLogosDark>;
export type SetCustomLogosLightType = ReturnType<typeof setCustomLogosLight>;

export type ColorStoreActionsType =
  | SetColorSchemeType
  | SetCustomColorsType
  | SetCustomLogosDarkType
  | SetCustomLogosLightType;
