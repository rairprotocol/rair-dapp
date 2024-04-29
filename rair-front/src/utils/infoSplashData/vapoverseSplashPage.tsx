import { vaporverse_background } from '../../components/SplashPage/images/vaporverse/vaporverse';
import { TSplashDataType } from '../../components/SplashPage/splashPage.types';

export const splashData: TSplashDataType = {
  title: '',
  titleColor: 'rgb(234,51,127)',
  description: '',
  cardFooter: '/utility drop for OG degens /mintpass to vaporverse',
  buttonLabel: 'Mint for .1991 Eth',
  buttonBackgroundHelp: undefined,
  backgroundImage: vaporverse_background,
  purchaseButton: undefined,
  button1: {
    buttonColor: 'rgb(234,51,127)',
    buttonLabel: 'premint.xyz',
    buttonImg: null,
    buttonLink: 'https://www.premint.xyz/vaporversexyz/'
  },

  button2: {
    buttonColor: 'rgb(189,52,183)',
    buttonLabel: 'discord',
    buttonImg: null,
    buttonLink: 'https://discord.gg/pSTbf2yz7V'
  },

  button3: {
    buttonColor: 'rgb(189,52,183)',
    buttonLabel: 'twitter',
    buttonImg: null,
    buttonLink: 'https://twitter.com/rairtech'
  },
  videoDataDemo: {
    video: null,
    // 'https://storage.googleapis.com/rair-videos/tx2cV7kzqFXF9lTC5iy1VCYoXBwonyG-HcjunEI5j1rqfX/2596768157',
    videoTitle: '',
    videoModuleDescription: null,
    videoModuleTitle: 'loading...',
    baseURL: 'https://staging.rair.market/stream/',
    mediaId: '9zG0NPK0DXRpCzMQeZ2y6yQYfpDMDJS-Pc1WSewRUaspE9'
    // demo: true
  },
  videoData: {
    video: null,
    videoTitle: '',
    videoModuleDescription: null,
    videoModuleTitle: 'loading...',
    baseURL: 'https://staging.rair.market/stream/',
    mediaId: 'tx2cV7kzqFXF9lTC5iy1VCYoXBwonyG-HcjunEI5j1rqfX'
  },
  tilesTitle: null,
  NFTName: 'NFT'
};
