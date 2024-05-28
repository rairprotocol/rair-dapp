// import { MediaListResponseType } from '../../components/video/video.types';
import {
  getListResalesError,
  getListResalesStart,
  getResalesListComplete,
  getResalesListTotal,
  getResalesListTotalClear,
  refreshAction
} from './actions';

export type TResalesInitialState = {
  resales: any | null;
  error: string | null;
  refresh: boolean;
  loading: boolean;
  totalNumberResales: number | null;
};

export type TGetListResalesStart = ReturnType<typeof getListResalesStart>;
export type TGetResaleListComplete = ReturnType<typeof getResalesListComplete>;
export type TRefreshAction = ReturnType<typeof refreshAction>;
export type TGetListResalesTotalClear = ReturnType<
  typeof getResalesListTotalClear
>;
export type TetListResalesTotal = ReturnType<typeof getResalesListTotal>;
export type TGetListResalesError = ReturnType<typeof getListResalesError>;

export type TResalesActions =
  | TGetListResalesStart
  | TGetResaleListComplete
  | TRefreshAction
  | TGetListResalesTotalClear
  | TetListResalesTotal
  | TGetListResalesError;
