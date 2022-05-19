//@ts-nocheck
import React from 'react';
import Teammate_1 from '../images/mrlee.jpeg';
import Teammate_2 from '../images/foundation.png';
import Teammate_3 from '../images/south-dig.png';
import Teammate_4 from '../images/rair-block.png';
import Teammate_5 from '../images/movementontheground.png';
import Teammate_6 from '../images/immersiverse_logo.png';
import Teammate_7 from '../images/UkrainianAmericanCons/15724868_10208080805993720_1581371147497725224_o.jpeg';
import Teammate_8 from '../images/slidelock_team.png';
import Teammate_VV from '../images/vv_Rair_logo.png'
import NFTLA_ICON from '../images/NFTLA_icon.png'
// import TCC_ICON from '../images/TCC_icon.png'
import Estate_Teammate from '../images/estate_team.png';
import Teammate from './Teammate';
import GreymanAuthor from '../images/greymanAuthor.png';
import Ed from '../../AboutPage/assets/Ed.jpeg';
import Garrett from '../../AboutPage/assets/GARRETT.jpeg';
import Gunther from '../../AboutPage/assets/Gunther.jpeg';
import Martin from '../../AboutPage/assets/Martin.jpeg';
import MICHAEL from '../../AboutPage/assets/MICHAEL.jpg';
import JULIA from '../../AboutPage/assets/JULIA.jpg';
import David from '../../AboutPage/assets/David.jpeg';
// import Sonnenfeld from '../../AboutPage/assets/Seth.jpeg';
import Matthew from '../../AboutPage/assets/Matthew.jpg';
import NutTeam from '../images/nuts-teammate.jpeg';

const teamArray = [
    {
        nameTeammate: "Mr.Lee",
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
                classIcon: 'fab fa-twitter',
                link: 'https://twitter.com/mrlee713'
            },
            {
                classIcon: 'fab fa-instagram',
                link: 'https://www.instagram.com/mrlee713/'
            }
        ]
    },
    {
        nameTeammate: "John Patillo",
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
                classIcon: 'fab fa-linkedin-in',
                link: 'https://www.linkedin.com/in/johnpatillo/'
            },
            {
                classIcon: 'fab fa-instagram',
                link: 'https://www.instagram.com/mrjfpster/?hl=en'
            }
        ]
    },
    {
        nameTeammate: "Neighborhood Nip Foundation",
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
                classIcon: 'fas fa-arrow-right',
                link: 'https://www.facebook.com/neighborhoodnipfoundation/',
                classLink: "arrrow-right"
            },
        ]
    },
    {
        nameTeammate: "Southwest Digital",
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
                classIcon: 'fas fa-arrow-right',
                link: 'https://swdd.io',
                classLink: "arrrow-right"
            }
        ]
    },
    {
        nameTeammate: "RAIR Technologies",
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
                classIcon: 'fas fa-arrow-right',
                link: 'https://rair.tech',
                classLink: "arrrow-right"
            }
        ]
    }
]

const teamAboutRair = [
    {
        nameTeammate: "Ed Prado | Chief Executive Officer",
        imageUrl: Ed,
        aboutTeammate: [
            `Deep financial technology experience, having created the world’s
            first online bond trading platform, and owned two investment banks
            (broker dealers) which were active in the trading and underwriting 
            of securities with volumes in the billions. Deep familiarity with consumer
            and investor protection laws, KYC/AML guidelines, and the fintech 
            transaction landscape. Serial entrepreneur with strong operational
            acumen.`
        ],
        socials: [
            {
                classIcon: 'fab fa-linkedin-in',
                link: 'https://www.linkedin.com/in/ed-prado-a8526a4/',
                classLink: ""
            }
        ]
    },
    {
        nameTeammate: "Garrett Minks | Chief Technical Officer",
        imageUrl: Garrett,
        aboutTeammate: [
            `Deep expertise in distributed ledger technologies and their unique token 
            economic incentive frameworks. An early adopter of blockchain innovations,
            digital collectibles, and DLT based media platforms. After writing his 
            first book on distributed technologies, he realized no viable publishing
            platform using next wave distributed technologies existed where content
            could be sold and resold via immutable ledger tokens. Instead of using 
            Kindle Direct Publishing and giving the majority of proceeds to a predatory
            intermediary, RAIR was born.
            `
        ],
        socials: [
            {
                classIcon: 'fab fa-linkedin-in',
                link: 'https://www.linkedin.com/in/garrettminks/',
                classLink: ""
            }
        ]
    },
    {
        nameTeammate: "Gunther Sonnenfeld | Chief Strategy Officer",
        imageUrl: Gunther,
        aboutTeammate: [
            `Serial entrepreneur with deep technology, corporate and digital product
            experience having successfully built and operated companies with executive 
            stints at large multinational companies such as Omnicom Group, and with 
            customers such as Expedia, Orange, the UN, Unilever, Apple, Toyota, Bank
            of America, special project experience with the likes of Facebook,
            Google, YouTube and Amazon, as well as domain-relevant work with the
            likes of Virgin Media Group, Revolt TV, Hulu and Ustream. Advisor to 
            the U.S. and Australian governments on technology innovation, specifically
            around cryptography and digital security applications. Co-developer of t
            he world’s first Bitcoin POS (point of sale) system, co-developer of Skype’s small 
            business network coefficiency model, and a recipient of a Forrester Groundswell
            Award for groundbreaking social analytics work with Adobe. Part of teams that
            resulted in several exits.
            `
        ]
    },
    {
        nameTeammate: "Martin Casado | Chief Design Officer",
        imageUrl: Martin,
        aboutTeammate: [
            `Extensive expertise in conceptual design in functionality and aesthetics. 
            Bridging the gap between what the users want and how markets visualize what
            is economically attractive. Experienced in logistics protocols, specifically
            in building and planning technologies to facilitate the transport and 
            supply chain functions of both physical and digital goods. Built one of
            the first tracking and logistics integration applications for an 
            international shipping company.
            `
        ],
        socials: [
            {
                classIcon: 'fab fa-linkedin-in',
                link: 'https://www.linkedin.com/in/martin-casado-484b353/',
                classLink: ""
            }
        ]
    }
];

const rairAdvisorsTeam = [
    {
        nameTeammate: "Michael Terpin  | Strategic Advisor + Investor",
        imageUrl: MICHAEL,
        aboutTeammate: [
            `Michael Terpin is perhaps best known for founding Marketwire, which was funded by Sequoia
            Capital in 2000, then sold in 2006. Today, Michael is a pioneering investor and adviser 
            to a multitude of blockchain, media, and technology companies, including ShapeShift, 
            Bancor, Purse.io, and GoCoin. Michael's Transform Group, with over 50 ICOs done and 
            counting, is the world leader in blockchain + ICO public relations and advisory services.
            In 2013, he also co-founded two of the now most influential brands in cryptocurrency: 
            CoinAgenda and BitAngels. CoinAgenda was the first-ever conference for Bitcoin investors
            and is now the one place where the world's most knowledgeable cryptocurrency investors 
            meet to exchange information.`,

            `BitAngels was the first angel group for cryptocurrency investments. This was
            followed in early 2014 by the BitAngels Dapps Fund with David Johnston, 
            which was the first digital currency fund ($6 million raised entirely in cryptocurrency).
            Additionally, Terpin, along with Gil Penchina and Nick Sullivan, co-founded the Bitcoin 
            syndicate as part of Flight VC. He also co-founded e-commerce Bitcoin company incubator,
            bCommerce Labs, in 2015. In 2017, he joined Alphabit Fund, a $300 million digital
            currency fund, as special advisor, CMO and head of their ICO investment committee.
            RAIR is proud to have Michael as the strategic investment lead in its efforts 
            to solve the problem of digital ownership.`
        ],
        socials: [
            {
                classIcon: 'fab fa-linkedin-in',
                link: 'https://www.linkedin.com/in/michaelterpin/',
                classLink: ""
            }
        ]
    },
    {
        nameTeammate: "Julia Yan  | Strategic Advisor",
        imageUrl: JULIA,
        aboutTeammate: [
            `Julia is a growth leader focused on consumer product, tech and media. Her experience 
            in building growth engines and scaling product adoption from zero to one enabled companies 
            like Amazon and TikTok to achieve unprecedented hyper growth. She is currently the Head of 
            Growth at TikTok and has been in the position since 2018.
            Prior to TikTok, Julia was a product marketing leader at Amazon focusing on global 
            e-commerce marketplace expansion and product growth for the Alexa Echo device family. 
            Julia started her career in consulting, providing strategic solutions for clients across 
            private and public sectors at Deloitte and PwC.
            Julia is also passionate about growing the Web3 space. She connects innovative and creative 
            minds with the right communities to help reach their potentials and maximize impact.`
        ],
        socials: [
            {
                classIcon: 'fab fa-linkedin-in',
                link: 'https://www.linkedin.com/in/juliayan',
                classLink: ""
            }
        ]
    },
    {
        nameTeammate: "David Jensen  |  Strategic Advisor + Investor",
        imageUrl: David,
        aboutTeammate: [
            `David Jensen is an award-winning experience designer, futurist, and
            innovator who always asks, “What if?” Currently, he is authoring a 
            book/podcast entitled “Structured Mischief” exploring the intersection
            of blockchain, design-centered thinking, and crypto-tech.`,

            `Previously, David led EY’s Global Disruptive Innovation business and 
            the creation of EY’s WAVESPACE innovation and experience network. Working
            at the intersection of innovation, technology, and design, he is a thought
            leader in the areas of experience design, radical growth, augmented media 
            reality, artificial intelligence/machine learning, streaming data, and digital transformation.
            He orchestrates experiences and interactive product design across industries and 
            business futures; all of this, he calls Structured MischiefTM.”`,

            `He is a two-time Primetime Emmy award winner and has been elected to the Hollywood 
            Reporter Digital 50, served on industry boards and organizations including Vice-Chair
            of the Producers Guild of America and Governor of the Academy of Television Arts 
            and Sciences.`,

            `He has been recognized as an architect, storyteller, innovator, and entrepreneur across
            the fields of design, innovation, technology, digital media, advertising, and television.`,

            `Trained as an architect and filmmaker, he began his career working with architects
            Richard Meier and Zaha Hadid, combining physical space with media and technology
            to create “experience spaces.” He holds a MArch from Harvard University; CE
            Leadership from Harvard Business School, and BArch from the University of
            Houston.
            `,
        ],
        socials: [
            {
                classIcon: 'fab fa-linkedin-in',
                link: 'https://www.linkedin.com/in/davidnjensen/',
                classLink: ""
            }
        ]
    },
    // {
    //     nameTeammate: "Gunther Sonnenfeld CSO",
    //     imageUrl: Sonnenfeld,
    //     aboutTeammate: [
    //         `Two-time Emmy® Award winner Seth Shapiro is a global leader in media and
    //         technology. He has worked on projects with partners including AT&T, Betfair
    //         UK, Comcast, De Telegraaf, DIRECTV, Disney, Goldman Sachs, Intel, IPG, IBM,
    //         NBC, Neo Cricket Mumbai, Nokia, RTL, SBS, Seachange, Showtime, Sun Microsystems,
    //         SVT Sweden, Telstra, Time Warner Cable, Turner Networks and Universal Pictures.`,

    //         `An Adjunct Professor at USC’s School of Cinematic Arts, he served previously
    //         as a Governor at the Televison Academy (home of the Emmy’s) and a two-term
    //         member of its Executive Committee. He is author of TELEVISION: Innovation,
    //         Disruption, and the World’s Most Powerful Medium, an Amazon bestseller.`,

    //         `An early proponent of blockchain technology , he is Entrepreneur in Residence
    //         at Alphabit Fund, a fully-regulated digital currency hedge fund in the U.K.
    //         with $400m AUM.`,

    //         `Mr Shapiro has consulted on media matters before both the FCC and the Department
    //         of Justice. His opinions have been quoted in The Economist, The New York Times,
    //         CNBC, The LA Times, The Boston Globe, Bloomberg, The Associated Press, PBS and
    //         The Daily Mail UK. As Head of Production at DIRECTV Advanced Services, he 
    //         oversaw over 25 service launches, including TiVo by DIRECTV, the world’s
    //         first major DVR platform.`
    //     ]
    // },
    {
        nameTeammate: "Matthew A. Neco  |  Strategic Advisor ",
        imageUrl: Matthew,
        aboutTeammate: [
            `Matt is a business and technology lawyer and mediator with depth and
            breadth in law. Over the course of more than 25 years, he has worked 
            on deals, dispute resolution, bankruptcies, and many aspects of starting,
            running, growing, and buying and selling businesses and assets, with a 
            focus on tech and intellectual property, among other areas. Entrepreneurial,
            he co-founded a music-related tech start-up. He segued into in-house general
            counsel roles, primarily in new and disruptive tech, more than 15 years 
            ago, including in decentralized P2P media distribution apps and ad tech,
            a UGC and publisher growth-stage tech start-up acquired by Intuit, and 
            an ad-tech company with multiple consumer apps (including P2P) also acquired
            by a public company. He is involved in blockchain, NFTs, and De-Fi. Matt
            has been product counsel for many apps, SaaS, and web and mobile sites 
            and platforms, including compliance with HIPPA, DMCA, CDA 230, and ADA.`,

            `Matt managed high-stakes copyright litigation through the U.S. Supreme Court. 
            He taught IP Licensing law at Pepperdine Law School. He has worked closely and 
            extensively with outside counsel and effectively managed multiple millions of 
            dollars of focused legal spending. He prepares and takes an entity smoothly 
            through financing and M&A deals with outside and co-counsel. Matt has negotiated,
            drafted, reviewed, revised, and worked on successfully implementing and fulfilling 
            countless contracts and licenses (in and out-bound), MSAs, Terms, Conditions,
            Privacy Policies, and internal policies, guidelines, and procedures, and as a 
            C-Suite member works closely with other executives, as well as developers 
            (including on IP issues involving open-source software) and with other teams 
            (sales, bus dev., HR, customer satisfaction, etc.) to close business deals, 
            and help the business excel.`,

            `Matt is strong at win-win outcomes, dispute mitigation, avoidance, and resolution
            counsel. He produces actionable, understandable items and measured advice, and 
            has experience in ambassadorial reputation management, Board of Directors work,
            including meeting preparation, participation, counseling, and Corporate Secretary
            work. Matt has extensive legal strategy, tactics, and execution experience within
            fast-growing, disruptive, technology companies, strong business judgment, 
            operational experience, and cultural values, and partners well with all levels 
            of management, business, and technology teams. Matt is driven to contribute to,
            and motivated by, outstanding leadership, products and services, and customer-oriented
            values and commitments to teamwork, diversity, equality and inclusion. 
            
            (As an outside “advisor” Matt does not provide legal services or advice to RAIR 
            Tech, investors, business partners, etc., particularly, but not exclusively, 
            with regard to laws or regulatory requirements regarding investments, investment
            vehicles, securities, AML, KYC, CFT, MSBs, and blockchain entities, technologies,
            and tokens. RAIR engages other outside counsel.)`
        ],
        socials: [
            {
                classIcon: 'fab fa-linkedin-in',
                link: 'https://www.linkedin.com/in/mattneco/',
                classLink: ""
            }
        ]
    }
];

const teamGreymanArray = [
    {
        chain: '0x7bfbAAC8b6bC1B7b9e4bEB5c1d92C913B9598465',
        nameTeammate: "Dadara",
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
                classIcon: 'fab fa-twitter',
                link: 'https://twitter.com/Dadaratopia'
            }
        ]
    },
    {   
        chain: '0x4704DC390a5779fECfD77bd0852bF826569e028e',
        nameTeammate: "Movement on the Ground",
        imageUrl: Teammate_5,
        aboutTeammate: [
            `Movement on the Ground is a grassroot NGO that believes every human being affected by war, conflict or disaster, has the right to rebuild a new life in safety, dignity and full potential. 
            Founded in 2015 by a group of creative entrepreneurs who were compelled to act during the unfolding Syrian refugee crisis in Europe, MOTG since then has always found innovative ways to positively impact the situation on the ground. From bringing in knowledge and expertise from the music festival industry to the crisis management of refugee camps, to setting up “Digital Learning labs” to educate digital skills to asylum seekers in order to kickstart a future. MOTG has always been a group of different thinkers at the forefront of unlocking human potential for good.`,
            
            `Throughout its 5 years presence on the Greek island Lesvos, MOTG was able to develop its blueprint model “from camp to campUs”. At the core of this holistic model is the empowerment of refugees in their independece and self-reliance and their preperation for integration in their host environment. Acces to mental health, education, technology, sports and art play a crucial role in the CampUs. 
            `
        ],
        socials: [
            {
                classIcon: 'fas fa-arrow-right',
                link: 'https://movementontheground.com/',
                classLink: "arrrow-right"
            }
        ]
    },
    {
        chain: `0x7849194dD593d6c3aeD24035D70B5394a1C90F8F`,
        nameTeammate: "RAIR Technologies",
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
                classIcon: 'fas fa-arrow-right',
                link: 'https://rair.tech',
                classLink: "arrrow-right"
            }
        ]
    }
];

const teamUkraineArray = [
    {   
        chain: '0xFC9E791955AeDB8dbAd1Be054f82720c8bDbf582',
        nameTeammate: "Ukrainian American Coordinating Council",
        imageUrl: Teammate_7,
        aboutTeammate: [
            "Please, join the Ukrainian-American Cultural Association of Oregon & SW Washington and the Ukrainian American Coordinating Council in raising money to fund medical supplies to Ukraine. As soon as funds will arrive in their bank accounts, they transfer it to Come Back Alive fund, Ukrainian Government Medical Fund, Ukrainian Refugee Fund and fund containers with medical supplies to Ukrainian hospitals. The Ukrainian community in Oregon and SW Washington has been shipping medical supplies to Ukraine since 2014. They have shipped 5 medical containers and hundreds of boxes of medical supplies generously donated by Medical Teams International. They are grateful to MTI for their donations, and to local volunteers who work with MTI to receive and repackage donations as well as volunteers in Ukraine who distribute these donations to hospitals and mobile clinics there. We ask for your support in helping pay for the shipment of these supplies from warehouses in Oregon and SW Washington to Ukraine. Any amount helps. UACC regularly posts pictures of previous shipments and will keep updating their fb fundraiser pages with pictures of medical shipment (or shipments!) your contributions help fund. Thank you! Дякуємо!"
        ],
        socials: [
            {
                classIcon: 'fab fa-facebook',
                link: 'https://www.facebook.com/UACCusa/',
            },
            {
                classIcon: 'fas fa-arrow-right',
                link: 'https://uaccusa.org/',
                classLink: "arrrow-right"
            }
        ]
    },
    {
        chain: `0x7849194dD593d6c3aeD24035D70B5394a1C90F8F`,
        nameTeammate: "RAIR Technologies",
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
                classIcon: 'fas fa-arrow-right',
                link: 'https://rair.tech',
                classLink: "arrrow-right"
            }
        ]
    }
];

const teamVaporVerseArray = [
    {
        chain: null,
        nameTeammate: "RAIR Technologies",
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
                classIcon: 'fas fa-arrow-right',
                link: 'https://rair.tech',
                classLink: "arrrow-right"
            }
        ]
    }
];

const teamNFTLAarray = [
    {   
        chain: '',
        nameTeammate: "NFT LA",
        imageUrl: NFTLA_ICON,
        aboutTeammate: [
            `NFT | LA is an integrated conference experience: an epic IRL conference fused with an immersive Metaverse integrations and L.A's robust nightlife scene. Explore the city of angels and journey into its new role as a global conduit for the adoption of web3 in of sports, music, art, and entertainment.`
        ],
        socials: [
            {
                classIcon: 'fas fa-arrow-right',
                link: 'https://www.nftla.live/',
                classLink: "arrrow-right"
            }
        ]
    },

    {
        chain: ``,
        nameTeammate: "RAIR Technologies",
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
                classIcon: 'fas fa-arrow-right',
                link: 'https://rair.tech',
                classLink: "arrrow-right"
            }
        ]
    }
];

const teamImmersiverseArray = [
    {   
        chain: '',
        nameTeammate: "ImmersiVerse",
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
                classIcon: 'fas fa-arrow-right',
                link: 'http://iverse.events',
                classLink: "arrrow-right"
            }
        ]
    },
    {
        chain: ``,
        nameTeammate: "RAIR Technologies",
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
                classIcon: 'fas fa-arrow-right',
                link: 'https://rair.tech',
                classLink: "arrrow-right"
            }
        ]
    }
];

const teamNutArray = [
    {
        nameTeammate: "MC Cranksy",
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
        nameTeammate: "RAIR Technologies",
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
                classIcon: 'fas fa-arrow-right',
                link: 'https://rair.tech',
                classLink: "arrrow-right"
            }
        ]
    }
];

const teamSlideLockArray = [
    {   
        chain: '',
        nameTeammate: "Slidelock",
        imageUrl: Teammate_8,
        aboutTeammate: [
            "Slidelock provides encrypted data streams for sharing important internal documentation securely. Slidelock utilizes the Ethereum ecoystem to provide encrypted streaming access. Metamask for distributed authentication. Polygon NFTs for low cost credentialing. Ethereum NFTs for high value credentialing. "
        ],
        socials: [
            {
                classIcon: 'fab fa-facebook',
                link: '',
            },
            {
                classIcon: 'fas fa-arrow-right',
                link: '',
                classLink: "arrrow-right"
            }
        ]
    },
    {
        chain: `0x7849194dD593d6c3aeD24035D70B5394a1C90F8F`,
        nameTeammate: "RAIR Technologies",
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
                classIcon: 'fas fa-arrow-right',
                link: 'https://rair.tech',
                classLink: "arrrow-right"
            }
        ]
    }
];

const NutsTeamComponent = ({ primaryColor }) => {
    return (
        <>
            {
                teamNutArray.map((t, index) => {
                    return <Teammate
                        key={index + t.nameTeammate}
                        name={t.nameTeammate}
                        desc={t.aboutTeammate}
                        socials={t.socials}
                        primaryColor={primaryColor}
                        url={t.imageUrl}
                    />
                })
            }
        </>
    )
}

const NipseyTeamComponent = ({ primaryColor }) => {
    return (
        <>
            {
                teamArray.map((t, index) => {
                    return <Teammate
                        key={index + t.nameTeammate}
                        name={t.nameTeammate}
                        desc={t.aboutTeammate}
                        socials={t.socials}
                        primaryColor={primaryColor}
                        url={t.imageUrl}
                    />
                })
            }
        </>
    )
}

const UkraineGlitchComponent = ({ primaryColor }) => {
    return (
        <div className="splash-team-greyman">
            {
                teamUkraineArray.map((t, index) => {
                    return <Teammate
                        key={index + t.nameTeammate}
                        name={t.nameTeammate}
                        chain={t.chain}
                        desc={t.aboutTeammate}
                        socials={t.socials}
                        primaryColor={primaryColor}
                        url={t.imageUrl}
                    />
                })
            }
        </div>
    )
}

const VaporVerseComponent = ({ primaryColor }) => {
    return (
        <div className="splash-team-greyman">
            {
                teamVaporVerseArray.map((t, index) => {
                    return <Teammate
                        key={index + t.nameTeammate}
                        name={t.nameTeammate}
                        chain={t.chain}
                        desc={t.aboutTeammate}
                        socials={t.socials}
                        primaryColor={primaryColor}
                        url={t.imageUrl}
                    />
                })
            }
        </div>
    )
}

const SlideLockComponent = ({ primaryColor }) => {
    return (
        <div className="splash-team-greyman">
            {
                teamSlideLockArray.map((t, index) => {
                    return <Teammate
                        key={index + t.nameTeammate}
                        name={t.nameTeammate}
                        chain={t.chain}
                        desc={t.aboutTeammate}
                        socials={t.socials}
                        primaryColor={primaryColor}
                        url={t.imageUrl}
                    />
                })
            }
        </div>
    )
}


const GreyManTeamComponent = ({ primaryColor }) => {
    return (
        <div className="splash-team-greyman">
            {
                teamGreymanArray.map((t, index) => {
                    return <Teammate
                        key={index + t.nameTeammate}
                        name={t.nameTeammate}
                        chain={t.chain}
                        desc={t.aboutTeammate}
                        socials={t.socials}
                        primaryColor={primaryColor}
                        url={t.imageUrl}
                    />
                })
            }
        </div>
    )
}

const NFTLATeamComponent = ({ primaryColor }) => {
    return (
        <div className="splash-team-greyman">
            {
                teamNFTLAarray.map((t, index) => {
                    return <Teammate
                        key={index + t.nameTeammate}
                        name={t.nameTeammate}
                        chain={t.chain}
                        desc={t.aboutTeammate}
                        socials={t.socials}
                        primaryColor={primaryColor}
                        url={t.imageUrl}
                    />
                })
            }
        </div>
    )
}

const ImmersiVerseTeamComponent = ({ primaryColor }) => {
    return (
        <div className="splash-team-greyman">
            {
                teamImmersiverseArray.map((t, index) => {
                    return <Teammate
                        key={index + t.nameTeammate}
                        name={t.nameTeammate}
                        chain={t.chain}
                        desc={t.aboutTeammate}
                        socials={t.socials}
                        primaryColor={primaryColor}
                        url={t.imageUrl}
                    />
                })
            }
        </div>
    )
}

const RairTeamComponent = ({ primaryColor }) => {
    return (
        <>
            {
                teamAboutRair.map((t, index) => {
                    return <Teammate
                        key={index + t.nameTeammate}
                        name={t.nameTeammate}
                        socials={t.socials}
                        desc={t.aboutTeammate}
                        primaryColor={primaryColor}
                        url={t.imageUrl}
                    />
                })
            }
        </>
    )
}

const RairAdvisortComponent = ({ primaryColor }) => {
    return (
        <>
            {
                rairAdvisorsTeam.map((t, index) => {
                    return <Teammate
                        key={index + t.nameTeammate}
                        name={t.nameTeammate}
                        desc={t.aboutTeammate}
                        socials={t.socials}
                        primaryColor={primaryColor}
                        url={t.imageUrl}
                    />
                })
            }
        </>
    )
}

const TeamMeet = ({ primaryColor, arraySplash }) => {
    return (
        <div className="splash-team">
            <div className="title-team">
                {
                    arraySplash === "ukraine" && <h3> About the <span style={{color:"#035BBC"}}>Cause</span></h3>
                }
                {
                    arraySplash === "vaporverse" && <h3> mak0r </h3>
                }
                {
                    arraySplash === "slidelock" && <h3> Meet the <span style={{color:"#57B69C"}}>Team</span></h3>
                }
                {
                    arraySplash === "nipsey" && <h3>Meet the <span className="text-gradient">Team</span></h3>
                }
                {
                    arraySplash === "greyman" && <h3>About the <span className="text-gradient">Artist</span></h3>
                }
                {
                    arraySplash === "immersiverse" && <h3>About</h3>
                }
                {
                    arraySplash === "NFTLA" && <h3>About</h3>
                }
                {
                    arraySplash === "rair" && <h3>Meet the <span className="text-gradient">Team</span></h3>
                }
                {
                    arraySplash === "rair-advisors" && <h3>About our <span className="text-gradient">Advisors</span></h3>
                }
                {
                    arraySplash === "nuts" && <h3>Meet the <span className="text-gradient">Team</span></h3>
                }
            </div>
            <div className="meet-team">
                {
                    arraySplash === "ukraine" &&  <UkraineGlitchComponent />
                }
                {
                    arraySplash === "vaporverse" &&  <VaporVerseComponent />
                }
                {
                    arraySplash === "slidelock" &&  <SlideLockComponent />
                }
                {
                    arraySplash === "greyman" && <GreyManTeamComponent primaryColor={primaryColor} />
                }
                {
                    arraySplash === "immersiverse" && <ImmersiVerseTeamComponent primaryColor={primaryColor} />
                }
                {
                    arraySplash === "NFTLA" && <NFTLATeamComponent primaryColor={primaryColor} />
                }
                {
                    arraySplash === "nipsey" && <NipseyTeamComponent primaryColor={primaryColor} />
                }
                {
                    arraySplash === "rair" && <RairTeamComponent primaryColor={primaryColor} />
                }
                {
                    arraySplash === "rair-advisors" && <RairAdvisortComponent primaryColor={primaryColor} />
                }

                {
                    arraySplash === "nuts" && <NutsTeamComponent primaryColor={primaryColor} />
                }
            </div>
        </div>
    )
}

export default TeamMeet
