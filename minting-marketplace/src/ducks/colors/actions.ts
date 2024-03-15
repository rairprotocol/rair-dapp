import * as types from './types';

export const setColorScheme = (colorScheme: string) =>
  ({ type: types.SET_COLOR_SCHEME, colorScheme }) as const;

export const setCustomColors = (value: {
  primary: string;
  secondary: string;
  text: string;
  primaryButton: string;
  fadeButton: string;
  secondaryButton: string;
}) => ({ type: types.SET_CUSTOM_COLORS, value }) as const;

export const setCustomLogosDark = (value: {
  desktop: string;
  mobile: string;
}) => ({ type: types.SET_CUSTOM_LOGOS_DARK, value }) as const;

export const setCustomLogosLight = (value: {
  desktop: string;
  mobile: string;
}) => ({ type: types.SET_CUSTOM_LOGOS_LIGHT, value }) as const;
