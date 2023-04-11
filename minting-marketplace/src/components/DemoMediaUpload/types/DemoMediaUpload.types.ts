import { OptionsType } from '../../common/commonTypes/InputSelectTypes.types';
import { TMediaType } from '../../creatorStudio/creatorStudio.types';

export interface IMediaItemChange {
  item: TMediaType;
  setMediaList: (arg: TMediaType[]) => void;
  index: number;
  mediaList: TMediaType[];
  uploadSuccess: null | boolean;
  textFlag?: boolean;
  uploadVideo?: boolean;
  mediaId?: string;
  getMediaList: (() => void) | undefined;
  editTitleVideo: boolean;
  setEditTitleVideo: any;
  newUserStatus?: boolean;
  setUploadSuccess?: (arg: boolean | null) => void;
  beforeUpload?: boolean;
}

export interface IMediaListBox {
  item: TMediaType;
  index: number;
  newUserStatus: boolean;
  mediaList: TMediaType[];
  setMediaList: (arg: TMediaType[]) => void;
  uploadSuccess: boolean | null;
  uploadProgress: any;
  uploading: boolean;
  uploadVideoDemo: (item: TMediaType, storage: string) => void;
  selectCommonInfo: any;
  deleter: (index: number) => void;
  currentTitleVideo: string;
  socketMessage: string | undefined;
  setUploadSuccess: (arg: boolean | null) => void;
  setSocketMessage: (arg: string | undefined) => void;
}

export interface IUploadedListBox {
  fileData: any;
  index: number;
  setMediaList: (arg: TMediaType[]) => void;
  mediaList: TMediaType[];
  uploadSuccess: boolean | null;
  copyEmbebed: (videoId: number, contract: string) => void;
  getMediaList: () => void;
  setUploadSuccess: (arg: boolean | null) => void;
  setMediaUploadedList: (arg: any) => void;
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
}

export interface IPopUpChangeVideo {
  modalIsOpen: boolean;
  closeModal: () => void;
  item: any;
  setUploadSuccess: (arg: boolean | null) => void;
}
