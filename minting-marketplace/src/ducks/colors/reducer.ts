import * as types from './types';

import headerLogoBlackMobile from '../../images/RAIR-Tech-Logo-POWERED BY-BLACK-2021.png';
import headerLogoWhiteMobile from '../../images/RAIR-Tech-Logo-POWERED BY-WHITE-2021.png';
import headerLogoWhite from '../../images/rairTechLogoWhite.png';
import headerLogoBlack from '../../images/rairTechLogoBlack.png';

import bgLogoBlack from '../../images/BlackBg.png';
import bgLogoWhite from '../../images/ClayBg.png';
import {
  ColorStoreType,
  SchemaType,
  ColorStoreActionsType
} from './colorStore.types';

const schemes: SchemaType = {
  rhyno: {
    primaryColor: 'rhyno',
    secondaryColor: 'charcoal',
    headerLogo: headerLogoBlack,
    headerLogoMobile: headerLogoBlackMobile,
    textColor: 'black',
    backgroundImage: bgLogoWhite,
    backgroundImageEffect: { backgroundBlendMode: undefined }
  },
  charcoal: {
    primaryColor: 'charcoal',
    secondaryColor: 'rhyno',
    headerLogo: headerLogoWhite,
    headerLogoMobile: headerLogoWhiteMobile,
    textColor: 'white',
    backgroundImage: bgLogoBlack,
    backgroundImageEffect: { backgroundBlendMode: 'lighten' }
  }
};

const InitialColorScheme: ColorStoreType =
  schemes[localStorage.colorScheme ? localStorage.colorScheme : 'charcoal'];

export default function colorStore(
  state: ColorStoreType = InitialColorScheme,
  action: ColorStoreActionsType
): ColorStoreType {
  switch (action.type) {
    case types.SET_COLOR_SCHEME:
      localStorage.setItem('colorScheme', action.colorScheme);
      return {
        ...state,
        ...schemes[action.colorScheme]
      };
    default:
      return state;
  }
}
