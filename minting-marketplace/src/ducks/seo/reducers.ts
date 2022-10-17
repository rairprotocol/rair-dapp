import { TInfoSeo, TSeoActionTypes } from './seo.types';
import * as types from './types';

import RairFavicon from '../../components/MockUpPage/assets/rair_favicon.ico';

export const InitialState: TInfoSeo = {
  title: 'RAIR Technologies',
  ogTitle: 'RAIR Technologies',
  twitterTitle: 'RAIR Technologies',
  contentName: 'author',
  content: 'Digital Ownership Encryption',
  description:
    'RAIR is a Blockchain-based digital rights management platform that uses NFTs to gate access to streaming content',
  ogDescription: 'Encrypted, Streaming NFTs',
  twitterDescription: 'Encrypted, Streaming NFTs',
  image:
    'https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW',
  favicon: RairFavicon,
  faviconMobile: RairFavicon
};

export default function seoStore(
  state: TInfoSeo = InitialState,
  action: TSeoActionTypes
): TInfoSeo {
  switch (action.type) {
    case types.SET_INFO_HELMET:
      return {
        ...state,
        title: action.info.title,
        ogTitle: action.info.ogTitle,
        ogDescription: action.info.ogDescription,
        contentName: action.info.contentName,
        content: action.info.content,
        description: action.info.description,
        favicon: action.info.favicon,
        faviconMobile: action.info.faviconMobile,
        image: action.info.image,
        twitterTitle: action.info.twitterTitle,
        twitterDescription: action.info.twitterDescription
      };
    case types.RESET_INFO_HELMET:
      return {
        ...state,
        title: '',
        ogTitle: '',
        ogDescription: '',
        contentName: '',
        content: '',
        description: '',
        favicon: '',
        faviconMobile: '',
        image: '',
        twitterTitle: '',
        twitterDescription: ''
      };

    default:
      return state;
  }
}
