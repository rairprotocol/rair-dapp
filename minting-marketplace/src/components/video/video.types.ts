import { TContract, TTokenData } from '../../axios.responseTypes';
export interface IVideoPlayer {
  mediaId: number;
  mainManifest?: string;
  baseURL: string;
  setProcessDone?: (value: boolean) => void;
}

export type VideoPlayerParams = {
  videoId: string;
  mainManifest: string;
  contract: string;
};

export type TParticularProduct = {
  contract: TContract;
  tokens: Array<TTokenData>;
  totalCount: number;
};
export interface IVideoList {
  titleSearch?: string;
  responseLabel?: string;
  endpoint?: string;
  loading?: boolean;
  videos?: MediaListResponseType | null;
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
    authorPublicAddress: string;
  };
};

export interface IVideoItem {
  mediaList: MediaListResponseType;
  item: string;
}
