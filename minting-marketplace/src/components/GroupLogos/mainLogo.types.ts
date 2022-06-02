import { ColorChoice } from "../../ducks/colors/colorStore.types";
import { History, LocationState } from 'history';

export interface IMainLogo {
    goHome: () => void;
    sentryHistory: History<LocationState>;
    headerLogoWhite?: string;
    headerLogoBlack?: string;
    headerLogo: string;
    primaryColor?: ColorChoice;
}