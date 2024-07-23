import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import {
  CoinAgenda_LOGO,
  Teammate_4
} from '../../images/teamMeetList/teamMeetList';
import { TTeamArrayItemType } from '../../splashPage.types';

export const teamCoinAgendaArray: TTeamArrayItemType[] = [
  {
    chain: '  ',
    nameTeammate: 'CoinAgenda',
    imageUrl: CoinAgenda_LOGO,
    aboutTeammate: [
      `CoinAgenda speakers and attendees are investors, traders, digital currency funds, founders, and top entrepreneurs in the blockchain and cryptocurrency sectors.`
    ],
    socials: [
      {
        classIcon: faArrowRight,
        link: 'https://coinagenda.com/',
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

      `RAIR empowers anyone to create unique, controllable, and transferable digital assets tied to the actual underlying content.`
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
