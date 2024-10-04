import {
  Blockchain,
  Contract,
  MediaFile,
  MintedToken,
  Offer,
  ResaleData
} from './databaseTypes';

import { TChainItemData } from '../utils/utils.types';

export interface ApiCallResponse {
  success: boolean;
  message?: string;
}

export interface PaginatedApiCall {
  itemsPerPage?: number;
  pageNum?: number;
}

export interface CustomModalStyle {
  overlay: React.CSSProperties;
  content: React.CSSProperties;
}

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SplashPageProps {
  setIsSplashPage: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface UploadMediaFile {
  offer: string;
  category: string;
  title: string;
  file: File;
  description: string;
  preview: string;
  contractAddress: string;
  productIndex: string;
  storage: string;
  demo: boolean;
}

export interface CatalogVideoItem extends MediaFile {
  isUnlocked: boolean;
  unlockData: { offers: Array<Offer> };
}

export interface tokenNumberData {
  token: string;
  sold: boolean;
}

export interface CombinedBlockchainData extends Blockchain, TChainItemData {}

export interface NftItemToken extends Omit<MintedToken, 'contract'> {
  resaleData?: ResaleData;
  contract: Contract;
}
