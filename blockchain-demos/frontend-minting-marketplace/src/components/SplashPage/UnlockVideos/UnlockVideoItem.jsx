import React from 'react'

const UnlockVideoItem = ({typeVideo, nameVideo, timeVideo, UnlockableVideo, locked, primaryColor}) => {
    return (
        <div className="box-video">
            <div
                className="video-locked"
                style={{ background: `${primaryColor === "rhyno" ? "#fff" : "#4E4D4DCC"}` }}
            >
                <div style={{ position: "relative" }}>
                    <div className="video-icon">
                        {locked ? <i className="fas fa-key" aria-hidden="true"></i> : <i className="fa fa-lock"></i>}
                        <p>{typeVideo}</p>
                    </div>
                    <img src={UnlockableVideo} alt="unlockble video" />
                </div>
                <div className="video-description">
                    <div className="video-title">
                        <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#fff"}` }}>{nameVideo}</p>
                    </div>
                    <div className="video-timer">
                        <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>{timeVideo}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UnlockVideoItem
