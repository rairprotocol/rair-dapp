
import "./VideoPlayer.css"
import ShowVideoToLoggedInUsers from "./ShowVideoToLoggedInUsers";

const VideoPlayerModule = ({backgroundImage, videoData}) => {
    const {videoTitle, videoModuleDescription, videoModuleTitle, video, baseURL, mediaId, demo} = videoData
    return (
      <div className="video-module-wrapper">
          <h3
          className="video-module-title"
          >
          {videoModuleTitle}
          </h3>
          <div className="video-module">
            <ShowVideoToLoggedInUsers
              {...{
                backgroundImage,
                video,
                baseURL,
                mediaId,
                videoTitle,
                demo
              }}/>
          </div>
          <div className="video-module-desc-wrapper">
          <span
              className="video-module-desc"
          >
              {videoModuleDescription}
          </span>
          </div>
      </div>
    )
}

export default VideoPlayerModule;
