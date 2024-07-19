import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { NFTLA_ICON, Teammate_4 } from '../../images/teamMeetList/teamMeetList';
import { TTeamArrayItemType } from '../../splashPage.types';

export const teamNFTLAarray: TTeamArrayItemType[] = [
  {
    chain: '',
    nameTeammate: 'NFT LA',
    imageUrl: NFTLA_ICON,
    aboutTeammate: [
      "NFT | LA is an integrated conference experience: an epic IRL conference fused with an immersive Metaverse integrations and L.A's robust nightlife scene. Explore the city of angels and journey into its new role as a global conduit for the adoption of web3 in of sports, music, art, and entertainment."
    ],
    socials: [
      {
        classIcon: faArrowRight,
        link: 'https://www.nftla.live/',
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
