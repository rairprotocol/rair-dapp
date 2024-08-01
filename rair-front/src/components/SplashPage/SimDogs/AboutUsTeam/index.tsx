import { faLinkedinIn, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import {
  AndreMiripolsky,
  MichaelTerpin,
  Teammate_4
} from '../../images/teamMeetList/teamMeetList';
import { TTeamArrayItemType } from '../../splashPage.types';

export const teamSimDogsArray: TTeamArrayItemType[] = [
  {
    chain: '',
    nameTeammate: 'Michael Terpin',
    imageUrl: MichaelTerpin,
    aboutTeammate: [
      `Michael Terpin is founder and CEO of Transform Ventures, a blockchain incubator/accelerator, and of Transform Group, the leading advisory and PR firm for the blockchain industry. He’s worked with more than 300 companies in their early stages, including the launches of Augur, Bancor, Ethereum, Golem, Neo, Qtum, Tether and WAX. He is an advisor to leading companies in the metaverse and NFT sectors, including RAIR and Upland.
        
        Terpin also co-founded BitAngels, the world’s first angel network for digital currency startups, in May, 2013, which has expanded to 15 city chapters, as well as the first global cryptocurrency investor conference series, CoinAgenda, in 2014. He is also a general partner in Tradery Capital, an algorithmic trading fund for digital assets; a general partner in Tradecraft Capital, a “liquid venture” digital asset fund; and an LP and senior advisor to Alphabit Fund, a leading international digital currency fund.
        
        Additionally, Terpin is chairman and co-founder of First Block, a collection of vertical market newswires, including Blockchain Wire, and NFT properties. Previously, Terpin founded Marketwire (now Globe Newswire), one of the world’s largest company newswires, which was acquired in 2006, later sold to NASDAQ for $200 million, and ultimately to Intrado Digital Media, a division of Apollo Global Management (NYSE: APO). He also co-founded Direct IPO, one of the earliest equity crowdfunding companies, in 1996.
        
        Terpin’s first PR firm, The Terpin Group, represented many of the early Internet leaders, including America Online, Earthlink, Match.com and the Motley Fool. The Terpin Group was sold in 2000 to Financial Dynamics, now part of FTI Consulting (NYSE: FCN). Terpin holds an MFA from SUNY at Buffalo and dual BA in journalism and English from Syracuse University, where he serves on the board of advisors at the top-ranked Newhouse School of Public Communications. Terpin lives with his wife, Maxine, and toy poodle, Monkey, in San Juan, Puerto Rico, where he received the first Act 22 tax decree granted to a blockchain industry investor. He also co-founded the Caribbean Blockchain Association with industry leaders Gabriel Abed and Roger Ver.`
    ],
    socials: [
      {
        classIcon: faTwitter,
        link: '  https://twitter.com/michaelterpin'
      },
      {
        classIcon: faLinkedinIn,
        link: 'https://www.linkedin.com/in/michaelterpin/',
        classLink: ''
      }
    ]
  },
  {
    chain: '',
    nameTeammate: 'Andre Miripolsky',
    imageUrl: AndreMiripolsky,
    aboutTeammate: [
      'Andre Miripolsky is an artist of extraordinary creative abilities. As colorful a man as the exuberantly colorific art he creates, his signature style of pop imagery is bright, whimsical, energetic, and downright fun. A true multi-media artist, Andre is much more than a painter, taking his unique pop-style into sculpture, mobiles, graphics, branding, production design, sets and costumes, and now, NFTs. His sense of humor has been embraced by film and music stars, creating several art costumes for Sir Elton John - most notably the often-photographed “Piano Jacket” made for the famous Central Park concert. He has also collaborated on projects for Bette Midler, Quincy Jones, Robin Williams, the Rolling Stones, MTV, and Mattel, where he was commissioned to create a one-of-a-kind “Miripolsky Art Barbie.” From 1997-2004 he painted huge scenic sets and floors for the music segments of “The Tonight Show” with Jay Leno, making history as the first visual artist ever commissioned to create original scenic art. He also made basketball history in 1992 by painting a 6000 sq. ft. mural directly on UCLA’s center court at Pauley Pavilion for MTV’s Rock and Jock B-Ball Jam. His famous “Fear No Art” button has been sold continuously at LACMA since 1985 and was once carried in over 300 museums.'
    ],
    socials: [
      {
        classIcon: faTwitter,
        link: 'https://twitter.com/miripolsky'
      },
      {
        classIcon: faArrowRight,
        link: 'https://www.miripolsky.com/',
        classLink: 'arrrow-right'
      }
    ]
  },
  {
    chain: '0x7849194dD593d6c3aeD24035D70B5394a1C90F8F',
    nameTeammate: 'RAIR Technologies',
    imageUrl: Teammate_4,
    aboutTeammate: [
      `RAIR is a blockchain — based digital rights management platform that uses NFTs to gate access to streaming content. Data monopolies like Amazon, YouTube, Google, Apple, and Netflix charge onerous fees, offer opaque analytics, and can change their terms of service at any time locking out creators and users alike. DIY distribution meanwhile offers no protection, and cannot help package works into a scarce, valuable, tradeable framework.`,
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
