import { resetInfoSeo, setInfoSEO } from './actions';

export type TInfoSeo = {
  title?: string;
  ogTitle?: string;
  ogDescription?: string;
  contentName: string;
  content?: string;
  description?: string;
  favicon?: string;
  faviconMobile?: string;
  image?: string;
  twitterTitle?: string;
  twitterDescription?: string;
};

export type TSetInfoSeo = ReturnType<typeof setInfoSEO>;
export type TResetInfoSeo = ReturnType<typeof resetInfoSeo>;

export type TSeoActionTypes = TSetInfoSeo | TResetInfoSeo;
