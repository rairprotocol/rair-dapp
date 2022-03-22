import playIcon from "../../images/playImg.png";
import Modal from "react-modal";
import VideoPlayerBySignature from "./VideoPlayerBySignature ";
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
          <img
            className="video-grey-man-pic"
            src={backgroundImage}
            alt="community-img"
          />
          <div className="video-grey-man-metamask-logo-wrapper">
            <button
              style={{ border: "none", background: "none" }}
              className="video-grey-man-metamask-logo metamask-logo"
              onClick={() => openVideo()}
            >
              <img src={playIcon} alt="Play" />
            </button>
          </div>
          <Modal
            isOpen={modalVideoIsOpen}
            onRequestClose={closeModal}
            style={customStylesForVideo}
            contentLabel="Example Modal"
          >
            <h2
              className="video-grey-man-video-title"
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
        <div className="video-grey-man-wrapper">
            <p
            className="video-grey-man-title"
            style={{
                // color: `${primaryColor === "rhyno" ? "#000" : "#FFFFFF"}`,
            }}
            >
            NFT LA Video
            </p>
            <div className="video-grey-man">{<ShowVideoToLoggedInUsers backgroundImage={backgroundImage} video={video}/>}</div>
            <div className="video-grey-man-desc-wrapper">
            <span
                style={{
                // color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}`,
                }}
                className="video-grey-man-desc"
            >
                NFT owners can learn more about the project by signing with
                metamask to unlock an encrypted stream{" "}
            </span>
            </div>
        </div>
      )
  }

export default VideoPlayerModule;