import React from "react";
import cl from "./VideoPlayerView.module.css";
import playImages from "../../../../SplashPage/images/playImg.png";

function VideoPlayerView() {
  return (
    <div className={cl.VideoPlayerViewWrapper}>
      <div className={cl.ListOfVideosWrapper}>
        <div className={cl.ListOfVideosOneVideo}>
          <div className={cl.previewWrapper}>
            <span className={cl.preview}>Preview</span>
            <i style={{ color: `silver` }} className="fas fa-key" />
          </div>
          <div className={cl.play}>
            <button
              style={{ border: "none", background: "none", transform: 'scale(0.2)' }}
              className=""
            >
              <img src={playImages} alt="Play" />
            </button>
          </div>
          <div className={cl.description}>
              <strong>Title</strong>
              <span className={cl.duration}>00:00:00</span>
          </div>
        </div>
      </div>
      <div className={cl.SingleVideoWrapper}></div>
    </div>
  );
}

export default VideoPlayerView;
