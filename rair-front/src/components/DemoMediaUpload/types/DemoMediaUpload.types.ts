import { MediaFile } from '../../../types/databaseTypes';

export interface IMediaItemChange {
  item: MediaFile;
  setMediaList: (arg: MediaFile[]) => void;
  index: number;
  mediaList: MediaFile[];
  uploadSuccess: null | boolean;
  textFlag?: boolean;
  mediaId?: string;
  getMediaList: (() => void) | undefined;
  editTitleVideo: boolean;
  setEditTitleVideo: any;
  newUserStatus?: boolean;
  setUploadSuccess?: (arg: boolean | null) => void;
  beforeUpload?: boolean;
}

export interface IMediaListBox {
  index: number;
  item: MediaFile;
  newUserStatus: boolean;
  selectCommonInfo: any;
  deleter: (index: number) => void;
  rerender?: () => void;
}

export interface IUploadedListBox {
  fileData: any;
  index: number;
  setMediaList: (arg: MediaFile[]) => void;
  mediaList: MediaFile[];
  uploadSuccess: boolean | null;
  getMediaList: () => void;
  setUploadSuccess: (arg: boolean | null) => void;
  setMediaUploadedList: (arg: any) => void;
  address?: string;
  collectionIndex?: string;
}
export interface IAnalyticsPopUp {
  index: number;
  setMediaList: (arg: MediaFile[]) => void;
  mediaList: MediaFile[];
  setUploadSuccess: (arg: boolean | null) => void;
  titleOfContract?: any | undefined;
  selectCommonInfo?: any;
  fileData?: any;
  setMediaUploadedList?: (arg: any) => void;
  newUserStatus?: boolean;
  collectionIndex?: string;
  address?: string;
  rerender: () => void;
}
export interface IPopUpChangeVideo {
  modalIsOpen: boolean;
  closeModal: () => void;
  item: any;
  setUploadSuccess: (arg: boolean | null) => void;
  beforeUpload: boolean | undefined;
  setMediaList: (arg: MediaFile[]) => void;
  mediaList: MediaFile[];
  index: number;
}
