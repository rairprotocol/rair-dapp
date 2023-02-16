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
}

export interface IMediaListBox {
  item: TMediaType;
  index: number;
  mediaList: TMediaType[];
  setMediaList: (arg: TMediaType[]) => void;
  uploadSuccess: boolean | null;
  uploadProgress: any;
  uploading: boolean;
  uploadVideoDemo: (item: TMediaType, storage: string) => void;
  categories: OptionsType[];
  selectCommonInfo: any;
  deleter: (index: number) => void;
  updateMediaCategory: (array, index, value: string) => void;
  currentTitleVideo: string;
  socketMessage: string | undefined;
}

export interface IUploadedListBox {
  fileData: any;
  index: number;
  setMediaList: (arg: TMediaType[]) => void;
  mediaList: TMediaType[];
  uploadSuccess: boolean | null;
  copyEmbebed: (videoId: number) => void;
  selectCommonInfo: any;
  updateMediaCategory: (array, index, value: string) => void;
  mediaUploadedList: any | null;
  categories: OptionsType[];
  getMediaList: () => void;
}
