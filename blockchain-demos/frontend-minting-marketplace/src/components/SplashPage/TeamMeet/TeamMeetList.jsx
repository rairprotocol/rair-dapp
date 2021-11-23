import React from 'react';
import Teammate_1 from './../images/mrlee.jpeg';
import Teammate_2 from './../images/blacc-sam.png';
import Teammate_3 from './../images/south-dig.png';
import Teammate_4 from './../images/rair-block.png';
import Teammate from './Teammate';
import GreymanAuthor from './../images/greymanAuthor.png';

const teamArray = [
    {
        nameTeammate: "Mr.Lee",
        imageUrl: Teammate_1,
        aboutTeammate: [
            `Mr. Lee, is an American record producer and entrepreneur from Houston, 
        Texas. He has produced several albums, which achieved platinum and gold 
        status, such as Scarface's My Homies, 2Pac's Still I Rise, Paul Wall's 
        The Peoples Champ. He was one of the in-house producers of Rap-A-Lot Records,
         and a founder and CEO of Noddfactor Entertainment.`,

            `Mr Lee. worked closed with Nipsey on his 2018 album Victory Lap.`
        ]
    },
    {
        nameTeammate: "Samiel Asghedom “Blacc Sam”",
        imageUrl: Teammate_2,
        aboutTeammate: [
            `Samiel Asghedom otherwise known as Blacc Sam is a Los Angeles native,
        Eritrean man who serves the community and approaches life like a business
        tycoon. Sam’s ability to hustle serves as an inspiration to his peers
        and those that are aware of his story. He represents young black men
        who are able to transcend from their starting point all while managing
        to stay local and positively impact the community. It is easy to see
        how Samiel operates as a man when you look at who his younger brother
        is, Nipsey Hussle. Hussle said that Blacc Sam is one of the most influential
        hustlers that he ever experienced in life. It’s easy to conclude that
        those are powerful words when taking into consideration the way Nipsey
        Hussle approached life and how he applied himself in every aspect.`
        ]
    },
    {
        nameTeammate: "JP",
        imageUrl: Teammate_3,
        aboutTeammate: [
            `For content owners, record labels, and distributors,
        Southwest Digital offers a complete ecosystem for the digital
        music cycle that optimizes your business processes. With headquarters
        in Houston and Los Angeles, we manage thousands of tracks with
        superb digital supply chain integration and dynamic marketing and promotion.`
        ]
    },
    {
        nameTeammate: "Robert Guillerman",
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
        ]
    }
]

const teamGreymanArray = [
    {
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
        ]
    }
];

const NipseyTeamComponent = ({ primaryColor }) => {
    return (
        <>
            {
                teamArray.map((t, index) => {
                    return <Teammate
                        key={index + t.nameTeammate}
                        name={t.nameTeammate}
                        desc={t.aboutTeammate}
                        primaryColor={primaryColor}
                        url={t.imageUrl}
                    />
                })
            }
        </>
    )
}

const GreyManTeamComponent = ({ primaryColor }) => {
    return (
        <>
            {
                teamGreymanArray.map((t, index) => {
                    return <Teammate
                        key={index + t.nameTeammate}
                        name={t.nameTeammate}
                        desc={t.aboutTeammate}
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
                    arraySplash === "nipsey" && <h3>Meet the <span className="text-gradient">Team</span></h3>
                }
                {
                    arraySplash === "greyman" && <h3>About the <span className="text-gradient">Artist</span></h3>
                }
            </div>
            <div className="meet-team">
                {
                    arraySplash === "greyman" && <GreyManTeamComponent primaryColor={primaryColor} />
                }
                {
                    arraySplash === "nipsey" && <NipseyTeamComponent primaryColor={primaryColor} />
                }
            </div>
        </div>
    )
}

export default TeamMeet
