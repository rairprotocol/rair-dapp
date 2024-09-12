import { UploadMediaFile } from '../../../types/commonTypes';
import { MediaFile } from '../../../types/databaseTypes';

export interface IMediaItemChange {
  item: MediaFile;
  setMediaList: (arg: UploadMediaFile[]) => void;
  index: number;
  mediaList: UploadMediaFile[];
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
  item: UploadMediaFile;
  newUserStatus: boolean;
  selectCommonInfo: any;
  deleter: (index: number) => void;
  rerender?: () => void;
}

export interface IUploadedListBox {
  fileData: any;
  index: number;
  setMediaList: (arg: UploadMediaFile[]) => void;
  mediaList: UploadMediaFile[];
  uploadSuccess: boolean | null;
  getMediaList: () => void;
  setUploadSuccess: (arg: boolean | null) => void;
  setMediaUploadedList: (arg: any) => void;
  address?: string;
  collectionIndex?: string;
}
export interface IAnalyticsPopUp {
  index: number;
  setMediaList: (arg: UploadMediaFile[]) => void;
  mediaList: UploadMediaFile[];
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
  setMediaList: (arg: UploadMediaFile[]) => void;
  mediaList: UploadMediaFile[];
  index: number;
}
