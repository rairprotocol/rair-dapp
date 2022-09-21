import { TSplashDataType } from '../splashPage.types';

export interface IMainBlockInfoText {
  splashData: TSplashDataType;
  children?: React.ReactNode;
  color: string;
  fontSize: string;
}

export type TMainBlockTitle = {
  color: string;
  fontSize: string;
};
