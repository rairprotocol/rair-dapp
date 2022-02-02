import React, { useState } from "react";
import cl from "./VideoPlayerView.module.css";
import playImages from "../../../../SplashPage/images/playImg.png";
import { useHistory } from "react-router-dom";

function VideoPlayerView({ productsFromOffer }) {
  const [selectVideo, setSelectVideo] = useState(
    productsFromOffer[0]
  );
  const history = useHistory();

  console.log(productsFromOffer, "productsFromOffer");
  return (
    <div className={cl.VideoPlayerViewWrapper}>
      <div className={cl.ListOfVideosWrapper}>
        {productsFromOffer?.length &&
          productsFromOffer.map((data) => {
            return (
              <div
              key={data._id}
              onClick={() => setSelectVideo(data)}

                style={{ backgroundImage: `url(${data?.staticThumbnail})` }}
                className={cl.ListOfVideosOneVideo}
              >
                <div className={cl.previewWrapper}>
                  <span className={cl.preview}>Preview</span>
                  <i
                    style={{ color: `red` }}
                    className={`fas fa-key ${cl.iconKey}`}
                  />
                </div>
                <div className={cl.play}>
                  <button
                    style={{ border: "none", background: "none" }}
                    className=""
                  >
                    <img className={cl.playImagesOnListVideos} src={playImages} alt="Play" />
                  </button>
                </div>
                <div className={cl.description}>
                  <strong>{data.description}</strong>
                  <span className={cl.duration}>{data.duration}</span>
                </div>
              </div>
            );
          })}
        <div
          style={{
            backgroundImage: `url(${productsFromOffer[0]?.staticThumbnail})`,
          }}
          className={cl.ListOfVideosOneVideo}
        >
          <div className={cl.previewWrapper}>
            <span className={cl.preview}>Preview</span>
            <i
              style={{ color: `red` }}
              className={`fas fa-key ${cl.iconKey}`}
            />
          </div>
          <div className={cl.play}>
            <button style={{ border: "none", background: "none" }} className="">
              <img className={cl.playImagesOnListVideos} src={playImages} alt="Play" />
            </button>
          </div>
          <div className={cl.description}>
            <strong>{productsFromOffer[0]?.description}</strong>
            <span className={cl.duration}>{productsFromOffer[0]?.duration}</span>
          </div>
        </div>
      </div>
      {productsFromOffer?.length ? (
        <div className={cl.SingleVideoWrapper}>
          <div
            style={{
              backgroundImage: `url(${selectVideo?.staticThumbnail})`,
            }}
            className={cl.SingleVideo}
          >
            <img onClick={() => history.push(`/watch/${selectVideo?._id}/${selectVideo?.mainManifest}`)} className={cl.playImagesOnSingleVideo} src={playImages} alt="Play" />
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default VideoPlayerView;
