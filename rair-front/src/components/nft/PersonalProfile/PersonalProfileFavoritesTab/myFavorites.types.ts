import { TFavotiteTokenData } from '../../../../axios.responseTypes';

export interface IMyfavoriteItem {
  item: TFavotiteTokenData;
  removeFavotite?: (arg: string) => void;
  userPage?: boolean;
}

export interface IPersonalProfileFavoritesTab {
  titleSearch: string;
}
