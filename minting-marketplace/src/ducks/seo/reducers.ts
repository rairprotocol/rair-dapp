import { TInfoSeo } from './seo.types';
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
  action
): TInfoSeo {
  switch (action.type) {
    case types.SET_INFO_HELMET:
      return {
        ...state,
        title: action.title,
        ogTitle: action.ogTitle,
        ogDescription: action.ogDescription,
        contentName: action.contentName,
        content: action.content,
        description: action.description,
        favicon: action.favicon,
        faviconMobile: action.faviconMobile,
        image: action.image,
        twitterTitle: action.twitterTitle,
        twitterDescription: action.twitterDescription
      };

    default:
      return state;
  }
}
