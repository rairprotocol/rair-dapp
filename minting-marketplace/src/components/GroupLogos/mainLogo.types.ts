import { ColorChoice } from '../../ducks/colors/colorStore.types';

export interface IMainLogo {
  goHome: () => void;
  headerLogoWhite?: string;
  headerLogoBlack?: string;
  headerLogo: string;
  primaryColor?: ColorChoice;
}
