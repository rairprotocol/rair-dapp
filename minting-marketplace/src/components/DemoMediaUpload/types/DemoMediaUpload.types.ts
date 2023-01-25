import { OptionsType } from '../../common/commonTypes/InputSelectTypes.types';
import { TMediaType } from '../../creatorStudio/creatorStudio.types';

export interface IMediaItemChange {
  item: TMediaType;
  setMediaList: (arg: TMediaType[]) => void;
  index: number;
  mediaList: TMediaType[];
  uploadSuccess: null | boolean;
  textFlag?: boolean;
}

export interface IMediaListBox {
  item: TMediaType;
  index: number;
  mediaList: TMediaType[];
  setMediaList: (arg: TMediaType[]) => void;
  uploadSuccess: boolean | null;
  uploadProgress: any;
  uploading: boolean;
  uploadVideoDemo: (item: TMediaType) => void;
  categories: OptionsType[];
  selectCommonInfo: any;
  deleter: (index: number) => void;
  updateMediaCategory: (array, index, value: string) => void;
  currentTitleVideo: string;
}
