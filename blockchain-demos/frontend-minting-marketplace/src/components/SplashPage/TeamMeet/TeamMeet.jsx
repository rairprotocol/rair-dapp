import React from 'react'

const TeamMeet = ({ Teammate_1, Teammate_2, Teammate_3, Teammate_4 }) => {
    return (
        <div className="splash-team">
            <div className="title-team">
                <h3>Meet the <span className="text-gradient">Team</span></h3>
            </div>
            <div className="meet-team">
                <div className="box-teammate">
                    <div className="img-teammate">
                        <img src={Teammate_1} alt="photo" />
                    </div>
                    <div className="position-teammate">
                        <div className="temmate-content-up">
                            <h4>Mr. Lee</h4>
                            <div className="teammate-description">
                                <p>
                                    Mr. Lee, is an American record producer and entrepreneur from Houston,
                                    Texas. He has produced several albums, which achieved platinum and gold
                                    status, such as Scarface's My Homies, 2Pac's Still I Rise, Paul Wall's The
                                    Peoples Champ. He was one of the in-house producers of Rap-A-Lot Records,
                                    and a founder and CEO of Noddfactor Entertainment.
                                </p>
                                <p>
                                    Mr Lee. worked closed with Nipsey on his 2018 album Victory Lap.
                                </p>
                            </div>
                        </div>
                        <div className="box-socials">
                            <span className="text-gradient"><i className="fab fa-twitter"></i></span>
                            <span className="text-gradient"><i className="fab fa-linkedin-in"></i></span>
                        </div>
                    </div>
                </div>
                <div className="box-teammate">
                    <div className="img-teammate">
                        <img src={Teammate_2} alt="photo" />
                    </div>
                    <div className="position-teammate">
                        <div className="temmate-content-up">
                            <h4>Samiel Asghedom “Blacc Sam”</h4>
                            <div className="teammate-description">
                                <p>
                                    Samiel Asghedom otherwise known as Blacc Sam is a Los Angeles native,
                                    Eritrean man who serves the community and approaches life like a business
                                    tycoon. Sam’s ability to hustle serves as an inspiration to his peers
                                    and those that are aware of his story. He represents young black men
                                    who are able to transcend from their starting point all while managing
                                    to stay local and positively impact the community. It is easy to see
                                    how Samiel operates as a man when you look at who his younger brother
                                    is, Nipsey Hussle. Hussle said that Blacc Sam is one of the most influential
                                    hustlers that he ever experienced in life. It’s easy to conclude that
                                    those are powerful words when taking into consideration the way Nipsey
                                    Hussle approached life and how he applied himself in every aspect.
                                </p>
                            </div>
                        </div>
                        <div className="box-socials">
                            <span className="text-gradient"><i className="fab fa-twitter"></i></span>
                            <span className="text-gradient"><i className="fab fa-linkedin-in"></i></span>
                        </div>
                    </div>
                </div>
                <div className="box-teammate">
                    <div className="img-teammate">
                        <img src={Teammate_3} alt="photo" />
                    </div>
                    <div className="position-teammate">
                        <div className="temmate-content-up">
                            <h4>JP</h4>
                            <div className="teammate-description">
                                <p>
                                    For content owners, record labels, and distributors,
                                    Southwest Digital offers a complete ecosystem for the digital
                                    music cycle that optimizes your business processes. With headquarters
                                    in Houston and Los Angeles, we manage thousands of tracks with
                                    superb digital supply chain integration and dynamic marketing and promotion.
                                </p>
                            </div>
                        </div>
                        <div className="box-socials">
                            <span className="text-gradient"><i className="fab fa-twitter"></i></span>
                            <span className="text-gradient"><i className="fab fa-linkedin-in"></i></span>
                        </div>
                    </div>
                </div>
                <div className="box-teammate">
                    <div className="img-teammate">
                        <img src={Teammate_4} alt="photo" />
                    </div>
                    <div className="position-teammate">
                        <div className="temmate-content-up">
                            <h4>Robert Guillerman</h4>
                            <div className="teammate-description">
                                <p>
                                    RAIR is a blockchain-based digital rights management platform that
                                    uses NFTs to gate access to streaming content.Data monopolies like Amazon,
                                    YouTube, Google, Apple, and Netflix charge onerous fees, offer opaque analytics,
                                    and can change their terms of service at any time locking out creators
                                    and users alike.  DIY distribution meanwhile offers no protection, and cannot
                                    help package works into a scarce, valuable, tradeable framework.

                                </p>
                                <p>
                                    RAIR, through its decentralized key management node system, empowers
                                    anyone to create unique, controllable, and transferable digital assets
                                    tied to the actual underlying content.
                                </p>
                            </div>
                        </div>
                        <div className="box-socials">
                            <span className="text-gradient"><i className="fab fa-twitter"></i></span>
                            <span className="text-gradient"><i className="fab fa-linkedin-in"></i></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TeamMeet
