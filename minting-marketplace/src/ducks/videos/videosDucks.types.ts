import { MediaListResponseType } from '../../components/video/video.types';
import {
  getListVideosError,
  getVideoListComplete,
  getListVideosStart,
  refreshAction
} from './actions';

export type TVideosInitialState = {
  videos: MediaListResponseType | null;
  error: string | null;
  refresh: boolean;
  loading: boolean;
};

export type TGetListVideosStart = ReturnType<typeof getListVideosStart>;
export type TGetVideoListComplete = ReturnType<typeof getVideoListComplete>;
export type TRefreshAction = ReturnType<typeof refreshAction>;
export type TGetListVideosError = ReturnType<typeof getListVideosError>;

export type TVideosActions =
  | TGetListVideosStart
  | TGetVideoListComplete
  | TRefreshAction
  | TGetListVideosError;
