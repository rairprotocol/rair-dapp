import React from 'react'

const TeamMeet = ({Teammate_1,Teammate_2}) => {
    return (
        <div className="splash-team">
            <div className="title-team">
                <h3>Meet <span className="text-gradient">the</span> Team</h3>
            </div>
            <div className="meet-team">
                <div className="box-teammate">
                    <div className="img-teammate">
                        <img src={Teammate_1} alt="photo" />
                    </div>
                    <div className="position-teammate">
                        <h4>Frank Castle • Position</h4>
                        <div className="teammate-description">
                            <p>
                                Duis aute irure dolor in reprehenderit in voluptate velit esse
                                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                                cupidatat non proident, sunt in culpa qui officia deserunt mollit
                                anim id est laborum. Duis aute irure dolor in reprehenderit in
                                voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                                officia deserunt mollit anim id est laborum. Duis aute irure dolor
                                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                                nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
                                in culpa qui officia deserunt mollit anim id est laborum. Duis aute
                                irure dolor in reprehenderit in voluptate velit esse cillum.
                            </p>
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
                        <h4>Dylan Spikes • Position</h4>
                        <div className="teammate-description">
                            <p>
                                Duis aute irure dolor in reprehenderit in voluptate velit esse
                                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                                cupidatat non proident, sunt in culpa qui officia deserunt mollit
                                anim id est laborum. Duis aute irure dolor in reprehenderit in
                                voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                                officia deserunt mollit anim id est laborum. Duis aute irure dolor
                                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                                nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
                                in culpa qui officia deserunt mollit anim id est laborum. Duis aute
                                irure dolor in reprehenderit in voluptate velit esse cillum.
                            </p>
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
