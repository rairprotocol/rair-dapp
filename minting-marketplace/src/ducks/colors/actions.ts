import { ColorChoice } from './colorStore.types';
import * as types from './types';

export const setColorScheme = (colorScheme: ColorChoice) =>
  ({ type: types.SET_COLOR_SCHEME, colorScheme } as const);
