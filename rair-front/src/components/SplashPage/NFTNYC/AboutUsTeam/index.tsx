import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import {
  NFTNYC_LOGO,
  Teammate_4
} from '../../images/teamMeetList/teamMeetList';
import { TTeamArrayItemType } from '../../splashPage.types';

export const teamNFTNYCArray: TTeamArrayItemType[] = [
  {
    chain: null,
    nameTeammate: 'NFTNYC',
    imageUrl: NFTNYC_LOGO,
    aboutTeammate: [
      `NFT | NYC puts as many speakers on stage as possible to provide a forum for the NFT community, giving a voice to the most relevant ideas of the moment. 
              Bring people together who are working on like projects. 
              Educate the global community about the value of NFTs`
    ],
    socials: [
      {
        classIcon: faArrowRight,
        link: 'https://www.nft.nyc/',
        classLink: 'arrrow-right'
      }
    ]
  },
  {
    chain: '0x7849194dD593d6c3aeD24035D70B5394a1C90F8F',
    nameTeammate: 'RAIR Technologies',
    imageUrl: Teammate_4,
    aboutTeammate: [
      ` RAIR is a blockchain-based digital rights management platform that
          uses NFTs to gate access to streaming content.Data monopolies like Amazon,
          YouTube, Google, Apple, and Netflix charge onerous fees, offer opaque analytics,
          and can change their terms of service at any time locking out creators
          and users alike.  DIY distribution meanwhile offers no protection, and cannot
          help package works into a scarce, valuable, tradeable framework.`,

      `RAIR, through its decentralized key management node system, empowers
          anyone to create unique, controllable, and transferable digital assets
          tied to the actual underlying content.`
    ],
    socials: [
      {
        classIcon: faArrowRight,
        link: 'https://rair.tech',
        classLink: 'arrrow-right'
      }
    ]
  }
];
