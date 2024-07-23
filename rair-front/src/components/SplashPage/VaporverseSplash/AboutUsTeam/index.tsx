import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { Teammate_VV } from '../../images/vaporverse/vaporverse';
import { TTeamArrayItemType } from '../../splashPage.types';

export const teamVaporVerseArray: TTeamArrayItemType[] = [
  {
    chain: '0x7849194dD593d6c3aeD24035D70B5394a1C90F8F',
    nameTeammate: 'RAIR Technologies',
    imageUrl: Teammate_VV,
    aboutTeammate: [
      `
              //actual Delaware C Corporation
              //real doxxed team
              //real programmers that make kubernetes and shit
              //AND BLOCKCHAIN AND SHIT EIP2981 EIP 2535 
              //CRAZY ADVANCED ROYALTIES
              //Our METADATA will blow your mind `
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
