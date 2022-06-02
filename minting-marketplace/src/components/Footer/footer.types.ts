import { ColorChoice } from "../../ducks/colors/colorStore.types";
import { History, LocationState } from 'history';

export interface IFooter {
    primaryColor: ColorChoice;
    sentryHistory: History<LocationState>;
    openAboutPage?: () => void;
  }
  