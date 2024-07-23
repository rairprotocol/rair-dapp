import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { Teammate_4, Teammate_6 } from '../../images/teamMeetList/teamMeetList';
import { TTeamArrayItemType } from '../../splashPage.types';

export const teamImmersiverseArray: TTeamArrayItemType[] = [
  {
    chain: '',
    nameTeammate: 'ImmersiVerse',
    imageUrl: Teammate_6,
    aboutTeammate: [
      `ImmersiVerse is a premium experiential destination featuring great speakers, meaningful 
              discussions and live demos of emerging technology. These multi-day events focus 
              on “Future-Culture”, finance, networking, the arts, and technology. Also included are macro-topics 
              like public policy and digital health. ImmersiVerses are designed for invite-only audiences and 
              scheduled during major gatherings such as SXSW, Sundance, Tribeca and IBC.`
    ],
    socials: [
      {
        classIcon: faArrowRight,
        link: 'http://iverse.events',
        classLink: 'arrrow-right'
      }
    ]
  },
  {
    chain: '',
    nameTeammate: 'RAIR Technologies',
    imageUrl: Teammate_4,
    aboutTeammate: [
      ` RAIR is a blockchain-based digital rights management platform that
          uses NFTs to gate access to streaming content. Data monopolies like Amazon,
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
