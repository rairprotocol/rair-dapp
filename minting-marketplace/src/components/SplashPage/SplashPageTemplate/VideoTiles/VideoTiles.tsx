//@ts-nocheck
import VideoTilesItem from './VideoTilesItem';
import "./VideoTiles.css";

const VideoTiles = ({ title, videoArr, primaryColor }) => {
    return (
        <div className="unlockable-video">
            <div className="title-gets">
                <h3> {title} </h3>
            </div>
            <div className="block-videos">
                {
                    videoArr.map(((video, index) => {
                        const {videoName, videoType, videoTime, videoSRC, baseURL, mediaId} = video;
                        return <VideoTilesItem
                            key={index + videoName}
                            videoType={videoType}
                            videoName={videoName}
                            videoTime={videoTime}
                            videoSRC={videoSRC}
                            baseURL={baseURL}
                            mediaId={mediaId}
                            primaryColor={primaryColor}
                        />
                    }))
                }
            </div>
        </div>
    )
}

export default VideoTiles;