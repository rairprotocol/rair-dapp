import { TInfoSeo } from './seo.types';
import * as types from './types';

export const setInfoSEO = (info: TInfoSeo) =>
  ({
    type: types.SET_INFO_HELMET,
    info
  }) as const;

export const resetInfoSeo = () =>
  ({
    type: types.RESET_INFO_HELMET
  }) as const;
