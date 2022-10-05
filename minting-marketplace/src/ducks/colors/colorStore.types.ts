import { setColorScheme } from './actions';

export type ColorChoice = 'charcoal' | 'rhyno';
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

export type ColorStoreType = {
  primaryColor: ColorChoice;
  secondaryColor: ColorChoice;
  headerLogo: string;
  headerLogoMobile: string;
  textColor: string | undefined;
  backgroundImage: string;
  backgroundImageEffect: {
    backgroundBlendMode: BackgroundBlendModeType | undefined;
  };
};

export type SchemaType = {
  [key: string]: ColorStoreType;
};

export type SetColorSchemeType = ReturnType<typeof setColorScheme>;

export type ColorStoreActionsType = SetColorSchemeType;
