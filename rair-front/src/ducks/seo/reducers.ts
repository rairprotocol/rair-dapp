import { TInfoSeo, TSeoActionTypes } from './seo.types';
import * as types from './types';

import { LoadingDefaultFavicon } from '../../images';

export let InitialState: TInfoSeo;

// if (hotDropsVar === 'true') {
//   InitialState = {
//     title: 'HotDrops Technologies',
//     ogTitle: 'HotDrops Technologies',
//     twitterTitle: 'HotDrops Technologies',
//     contentName: 'author',
//     content: 'Digital Ownership Encryption',
//     description:
//       'HotDrops is a Blockchain-based digital rights management platform that uses NFTs to gate access to streaming content',
//     ogDescription: 'Encrypted, Streaming NFTs',
//     twitterDescription: 'Encrypted, Streaming NFTs',
//     image: 'https://hotdrops.live/static/media/hotdrops-default.e7c4e7eb.png',
//     favicon: LoadingDefaultFavicon,
//     faviconMobile: LoadingDefaultFavicon
//   };
// } else {
  InitialState = {
    title: import.meta.env.VITE_HTML_META_TITLE,
    ogTitle: import.meta.env.VITE_HTML_META_TITLE,
    twitterTitle: import.meta.env.VITE_HTML_META_TITLE,
    contentName: 'author',
    content: import.meta.env.VITE_HTML_META_AUTHOR,
    description: import.meta.env.VITE_HTML_META_DESCRIPTION,
    twitterDescription: import.meta.env.VITE_HTML_META_DESCRIPTION,
    image: `${
      import.meta.env.VITE_IPFS_GATEWAY
    }/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW`,
    favicon: LoadingDefaultFavicon,
    faviconMobile: LoadingDefaultFavicon
  };
// }

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
