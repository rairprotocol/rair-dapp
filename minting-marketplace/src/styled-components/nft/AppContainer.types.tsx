import { BackgroundBlendModeType } from '../../ducks/colors/colorStore.types';

export interface IAppContainerFluidStyled {
  backgroundImageEffect: {
    backgroundBlendMode: BackgroundBlendModeType | undefined;
  };
  primaryColor?: string;
  backgroundImage: string;
  textColor: string;
}

export interface IMainBlockAppStyled {
  showAlert: boolean;
  selectedChain: string | null | undefined;
  isSplashPage: boolean;
}
