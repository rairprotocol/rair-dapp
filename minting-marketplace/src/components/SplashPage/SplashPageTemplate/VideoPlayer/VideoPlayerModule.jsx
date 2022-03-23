import playIcon from "../../images/playImg.png";
import Modal from "react-modal";
import VideoPlayerBySignature from "./VideoPlayerBySignature ";
import "./VideoPlayer.css"
import { useState, useCallback } from "react";




const customStylesForVideo = {
    overlay: {
      zIndex: "5",
    },
    content: {
      width: "90vw",
      height: "70vh",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      display: "flex",
      flexDirection: "row",
      alignContent: "center",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap",
      fontFamily: "Plus Jakarta Text",
      borderRadius: "16px",
      background: "#4e4d4d",
    },
  };
  Modal.setAppElement("#root");

const ShowVideoToLoggedInUsers = ({backgroundImage, video}) => {
    const [modalVideoIsOpen, setVideoIsOpen] = useState(false);
    const openModalForVideo = useCallback(() => {
        setVideoIsOpen(true);
      }, []);
    
    const openVideo = () => {
        openModalForVideo();
      };

    function closeModal() {
        setVideoIsOpen(false);
    }

    return (
        <>
          <div
            className="video-module-background"
            style={{backgroundImage: 'url(' + backgroundImage + ')',}}
            alt="community-img"
          >
            <div className="video-module-play-button-wrapper">
              <button
                style={{ border: "none", background: "none" }}
                className="video-module-play-button"
                onClick={() => openVideo()}
              >
                <img src={playIcon} alt="Play" />
              </button>
            </div>  
          </div>
          <Modal
            isOpen={modalVideoIsOpen}
            onRequestClose={closeModal}
            style={customStylesForVideo}
            contentLabel="Example Modal"
          >
            <h2
              className="video-grey-man-video-title"
              style={{
                paddingTop: "0em"
              }}
            >
              NFT LA
            </h2>
            <VideoPlayerBySignature mediaAddress={video}/>
          </Modal>
        </>
    );
}

  const VideoPlayerModule = ({backgroundImage, video}) => {
      return (
        <div className="video-module-wrapper">
            <h3
            className="video-module-title"
            >
            NFT LA Video
            </h3>
            <div className="video-module">
              <ShowVideoToLoggedInUsers backgroundImage={backgroundImage} video={video}/>
            </div>
            <div className="video-module-desc-wrapper">
            <span
                className="video-module-desc"
            >
                NFT owners can learn more about the project by signing with
                metamask to unlock an encrypted stream{" "}
            </span>
            </div>
        </div>
      )
  }

export default VideoPlayerModule;