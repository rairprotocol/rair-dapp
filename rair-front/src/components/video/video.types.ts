import { TTokenData } from '../../axios.responseTypes';

import { ContractType } from './../adminViews/adminView.types';
export interface IVideoPlayer {
  mediaId?: string;
  mainManifest?: string;
  baseURL?: string;
  setProcessDone?: (value: boolean) => void;
}

export type VideoPlayerParams = {
  videoId: string;
  mainManifest: string;
  contract: string;
};

export type TVideoItemContractData = ContractType & {
  tokens: TTokenData[];
};
export interface IVideoList {
  titleSearch: string;
  responseLabel?: string;
  endpoint?: string;
  videos?: MediaListResponseType | null;
  handleVideoIsUnlocked?: () => void;
}

export type MediaListResponseType = {
  [key: string]: {
    offer: string[];
    demo: boolean;
    _id: string;
    uri: string;
    mainManifest: string;
    author: string;
    encryptionType: string;
    title: string;
    contract: string;
    product: string;
    category: string;
    staticThumbnail: string;
    animatedThumbnail: string;
    type: string;
    extension: string;
    duration: string;
    description: string;
    creationDate: string;
    isUnlocked: boolean;
    uploader: string;
    unlockData: any;
    ageRestricted: boolean | undefined;
  };
};

export interface IVideoItem {
  mediaList: MediaListResponseType;
  item: string;
  handleVideoIsUnlocked?: () => void;
}
