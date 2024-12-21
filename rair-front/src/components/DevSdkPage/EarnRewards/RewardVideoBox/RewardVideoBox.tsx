import React, { useCallback, useEffect, useState } from "react";
import { useAppSelector } from "../../../../hooks/useReduxHooks";
import useWindowDimensions from "../../../../hooks/useWindowDimensions";
import { LockIcon } from "../../../../images/index";
import { CustomModalStyle } from "../../../../types/commonTypes";
import Modal from "react-modal";
import { ModalContentCloseBtn } from "../../../MockUpPage/utils/button/ShowMoreItems";
import { faLock, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TooltipBox } from "../../../common/Tooltip/TooltipBox";
import NftVideoplayer from "../../../MockUpPage/NftList/NftData/NftVideoplayer/NftVideoplayer";
import { playImagesColored } from "../../../SplashPage/images/greyMan/grayMan";

const RewardVideoBox = ({ video }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [openVideoplayer, setOpenVideoplayer] = useState(false);
  const { width } = useWindowDimensions();
  const { primaryColor, isDarkMode, textColor } = useAppSelector(
    (store) => store.colors
  );
  const [owned /*setOwned*/] = useState(false);

  const customStyles: CustomModalStyle = {
    overlay: {
      position: "fixed",
      display: "flex",
      justifyContent: "center",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      zIndex: "1000",
      overflowY: "auto",
    },
    content: {
      background: primaryColor === "rhyno" ? "#F2F2F2" : "#383637",
      top: width > 500 ? "50%" : "55%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      marginTop: "3%",
      transform: "translate(-50%, -50%)",
      display: "flex",
      flexDirection: "column",
      alignContent: "center",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap",
      fontFamily: "Plus Jakarta Text",
      border: "none",
      borderRadius: "16px",
      padding: width < 500 ? "15px" : "20px",
      overflow: width < 500 ? "" : "auto",
      position: "absolute",
      zIndex: "1000",
    },
  };

  const openModal = useCallback(() => {
    setModalIsOpen(true);
  }, [setModalIsOpen]);

  const closeModal = useCallback(() => {
    setModalIsOpen(false);
    setOpenVideoplayer(false);
  }, [setModalIsOpen]);

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        // onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Video Modal"
      >
        <div className="modal-content-close-btn-wrapper">
          <ModalContentCloseBtn isDarkMode={isDarkMode} onClick={closeModal}>
            <FontAwesomeIcon
              icon={faTimes}
              style={{
                lineHeight: "inherit",
                color:
                  import.meta.env.VITE_TESTNET === "true"
                    ? `${
                        textColor === "#FFF" || textColor === "black"
                          ? "#F95631"
                          : textColor
                      }`
                    : `${
                        textColor === "#FFF" || textColor === "black"
                          ? "#E882D5"
                          : textColor
                      }`,
              }}
            />
          </ModalContentCloseBtn>
        </div>
        <div
          className={`${
            primaryColor !== "rhyno" && "text-white"
          } modal-content-wrapper-for-video ${
            video?.isUnlocked && !owned ? "unlocked" : "locked"
          }`}
        >
          <div className="modal-content-video">
            {video?.isUnlocked === false && !owned ? (
              <>
                <TooltipBox enterDelay={200} title="You Need to Buy This NFT!">
                  <FontAwesomeIcon
                    icon={faLock}
                    data-title="You Need to Buy This NFT!"
                    className="modal-content-video-lock"
                  />
                </TooltipBox>
              </>
            ) : openVideoplayer ? (
              <NftVideoplayer selectVideo={video} />
            ) : (
              <>
                <div className="modal-content-play-image-container">
                  <div>
                    <img
                      onClick={() => {
                        setOpenVideoplayer(true);
                      }}
                      className={"modal-content-play-image"}
                      src={playImagesColored}
                      alt="Button play video"
                    />
                  </div>
                </div>
              </>
            )}
            {!openVideoplayer && !!video.staticThumbnail && (
              <img
                alt="Video thumbnail"
                src={`${video.staticThumbnail}`}
                className={`modal-content-video-thumbnail ${
                  !video.isUnlocked && owned ? "video-locked-modal" : ""
                }`}
              />
            )}
          </div>
          <div className="title-name-internal-options-wrapper">
            <div
              className={`title-and-username-wrapper-for-video-modal popup-video-player-mobile-title ${
                primaryColor === "rhyno" ? "rhyno" : ""
              }`}
            >
              <div className="title-of-video">
                {video && <h3>{video.title}</h3>}
              </div>
              <div className="user-info">
                {/* <img
                  src={dataUser?.avatar ? dataUser.avatar : defaultAvatar}
                  alt="User Avatar"
                  style={{ marginRight: "10px" }}
                /> */}
                <div className="user-name">
                  {/* <span>
                    {dataUser?.nickName && dataUser?.nickName.length > 9
                      ? `${dataUser?.nickName?.slice(
                          0,
                          9
                        )}...${dataUser?.nickName?.slice(length - 5)}`
                      : dataUser?.nickName}
                  </span> */}
                </div>
              </div>
            </div>
            {/* <div className="favorite-collection-upgrade-wrapper-for-video-modal">
              {offersArray.length > 0 && (
                <CustomButton
                  text={"View Collection"}
                  width={"160px"}
                  height={"30px"}
                  margin={"5px"}
                  textColor={textColor}
                  onClick={goToCollectionView}
                  custom={false}
                  background={primaryButtonColor}
                />
              )}
            </div> */}
          </div>
          <div className="video-description-wrapper">
            <b>Description</b>
            {video.description && <p>{video.description}</p>}
          </div>
        </div>
      </Modal>
      <div
        style={{
          borderRadius: "12px",
          height: "135px",
          background: "#383637",
          display: "flex",
          overflow: "hidden",
        }}
        onClick={() => setModalIsOpen((prev) => !prev)}
      >
        <div
          style={{
            width: "40%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderTopLeftRadius: "12px",
            borderRight: "4px solid #E4476D",
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${video.staticThumbnail})`,
            backgroundSize: "cover",
            cursor: "pointer",
          }}
          className=""
        >
          {!video.demo && (
            <div
              style={{
                background: "#E4476D",
                width: "32px",
                height: "32px",
                borderRadius: "40px",
              }}
            >
              <img
                style={{
                  width: "16px",
                  height: "16px",
                }}
                src={LockIcon}
                alt="lock icon"
              />
            </div>
          )}
        </div>
        <div
          style={{
            textAlign: "left",
            padding: "20px",
          }}
        >
          <p
            style={{
              fontWeight: "bold",
              fontSize: "22px",
              color: "#fff",
            }}
          >
            {video.title}
          </p>
          <p
            style={{
              fontSize: "22px",
              color: "#A7A6A6",
            }}
          >
            {/* ~20 Minutes */}
            {video.duration}
          </p>
        </div>
      </div>
    </>
  );
};

export default RewardVideoBox;
