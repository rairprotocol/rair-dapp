import { ColorChoice } from "./../../ducks/colors/colorStore.types";
export interface IVideoPlayer {
  mediaId: number;
  mainManifest?: string;
  baseURL: string;
  setProcessDone?: (value: boolean) => void;
}

export type VideoPlayerParams = {
  videoId: string;
  mainManifest: string;
};

export interface IVideoList {
  mediaList?: MediaListResponseType;
  titleSearch: string;
  primaryColor?: ColorChoice;
  responseLabel?: string;
  endpoint?: string;
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
  };
};

export interface IVideoItem {
  mediaList: MediaListResponseType;
  item: string;
}
