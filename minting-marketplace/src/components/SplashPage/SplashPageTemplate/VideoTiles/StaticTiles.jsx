import React from 'react';
import UnlockVideoItem from '../../UnlockVideos/UnlockVideoItem';
import "./StaticTiles.css"

const videoArr = [
    {
        typeVideo: "Sneak Preview Coming Soon",
        unlockVideoName: "Intro",
        timeVideo: "000:TBO:00",
        locked: true
    },
    {
        typeVideo: "ipseyverse Exclusive",
        unlockVideoName: "Track 2",
        timeVideo: "00:TBO:00",
        locked: false
    },
    {
        typeVideo: "ipseyverse Exclusive",
        unlockVideoName: "Track 3",
        timeVideo: "00:04:02",
        locked: false
    },
    {
        typeVideo: "ipseyverse Exclusive",
        unlockVideoName: "Track 3",
        timeVideo: "00:TBO:00",
        locked: true
    }
]

const StaticTiles = ({ title, UnlockableVideo, primaryColor }) => {
    return (
        <div 
            className="unlockble-video"
            style={{
                marginBottom:"108px",
                width: "100%"
            }}
        >
            <div 
                className="title-gets"
                style={{
                    textAlign: "center"
                }}
            >
                <h3> {title} </h3>
            </div>
            <div className="block-videos">
                {
                    videoArr.map(((video, index) => {
                        return <UnlockVideoItem
                            key={index + video.unlockVideoName}
                            UnlockableVideo={UnlockableVideo}
                            typeVideo={video.typeVideo}
                            nameVideo={video.unlockVideoName}
                            timeVideo={video.timeVideo}
                            locked={video.locked}
                            primaryColor={primaryColor}
                        />
                    }))
                }
            </div>
        </div>
    )
}

export default StaticTiles;