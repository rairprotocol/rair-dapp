import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { Teammate_4 } from '../../images/teamMeetList/teamMeetList';
import { Teammate_7 } from '../../images/UkraineGlitch/urkaineGlitch';
import { TTeamArrayItemType } from '../../splashPage.types';

export const teamUkraineArray: TTeamArrayItemType[] = [
  {
    chain: '0xFC9E791955AeDB8dbAd1Be054f82720c8bDbf582',
    nameTeammate: 'Ukrainian American Coordinating Council',
    imageUrl: Teammate_7,
    aboutTeammate: [
      'Please, join the Ukrainian-American Cultural Association of Oregon & SW Washington and the Ukrainian American Coordinating Council in raising money to fund medical supplies to Ukraine. As soon as funds will arrive in their bank accounts, they transfer it to Come Back Alive fund, Ukrainian Government Medical Fund, Ukrainian Refugee Fund and fund containers with medical supplies to Ukrainian hospitals. The Ukrainian community in Oregon and SW Washington has been shipping medical supplies to Ukraine since 2014. They have shipped 5 medical containers and hundreds of boxes of medical supplies generously donated by Medical Teams International. They are grateful to MTI for their donations, and to local volunteers who work with MTI to receive and repackage donations as well as volunteers in Ukraine who distribute these donations to hospitals and mobile clinics there. We ask for your support in helping pay for the shipment of these supplies from warehouses in Oregon and SW Washington to Ukraine. Any amount helps. UACC regularly posts pictures of previous shipments and will keep updating their fb fundraiser pages with pictures of medical shipment (or shipments!) your contributions help fund. Thank you! Дякуємо!'
    ],
    socials: [
      {
        classIcon: faFacebook,
        link: 'https://www.facebook.com/UACCusa/'
      },
      {
        classIcon: faArrowRight,
        link: 'https://uaccusa.org/',
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
