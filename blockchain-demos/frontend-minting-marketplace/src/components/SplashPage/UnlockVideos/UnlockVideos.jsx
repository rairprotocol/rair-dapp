import React from 'react';

const UnlockVideos = ({ UnlockableVideo, primaryColor }) => {
    return (
        <div className="unlockble-video">
            <div className="title-gets">
                <h3>What <span className="text-gradient">you</span> get?</h3>
            </div>
            <div className="block-videos">
                <div className="box-video">
                    <div
                        className="video-locked"
                        style={{ background: `${primaryColor === "rhyno" ? "#fff" : "#4E4D4DCC"}` }}
                    >
                        <div style={{ position: "relative" }}>
                            <div className="video-icon">
                                <i className="fa fa-lock" aria-hidden="true"></i>
                                <p>Free Preview</p>
                            </div>
                            <img src={UnlockableVideo} alt="unlockble video" />
                        </div>
                        <div className="video-description">
                            <div className="video-title">
                                <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>Victory Lap </p>
                            </div>
                            <div className="video-timer">
                                <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>00:03:23</p>
                            </div>
                            <div className="video-key">
                                <i className="fas fa-key"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="box-video">
                    <div className="video-locked"
                        style={{ background: `${primaryColor === "rhyno" ? "#fff" : "#4E4D4DCC"}` }}>
                        <div style={{ position: "relative" }}>
                            <div className="video-icon">
                                <i className="fa fa-lock" aria-hidden="true"></i>
                                <p>Nipseyverse Exclusive</p>
                            </div>
                            <img src={UnlockableVideo} alt="unlockble video" />
                        </div>
                        <div className="video-description">
                            <div className="video-title">
                                <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>Dedication (featuring Kendrick Lamar)</p>
                            </div>
                            <div className="video-timer">
                                <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>00:03:23</p>
                            </div>
                            <div className="video-key">
                                <i className="fas fa-key"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="box-video">
                    <div className="video-locked"
                        style={{ background: `${primaryColor === "rhyno" ? "#fff" : "#4E4D4DCC"}` }}>
                        <div style={{ position: "relative" }}>
                            <div className="video-icon">
                                <i className="fa fa-lock" aria-hidden="true"></i>
                                <p>Nipseyverse Exclusive</p>
                            </div>
                            <img src={UnlockableVideo} alt="unlockble video" />
                        </div>
                        <div className="video-description">
                            <div className="video-title">
                                <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>Last Time That I Checc'd</p>
                            </div>
                            <div className="video-timer">
                                <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>00:03:23</p>
                            </div>
                            <div className="video-key">
                                <i className="fas fa-key"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="box-video">
                    <div className="video-locked"
                        style={{ background: `${primaryColor === "rhyno" ? "#fff" : "#4E4D4DCC"}` }}>
                        <div style={{ position: "relative" }}>
                            <div className="video-icon">
                                <i className="fa fa-lock" aria-hidden="true"></i>
                                <p>Nipseyverse Exclusive</p>
                            </div>
                            <img src={UnlockableVideo} alt="unlockble video" />
                        </div>
                        <div className="video-description">
                            <div className="video-title">
                                <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>Keyz 2 the City 2</p>
                            </div>
                            <div className="video-timer">
                                <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>00:03:23</p>
                            </div>
                            <div className="video-key">
                                <i className="fas fa-key"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="box-video">
                    <div className="video-locked"
                        style={{ background: `${primaryColor === "rhyno" ? "#fff" : "#4E4D4DCC"}` }}>
                        <div style={{ position: "relative" }}>
                            <div className="video-icon">
                                <i className="fa fa-lock" aria-hidden="true"></i>
                                <p>Nipseyverse Exclusive</p>
                            </div>
                            <img src={UnlockableVideo} alt="unlockble video" />
                        </div>
                        <div className="video-description">
                            <div className="video-title">
                                <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>Grinding All My Life</p>
                            </div>
                            <div className="video-timer">
                                <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>00:03:23</p>
                            </div>
                            <div className="video-key">
                                <i className="fas fa-key"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="box-video">
                    <div className="video-locked"
                        style={{ background: `${primaryColor === "rhyno" ? "#fff" : "#4E4D4DCC"}` }}>
                        <div style={{ position: "relative" }}>
                            <div className="video-icon">
                                <i className="fa fa-lock" aria-hidden="true"></i>
                                <p>Nipseyverse Exclusive</p>
                            </div>
                            <img src={UnlockableVideo} alt="unlockble video" />
                        </div>
                        <div className="video-description">
                            <div className="video-title">
                                <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>Million While You Young</p>
                            </div>
                            <div className="video-timer">
                                <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>00:03:23</p>
                            </div>
                            <div className="video-key">
                                <i className="fas fa-key"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UnlockVideos
