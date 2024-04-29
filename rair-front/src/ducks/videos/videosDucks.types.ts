import {
  getListVideosError,
  getListVideosStart,
  getVideoListComplete,
  getVideoListTotal,
  getVideoListTotalClear,
  setLoading
} from './actions';

import { MediaListResponseType } from '../../components/video/video.types';

export type TVideosInitialState = {
  videos: MediaListResponseType | null;
  error: string | null;
  loading: boolean;
  totalNumberVideo: number | undefined;
};

export type TUpdataVideoParams = {
  itemsPerPage: number;
  pageNum: number;
  category: string;
  blockchain: string;
  publicAddress?: string;
  mediaTitle?: string;
};

export type TGetListVideosStart = ReturnType<typeof getListVideosStart>;
export type TGetVideoListComplete = ReturnType<typeof getVideoListComplete>;
export type TGetListVideosTotalClear = ReturnType<
  typeof getVideoListTotalClear
>;
export type TetListVideosTotal = ReturnType<typeof getVideoListTotal>;
export type TGetListVideosError = ReturnType<typeof getListVideosError>;
export type TSetLoading = ReturnType<typeof setLoading>;

export type TVideosActions =
  | TGetListVideosStart
  | TGetVideoListComplete
  | TGetListVideosError
  | TGetListVideosTotalClear
  | TetListVideosTotal
  | TSetLoading;
