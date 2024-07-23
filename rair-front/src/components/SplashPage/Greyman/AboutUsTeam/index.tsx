import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import {
  GreymanAuthor,
  Teammate_4,
  Teammate_5
} from '../../images/teamMeetList/teamMeetList';
import { TTeamArrayItemType } from '../../splashPage.types';

export const teamGreymanArray: TTeamArrayItemType[] = [
  {
    chain: '0x7bfbAAC8b6bC1B7b9e4bEB5c1d92C913B9598465',
    nameTeammate: 'Dadara',
    imageUrl: GreymanAuthor,
    aboutTeammate: [
      `Dadara began his artistic career in the early nineties designing flyers and 
              record covers, and doing live-paintings for the then burgeoning electronic dance scene.
              This early work, as well as projects such as the Dadababy speakers and the Greyman
              Statue of No Liberty, marked the start of an impressive career as a painter, 
              installation- and performance artist, designer, and cartoonist. Since the turn 
              of the century, his focus has shifted towards extravagant interactive performance-installations 
              in public space. This includes starting his own bank and creating a religion based 
              on social media. Many of these creations were built at the legendary Burning Man 
              event in the Nevada desert. His work is a kind of tweaked mirror which reflects our
              society, blurring the lines between reality and fantasy. Perhaps a black mirror, 
              but one that has a rainbow at the end of the tunnel.`
    ],
    socials: [
      {
        classIcon: faTwitter,
        link: 'https://twitter.com/Dadaratopia'
      }
    ]
  },
  {
    chain: '0x4704DC390a5779fECfD77bd0852bF826569e028e',
    nameTeammate: 'Movement on the Ground',
    imageUrl: Teammate_5,
    aboutTeammate: [
      `Movement on the Ground is a grassroot NGO that believes every human being affected by war, conflict or disaster, has the right to rebuild a new life in safety, dignity and full potential. 
              Founded in 2015 by a group of creative entrepreneurs who were compelled to act during the unfolding Syrian refugee crisis in Europe, MOTG since then has always found innovative ways to positively impact the situation on the ground. From bringing in knowledge and expertise from the music festival industry to the crisis management of refugee camps, to setting up “Digital Learning labs” to educate digital skills to asylum seekers in order to kickstart a future. MOTG has always been a group of different thinkers at the forefront of unlocking human potential for good.`,

      `Throughout its 5 years presence on the Greek island Lesvos, MOTG was able to develop its blueprint model “from camp to campUs”. At the core of this holistic model is the empowerment of refugees in their independece and self-reliance and their preperation for integration in their host environment. Acces to mental health, education, technology, sports and art play a crucial role in the CampUs. 
              `
    ],
    socials: [
      {
        classIcon: faArrowRight,
        link: 'https://movementontheground.com/',
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
