import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';

import {
  Flyinggreyman,
  GreymanArmy,
  GreymanMatrix,
  GreymanMonument,
  GreymanRose,
  GreyManTimes,
  GreymanVariants
} from '../../components/SplashPage/images/greyMan/grayMan';
import {
  SimDogs0,
  SimDogs1,
  SimDogs2,
  SimDogs3,
  SimDogs4
} from '../../components/SplashPage/images/simDogs/simDogs';
import {
  TDonationGridDataItem,
  TSplashDataType
} from '../../components/SplashPage/splashPage.types';
import { discrodIconNoBorder } from '../../images';

const mainChain = '0x1';

export const splashData: TSplashDataType = {
  // NFTName: 'Genesis Pass artwork',
  title: 'SIM DOGS',
  titleColor: '#495CB0',
  description: 'BUY A DOG, WIN A LAWSUIT & END SIM SWAP CRIME!',
  textBottom: false,
  videoPlayerParams: {
    contract: '0xa5a823294af53b983969bb48caa3cdb28545828f',
    product: '0',
    blockchain: '0x1'
  },
  marketplaceDemoParams: {
    contract: '0xa5a823294af53b983969bb48caa3cdb28545828f',
    product: '0',
    blockchain: '0x1'
  },
  purchaseButton: {
    requiredBlockchain: '0x38',
    contractAddress: '0x03041d4fd727eae0337529e11287f6b499d48a4f'
  },
  buttonLabel: 'Connect Wallet',
  buttonBackgroundHelp: 'rgb(3, 91, 188)',
  backgroundImage: SimDogs0,
  button1: {
    buttonImg: discrodIconNoBorder,
    buttonAction: () => window.open('https://discord.gg/pSTbf2yz7V')
  },
  button2: {
    buttonCustomLogo: (
      <FontAwesomeIcon icon={faTwitter} className="twitter-logo" />
    ),
    buttonAction: () => window.open('https://twitter.com/SIMDogsXYZ')
  },
  button3: {
    buttonTextColor: '#FFFFFF',
    buttonColor: '#55CFFF',
    buttonLabel: 'Opensea',
    buttonImg: null,
    buttonLink: 'https://opensea.io/collection/sim-dogs'
  },
  exclusiveNft: {
    title: 'NFTs',
    titleColor: 'rgb(3, 91, 188)'
  },
  timelinePics: [
    Flyinggreyman,
    GreymanVariants,
    GreymanMonument,
    GreymanRose,
    GreymanArmy,
    GreymanMatrix,
    GreyManTimes
  ]
};

export const donationGridData: TDonationGridDataItem[] = [
  {
    title: 'PROSECUTOR',
    image: SimDogs1,
    imageClass: 'zero',
    buyFunctionality: true,
    offerIndexInMarketplace: '6',
    switchToNetwork: mainChain,
    contractAddress: '0xa5a823294af53b983969bb48caa3cdb28545828f',
    buttonData: {
      buttonTextColor: '#FFFFFF',
      buttonColor: '#384190',
      buttonLabel: 'Mint for 10.7 ETH'
    },
    textBoxArray: [
      '107 unique drawings with various rarity traits',
      '“Bored Ape” style ownership rights',
      '+++',
      '25 free Blockchain Wire press releases (Express circuit)',
      '$15K CoinAgenda sponsorships',
      'One year of free CoinAgenda conference passes (value: $12,000)',
      'Private Zoom updates on trial'
    ]
  },
  {
    title: 'DETECTIVE',
    image: SimDogs4,
    imageClass: 'one',
    buyFunctionality: true,
    offerIndexInMarketplace: '7',
    switchToNetwork: mainChain,
    contractAddress: '0xa5a823294af53b983969bb48caa3cdb28545828f',
    buttonData: {
      buttonTextColor: '#FFFFFF',
      buttonColor: '#006EE9',
      buttonLabel: 'Mint for 1.07 ETH'
    },
    textBoxArray: [
      '1,000 unique pieces of generative art, with various degrees of rarity',
      'Unreleased audio from conversations with convicted SIM swapper',
      '++',
      '10 free Blockchain Wire press releases (Express circuit)',
      'One free CoinAgenda conference pass (value $3,000)'
    ]
  },
  {
    title: 'SUPPORTER',
    image: SimDogs3,
    imageClass: 'one',
    buttonData: {
      buttonAction: () => {
        Swal.fire('Coming soon!');
      },
      buttonTextColor: '#FFFFFF',
      buttonColor: '#51E84D',
      buttonLabel: 'Coming soon'
    },
    textBoxArray: [
      '10,000 unique pieces of generative art, with various degrees of rarity',
      '+',
      '1 free Blockchain Wire press release',
      '$250 off any CoinAgenda conference',
      'Video updates on trial',
      'Membership to StopSIMCrimeOrg',
      ' '
    ]
  },
  {
    title: 'SUPREME COURT',
    image: SimDogs2,
    imageClass: 'zero',
    buttonData: {
      buttonAction: () => {
        Swal.fire('Coming soon!');
      },
      buttonTextColor: '#FFFFFF',
      buttonColor: '#FE94FF',
      buttonLabel: 'Coming soon'
    },
    textBoxArray: [
      'Nine unique “1-of-1” original drawings by Andre Miripolsky',
      'Work directly with Miripolsky to design',
      '+++ +',
      '100 free Blockchain Wire press releases (Express circuit)',
      '$150K CoinAgenda sponsorships',
      'Lifetime conference pass to all CoinAgenda conferences',
      'Ten hours of personal meetings with Michael Terpin'
    ]
  }
];
