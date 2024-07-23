import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { NutTeam, Teammate_4 } from '../../images/teamMeetList/teamMeetList';
import { TTeamArrayItemType } from '../../splashPage.types';

export const teamNutArray: TTeamArrayItemType[] = [
  {
    nameTeammate: 'MC Cranksy',
    imageUrl: NutTeam,
    aboutTeammate: [
      `Nut Cranksy is a pseudonymous Florida-based  artist, graphic designer, 
              and author whose real name and identity remain the subject of speculation.
              The jovial nutcracker art combines humor and the playful dress-up of an old
              wooden holiday classic. Active since the late 2000s, currently, in the NFT
              space, bringing back to life some older works inspired and applying them 
              to be minted and expressed. Our work has all been "Work Made for Hire" for
              various corporate to mom and pop retail to startups. Mc Cranksy work grew
              out of consistency and grit, and finally, just start putting all the art
              out there. More projects are coming down the pipeline —stay tuned.`
    ],
    socials: []
  },
  {
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
