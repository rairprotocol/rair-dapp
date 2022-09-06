import { ColorChoice } from '../../ducks/colors/colorStore.types';

export interface INumberedCircle {
  index: number;
  primaryColor: ColorChoice;
}

export interface IRAIRGenesisSplashPage {
  connectUserData: () => Promise<void>;
}
