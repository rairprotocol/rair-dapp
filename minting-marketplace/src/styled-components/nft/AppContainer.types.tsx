import {
  BackgroundBlendModeType,
  ColorChoice
} from '../../ducks/colors/colorStore.types';

export interface IAppContainerFluidStyled {
  backgroundImageEffect: {
    backgroundBlendMode: BackgroundBlendModeType | undefined;
  };
  primaryColor?: ColorChoice;
  backgroundImage: string;
  textColor: string;
}

export interface IMainBlockAppStyled {
  showAlert: boolean;
  selectedChain: string | null | undefined;
  isSplashPage: boolean;
}
