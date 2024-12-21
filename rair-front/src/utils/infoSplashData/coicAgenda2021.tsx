//@ts-nocheck
import { TSplashDataType } from '../../components/SplashPage/splashPage.types';
import { hyperlink } from '../../components/SplashPage/SplashPageConfig/utils/hyperLink';

export const splashData: TSplashDataType = {
  NFTName: '#coinagenda NFT',
  videoPlayerParams: {
    contract: '0x551213286900193ff3882a3f3d0441aadd32d42d',
    product: '0',
    blockchain: '0x89'
  },
  button2: {
    buttonTextColor: '#FFFFFF',
    buttonColor: '#f69220',
    buttonLabel: 'REGISTER FOR GLOBAL',
    buttonImg: null,
    buttonAction: () =>
      hyperlink(
        'https://www.eventbrite.com/e/coinagenda-global-2022-feat-bitangels-tickets-297407703447'
      )
  },
  button1: {
    buttonTextColor: '#FFFFFF',
    buttonColor: '#f69220',
    buttonLabel: 'VIEW ON OPENSEA',
    buttonImg: null,
    buttonAction: () => hyperlink('https://opensea.io/collection/coinagenda')
  }
};
