import { ColorChoice } from '../../ducks/colors/colorStore.types';
import { History, LocationState } from 'history';

export interface IFooter {
  sentryHistory: History<LocationState>;
}
