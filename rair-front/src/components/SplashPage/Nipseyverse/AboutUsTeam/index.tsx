import {
  faInstagram,
  faLinkedinIn,
  faTwitter
} from '@fortawesome/free-brands-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import {
  Estate_Teammate,
  Teammate_1,
  Teammate_2,
  Teammate_3,
  Teammate_4
} from '../../images/teamMeetList/teamMeetList';
import { TTeamArrayItemType } from '../../splashPage.types';

export const teamNipseyverseArray: TTeamArrayItemType[] = [
  {
    nameTeammate: 'Mr.Lee',
    imageUrl: Teammate_1,
    aboutTeammate: [
      `Over the past two decades, Mr. Lee’s soulful and synth heavy sound
              has not only been emulated, but has allowed him to rack up 9 platinum
              albums, 6 gold albums and singles on the radio for 13 consecutive years.
              He has had the opportunity to work with an array of artists including
              Paul Wall, Slim Thug, Mary J. Blige, and Dwele. Now currently working 
              with LL Cool J, he hopes his new XMG label will not only help break 
              on-the-rise stars King Shaun and Adonia, but serve as a hub for new
              artists to be heard in the future.`,

      `Mr. Lee worked closely with Nipsey on his 2018 album Victory Lap. 
              His relationship with the late rapper trascended artist/producer 
              into a deep friendship of mutual respect. Lee retains many personal 
              messages and recordings between himself and Nipsey which he plans 
              to make thoughtfully available to the Nipseyverse when the time is
               right.`
    ],
    socials: [
      {
        classIcon: faTwitter,
        link: 'https://twitter.com/mrlee713'
      },
      {
        classIcon: faInstagram,
        link: 'https://www.instagram.com/mrlee713/'
      }
    ]
  },
  {
    nameTeammate: 'John Patillo',
    imageUrl: Estate_Teammate,
    aboutTeammate: [
      `John Patillo is a 25 year veteran in the business of music. He has participated
              in the sale of over 50 million records from the likes of Twista, Daz Dillenger, 
              Snoop Dogg, Zro, Lil Flip Boosie Badazz and several other independent music artists.
              Mr. Patillo is an advocate of music education and works daily to help artists with 
              best practices to help monetize their music. Currently John Patillo is the CEO of 
              Southwest Digital. A music distribution company servicing about 300 music 
              labels throughout world.`,

      `As the CEO he works extensively to ensure that the company meets agreed on business
              objectives. The CEO ensures key systems (CMS, analytics, website, marketing, 
              etc.) work effectively to meet company goals. In addition, Mr. Patillo finds
              and collaborates with strategic marketing partners and develops other 
              strategic partnerships with streaming companies. Mr. Patillo handles Southwest
              Digital Distribution’s day to day operational and administrative services,
              which are determined by Robert Guillerman and Mr. Patillo.`
    ],
    socials: [
      {
        classIcon: faLinkedinIn,
        link: 'https://www.linkedin.com/in/johnpatillo/'
      },
      {
        classIcon: faInstagram,
        link: 'https://www.instagram.com/mrjfpster/?hl=en'
      }
    ]
  },
  {
    nameTeammate: 'Neighborhood Nip Foundation',
    imageUrl: Teammate_2,
    aboutTeammate: [
      `The Neighborhood Nip Foundation is an initiative that seeks to provide
              opportunities for young creatives in music. The late rapper, who died
              in early March of 2019 after being shot & killed outside of his clothing
              store in Los Angeles, was known for his philanthropic efforts towards his 
              community and neighborhood. As Nipsey’s brother, Sam Asghedom, told the Los
              Angeles Times, the new foundation will “be aligned with everything Nip
              believed in and what helped him”.`,

      `The foundation is mainly inspired by Nipsey’s own time spent at LA’s 
              Watts Towers, which provided a free music program to the rapper during his 
              youth. “We used to talk a lot about [what the Watts Towers program] meant to
              him,” Asghedom said. “A push, a little help can go a long way, and that’s 
              what this foundation will 100 percent be about.”`
    ],
    socials: [
      {
        classIcon: faArrowRight,
        link: 'https://www.facebook.com/neighborhoodnipfoundation/',
        classLink: 'arrrow-right'
      }
    ]
  },
  {
    nameTeammate: 'Southwest Digital',
    imageUrl: Teammate_3,
    aboutTeammate: [
      `Southwest Digital is a music aggregator which delivers music to some
              of the top streaming services around the world. It offers exclusive 
              music videos, audio tracks, and live/archived streaming of music events.
              Southwest Digital is a leading source of multimedia, interviews, reviews,
              premieres and exclusive content for music artists.`,

      `For content owners, record labels and distributors, Southwest Digital offers
              a complete ecosystem for the digital music lifecycle that optimizes your business
              processes. With headquarters in Houston and Los Angeles, we manage thousands 
              of tracks with superb digital supply chain integration as well as dynamic 
              marketing and promotion.`
    ],
    socials: [
      {
        classIcon: faArrowRight,
        link: 'https://swdd.io',
        classLink: 'arrrow-right'
      }
    ]
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
