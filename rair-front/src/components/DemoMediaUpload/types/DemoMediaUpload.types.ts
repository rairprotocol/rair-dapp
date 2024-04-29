import { TMediaType } from '../../creatorStudio/creatorStudio.types';

export interface IMediaItemChange {
  item: TMediaType;
  setMediaList: (arg: TMediaType[]) => void;
  index: number;
  mediaList: TMediaType[];
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
  item: TMediaType;
  newUserStatus: boolean;
  selectCommonInfo: any;
  deleter: (index: number) => void;
  rerender?: () => void;
}

export interface IUploadedListBox {
  fileData: any;
  index: number;
  setMediaList: (arg: TMediaType[]) => void;
  mediaList: TMediaType[];
  uploadSuccess: boolean | null;
  getMediaList: () => void;
  setUploadSuccess: (arg: boolean | null) => void;
  setMediaUploadedList: (arg: any) => void;
  address?: string;
  collectionIndex?: string;
}
export interface IAnalyticsPopUp {
  index: number;
  setMediaList: (arg: TMediaType[]) => void;
  mediaList: TMediaType[];
  setUploadSuccess: (arg: boolean | null) => void;
  titleOfContract?: any | undefined;
  selectCommonInfo?: any;
  fileData?: any;
  setMediaUploadedList?: (arg: any) => void;
  newUserStatus?: boolean;
  collectionIndex?: string;
  address?: string;
}
export interface IPopUpChangeVideo {
  modalIsOpen: boolean;
  closeModal: () => void;
  item: any;
  setUploadSuccess: (arg: boolean | null) => void;
  beforeUpload: boolean | undefined;
  setMediaList: (arg: TMediaType[]) => void;
  mediaList: TMediaType[];
  index: number;
}
