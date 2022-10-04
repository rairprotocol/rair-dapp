import * as types from './types';

const setInfoSEO = (info) => ({
  type: types.SET_INFO_HELMET,
  title: info.title,
  ogTitle: info.ogTitle,
  ogDescription: info.ogDescription,
  contentName: info.contentName,
  content: info.content,
  description: info.description,
  favicon: info.favicon,
  faviconMobile: info.faviconMobile,
  image: info.image,
  twitterTitle: info.twitterTitle,
  twitterDescription: info.twitterDescription
});

const resetInfoSeo = () => ({
  type: types.SET_INFO_HELMET,
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
});

export { resetInfoSeo, setInfoSEO };
