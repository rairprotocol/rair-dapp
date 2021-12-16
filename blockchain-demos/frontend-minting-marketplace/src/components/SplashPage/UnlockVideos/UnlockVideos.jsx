import React from 'react';
import UnlockVideoItem from './UnlockVideoItem';

const videoArr = [
    {
        typeVideo: "Free Preview",
        unlockVideoName: "Victory Lap",
        timeVideo: "00:03:23",
        locked: true
    },
    {
        typeVideo: "Nipseyverse Exclusive",
        unlockVideoName: "Dedication (featuring Kendrick Lamar)",
        timeVideo: "00:05:33",
        locked: false
    },
    {
        typeVideo: "Nipseyverse Exclusive",
        unlockVideoName: "Last Time That I Checc'd",
        timeVideo: "00:04:02",
        locked: false
    },
    {
        typeVideo: "Nipseyverse Exclusive",
        unlockVideoName: "Keyz 2 the City 2",
        timeVideo: "00:05:27",
        locked: true
    },
    {
        typeVideo: "Nipseyverse Exclusive",
        unlockVideoName: "Grinding All My Life",
        timeVideo: "00:03:23",
        locked: false
    },
    {
        typeVideo: "Nipseyverse Exclusive",
        unlockVideoName: "Million While You Young",
        timeVideo: "00:10:33",
        locked: false
    },
    {
        typeVideo: "Nipseyverse Exclusive",
        unlockVideoName: "Loaded Bases",
        timeVideo: "00:04:02",
        locked: false
    },
    {
        typeVideo: "Nipseyverse Exclusive",
        unlockVideoName: "Real Big",
        timeVideo: "00:05:27",
        locked: false
    }
]

const UnlockVideos = ({ UnlockableVideo, primaryColor }) => {
    return (
        <div className="unlockble-video">
            <div className="title-gets">
                <h3>Members only <span className="text-gradient">streaming</span></h3>
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

export default UnlockVideos
