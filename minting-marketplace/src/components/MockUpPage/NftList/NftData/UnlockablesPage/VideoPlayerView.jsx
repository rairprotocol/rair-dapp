import React, { useState } from "react";
import cl from "./VideoPlayerView.module.css";
import playImages from "../../../../SplashPage/images/playImg.png";
// import { useHistory } from "react-router-dom";
import NftVideoplayer from "../NftVideoplayer/NftVideoplayer";

function VideoPlayerView({ productsFromOffer, primaryColor }) {
  const [selectVideo, setSelectVideo] = useState(productsFromOffer[0]);
  const [openVideoplayer, setOpenVideoplayer] = useState(false);
  // const history = useHistory();

  const colorRarity = [`#E4476D`, "gold", "silver"];

  // console.log(productsFromOffer, "productsFromOffer");
  // console.log(selectVideo, "selectVideo");
  return (
    <div 
    className={cl.VideoPlayerViewWrapper}
    style={{
      background: `${primaryColor === "rhyno" ? "rgb(189,189,189)" : "#383637"}`
    }}
    >
      <div className={cl.ListOfVideosWrapper}>
        {productsFromOffer?.length &&
          productsFromOffer.map((data) => {
            return (
              <div
                key={data._id}
                onClick={() => {
                  setSelectVideo(data);
                  setOpenVideoplayer(false);
                }}
                style={{ 
                  backgroundImage: `url(${data?.staticThumbnail})`, 
                }}
                className={cl.ListOfVideosOneVideo}
              >
                <div className={cl.previewWrapper}>
                  <span className={cl.preview}>Preview</span>
                  <i
                    style={{ color: `${colorRarity[data.offer[0]]}` }}
                    className={`fas fa-key ${cl.iconKey}`}
                  />
                </div>
                <div className={cl.play}>
                  <button
                    style={{ border: "none", background: "none" }}
                    className=""
                  >
                    <img
                      className={cl.playImagesOnListVideos}
                      src={playImages}
                      alt="Play"
                    />
                  </button>
                </div>
                <div className={cl.description}>
                  <strong>{data.description}</strong>
                  <span className={cl.duration}>{data.duration}</span>
                </div>
              </div>
            );
          })}
      </div>
      {productsFromOffer?.length ? (
        <div className={cl.SingleVideoWrapper}>
          {openVideoplayer ? (
            <NftVideoplayer selectVideo={selectVideo} />
          ) : (
            <div
              style={{
                backgroundImage: `url(${selectVideo?.staticThumbnail})`,
              }}
              className={cl.SingleVideo}
            >
              <img
                onClick={
                  () => setOpenVideoplayer(true)
                  // () => history.push(`/watch/${selectVideo?._id}/${selectVideo?.mainManifest}`)
                }
                className={cl.playImagesOnSingleVideo}
                src={playImages}
                alt="Play"
              />
            </div>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default VideoPlayerView;
