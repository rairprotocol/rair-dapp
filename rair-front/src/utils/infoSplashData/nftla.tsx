//@ts-nocheck
import NFTLA_Video from '../../components/SplashPage/images/NFTLA/NFT-LA-RAIR-2021.mp4';
import {
  NFTLA1,
  NFTLA1_rounded,
  NFTLA2,
  NFTLA3
} from '../../components/SplashPage/images/NFTLA/nftLA';
import { TSplashDataType } from '../../components/SplashPage/splashPage.types';
import { discrodIconNoBorder, DocumentIcon } from '../../images';

export const splashData: TSplashDataType = {
  title: '#NFTLA',
  titleColor: '#A4396F',
  description:
    'Connect with Metamask for your free NFT airdrop and access exclusive streaming content from our event!',
  backgroundImage: NFTLA1_rounded,
  button1: {
    buttonColor: '#A4396F',
    buttonLabel: 'Submit with Form',
    buttonImg: DocumentIcon,
    buttonLink:
      'https://docs.google.com/forms/d/e/1FAIpQLSeMAtvf2DOMrB05M1lH8ruvKsawEWNqWQOM-1EsQ4w59Nv71A/viewform'
  },
  button2: {
    buttonColor: '#E6B4A2',
    buttonLabel: 'Join Our Discord',
    buttonImg: discrodIconNoBorder,
    buttonLink: 'https://discord.com/invite/y98EMXRsCE'
  },
  NFTName: 'NFT art',
  carouselTitle: '3 Unique Styles',
  carouselData: [
    {
      title: 'Horizon',
      img: NFTLA2,
      description: null
    },
    {
      title: 'Dark',
      img: NFTLA3,
      description: null
    },
    {
      title: 'Palm',
      img: NFTLA1,
      description: null
    }
  ],
  videoData: {
    video: NFTLA_Video,
    videoTitle: 'NFT LA',
    videoModuleDescription:
      'Want to learn more about the project? Only NFT owners get access to exclusive streaming content. Connect with Metamask and get yours today!',
    videoModuleTitle: 'Preview',
    demo: true
  },
  videoTilesTitle: 'NFTLA',
  videoArr: [
    {
      videoName: 'Welcome to NFTLA',
      videoType: 'NFTLA-EXCLUSIVE-1',
      videoTime: '00:00:26',
      videoSRC: NFTLA_Video,
      demo: true
    },
    {
      videoName: 'NFTs and Hollywood',
      videoType: 'NFTLA-EXCLUSIVE-2',
      videoTime: '02:21.38',
      videoSRC: null,
      baseURL: 'https://storage.googleapis.com/rair-videos/',
      mediaId: 'YOyAaCOt8xrOt-NcvffXR7g0ibX5kJ2w21yGHR1XKOPMEY'
    },
    {
      videoName: 'Orange Comet',
      videoType: 'NFTLA-EXCLUSIVE-3',
      videoTime: '32:00.58',
      videoSRC: null,
      baseURL: 'https://storage.googleapis.com/rair-videos/',
      mediaId: 'Zosxmne0LRAu2TxEMU5A0WMg8-msfHqvxGws9osGnu4yxL'
    },
    {
      videoName: 'Web 3 Convergence',
      videoType: 'NFTLA-EXCLUSIVE-4',
      videoTime: '30:46.31',
      videoSRC: null,
      baseURL: 'https://storage.googleapis.com/rair-videos/',
      mediaId: 'pZJJmq9rR6HC1jPxy-RpVvutfTYMtyAGRb2DDnMdTTIlhA'
    }
  ]
};
