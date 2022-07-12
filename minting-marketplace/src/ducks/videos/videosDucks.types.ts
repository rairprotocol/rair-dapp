import { MediaListResponseType } from '../../components/video/video.types';
import {
  getListVideosError,
  getVideoListComplete,
  getListVideosStart,
  refreshAction,
  getVideoListTotalClear,
  getVideoListTotal
} from './actions';

export type TVideosInitialState = {
  videos: MediaListResponseType | null;
  error: string | null;
  refresh: boolean;
  loading: boolean;
  totalNumberVideo: number | null;
};

export type TGetListVideosStart = ReturnType<typeof getListVideosStart>;
export type TGetVideoListComplete = ReturnType<typeof getVideoListComplete>;
export type TRefreshAction = ReturnType<typeof refreshAction>;
export type TGetListVideosTotalClear = ReturnType<
  typeof getVideoListTotalClear
>;
export type TetListVideosTotal = ReturnType<typeof getVideoListTotal>;
export type TGetListVideosError = ReturnType<typeof getListVideosError>;

export type TVideosActions =
  | TGetListVideosStart
  | TGetVideoListComplete
  | TRefreshAction
  | TGetListVideosError
  | TGetListVideosTotalClear
  | TetListVideosTotal;
