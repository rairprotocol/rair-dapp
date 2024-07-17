import {
  ColorStoreActionsType,
  ColorStoreType,
  SchemaType
} from './colorStore.types';
import * as types from './types';

import {
  headerLogoBlackMobile,
  headerLogoWhiteMobile,
  HotDropsLogo,
  HotDropsLogoLight,
  HotDropsLogoMobile
} from '../../images';
import { headerLogoBlack, headerLogoWhite } from '../../images';
import { bgLogoBlack, bgLogoWhite } from '../../images';

const charcoal = '#222021';
const rhyno = '#dedede';
const bubblegum = '#e882d5';
const royalPurple = '#725bdb';
const arcticBlue = '#19a7f6';

const buttons = {
  primaryButtonColor: `linear-gradient(to right, ${royalPurple}, ${bubblegum})`,
  secondaryButtonColor: `linear-gradient(to right, ${arcticBlue}, ${royalPurple})`
};

const hotdropsVar = import.meta.env.VITE_TESTNET;

const schemes: SchemaType = {
  rhyno: {
    primaryColor: rhyno,
    secondaryColor: charcoal,
    headerLogo: hotdropsVar === 'true' ? HotDropsLogoLight : headerLogoBlack,
    headerLogoMobile:
      hotdropsVar === 'true' ? HotDropsLogoMobile : headerLogoBlackMobile,
    textColor: 'black',
    backgroundImage: bgLogoWhite,
    backgroundImageEffect: { backgroundBlendMode: undefined },
    iconColor: '#F95631'
  },
  charcoal: {
    primaryColor: charcoal,
    secondaryColor: rhyno,
    headerLogo: hotdropsVar === 'true' ? HotDropsLogo : headerLogoWhite,
    headerLogoMobile:
      hotdropsVar === 'true' ? HotDropsLogoMobile : headerLogoWhiteMobile,
    textColor: 'white',
    backgroundImage: bgLogoBlack,
    backgroundImageEffect: { backgroundBlendMode: 'lighten' },
    iconColor: '#F95631'
  }
};

const InitialColorScheme: ColorStoreType = {
  ...schemes[localStorage.colorScheme ? localStorage.colorScheme : 'charcoal'],
  ...buttons
};

if (!localStorage.colorScheme) {
  localStorage.setItem('colorScheme', 'charcoal');
}

export default function colorStore(
  state: ColorStoreType = InitialColorScheme,
  action: ColorStoreActionsType
): ColorStoreType {
  switch (action.type) {
    case types.SET_CUSTOM_COLORS:
      schemes.charcoal.primaryColor = action.value.primary
        ? action.value.primary
        : charcoal;
      schemes.charcoal.secondaryColor = action.value.secondary
        ? action.value.secondary
        : rhyno;
      schemes.charcoal.textColor = action.value.text
        ? action.value.text
        : 'white';
      if (action.value.primaryButton) {
        buttons.primaryButtonColor = action.value.primaryButton;
        if (action.value.fadeButton) {
          buttons.primaryButtonColor = `linear-gradient(to right, ${action.value.fadeButton}, ${action.value.primaryButton})`;
        }
      }
      if (action.value.secondaryButton) {
        buttons.secondaryButtonColor = action.value.secondaryButton;
        if (action.value.fadeButton) {
          buttons.secondaryButtonColor = `linear-gradient(to right, ${action.value.secondaryButton}, ${action.value.fadeButton})`;
          schemes.rhyno.iconColor = action.value.secondaryButton;
          schemes.charcoal.iconColor = action.value.secondaryButton;
        }
      }
      return {
        ...state,
        ...schemes[localStorage.colorScheme],
        ...buttons
      };
    case types.SET_CUSTOM_LOGOS_DARK:
      schemes.charcoal.headerLogo = action.value.desktop
        ? action.value.desktop
        : headerLogoWhite;
      schemes.charcoal.headerLogoMobile = action.value.mobile
        ? action.value.mobile
        : headerLogoWhiteMobile;
      return {
        ...state,
        ...schemes[localStorage.colorScheme],
        ...buttons
      };
    case types.SET_CUSTOM_LOGOS_LIGHT:
      schemes.rhyno.headerLogo = action.value.desktop
        ? action.value.desktop
        : headerLogoBlack;
      schemes.rhyno.headerLogoMobile = action.value.mobile
        ? action.value.mobile
        : headerLogoBlackMobile;
      return {
        ...state,
        ...schemes[localStorage.colorScheme],
        ...buttons
      };
    case types.SET_COLOR_SCHEME:
      localStorage.setItem('colorScheme', action.colorScheme);
      return {
        ...state,
        ...schemes[action.colorScheme],
        ...buttons
      };
    default:
      return state;
  }
}
