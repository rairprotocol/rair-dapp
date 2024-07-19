import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import {
  MarkJKohler,
  RairLogoKohler
} from '../../images/teamMeetList/teamMeetList';
import { TTeamArrayItemType } from '../../splashPage.types';

export const teamTaxHacksSummit: TTeamArrayItemType[] = [
  {
    chain: '',
    nameTeammate: 'Mark J. Kohler',
    imageUrl: MarkJKohler,
    aboutTeammate: [
      `Mark J. Kohler, M.Pr.A., C.P.A., J.D. is a best-selling author; national speaker; radio show host; writer and video personality for Entrepreneur.com; real estate investor; senior partner in the law firm, Kyler, Kohler, Ostermiller & Sorensen, and the accounting firm of Kohler & Eyre, CPAs. Mark is a personal and small business tax and legal expert, who helps clients build and protect wealth through wealth management strategies, and business and tax remedies often overlooked in this challenging, ever-changing economic climate.`
    ],
    socials: [
      {
        classIcon: faArrowRight,
        link: 'https://markjkohler.com',
        classLink: 'arrrow-right'
      }
    ]
  },
  {
    chain: '0x7849194dD593d6c3aeD24035D70B5394a1C90F8F',
    nameTeammate: 'RAIR Technologies',
    imageUrl: RairLogoKohler,
    aboutTeammate: [
      ` RAIR is a blockchain-based digital rights management platform that uses NFTs to gate access to streaming content.Data monopolies like Amazon, YouTube, Google, Apple, and Netflix charge onerous fees, offer opaque analytics, and can change their terms of service at any time locking out creators and users alike.  DIY distribution meanwhile offers no protection, and cannot help package works into a scarce, valuable, tradeable framework.\n\n`,

      `RAIR, through its decentralized key management node system, empowers anyone to create unique, controllable, and transferable digital assets tied to the actual underlying content.`
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
