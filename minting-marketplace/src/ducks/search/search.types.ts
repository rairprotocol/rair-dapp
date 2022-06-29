import { TTokenData } from './../../axios.responseTypes';
import { TProducts } from '../../axios.responseTypes';
import {
  getDataAllClear,
  getDataAllComplete,
  getDataAllEmpty,
  getDataAllStart
} from './actions';
import { UserType } from '../users/users.types';

export type TSearchInitialState = {
  titleSearchDemo: string;
  dataAll: TSearchDataObject | null;
  message: string;
  loading: boolean | null;
};

export type TSearchDataUser = Pick<UserType, 'avatar' | 'nickName' | '_id'>;
export type TSearchDataProduct = Pick<
  TProducts,
  'collectionIndexInContract' | 'contract' | '_id' | 'copies' | 'cover' | 'name'
>;
export type TSearchDataTokens = Pick<
  TTokenData,
  'contract' | 'uniqueIndexInContract' | '_id' | 'metadata'
>;

export type TSearchDataObject = {
  products: TSearchDataProduct[];
  tokens: TSearchDataTokens[];
  users: TSearchDataUser[];
};

export type TSearchDataResponseType = {
  success: boolean;
  data: TSearchDataObject;
};

export type TGetDataAllStart = ReturnType<typeof getDataAllStart>;
export type TGetDataAllComplete = ReturnType<typeof getDataAllComplete>;
export type TGetDataAllEmpty = ReturnType<typeof getDataAllEmpty>;
export type TGetDataAllClear = ReturnType<typeof getDataAllClear>;

export type TSeacrhActionsType =
  | TGetDataAllStart
  | TGetDataAllComplete
  | TGetDataAllEmpty
  | TGetDataAllClear;
