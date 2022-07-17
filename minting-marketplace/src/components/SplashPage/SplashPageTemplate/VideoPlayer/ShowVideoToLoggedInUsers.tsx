//@ts-nocheck
import React from 'react';
import playIcon from '../../images/playImg.png';
import Modal from 'react-modal';
import VideoPlayerBySignature from './VideoPlayerBySignature ';
import './VideoPlayer.css';
import { useState, useCallback } from 'react';
import StandaloneVideoPlayer from '../../../video/videoPlayerGenerall';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Provider, useStore, useSelector } from 'react-redux';
import NftVideoplayer from '../../../MockUpPage/NftList/NftData/NftVideoplayer/NftVideoplayer';

const reactSwal = withReactContent(Swal);

const customStylesForVideo = {
  overlay: {
    zIndex: '5'
  },
  content: {
    width: '90vw',
    height: '70vh',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    fontFamily: 'Plus Jakarta Text',
    borderRadius: '16px',
    background: '#4e4d4d'
  }
};
Modal.setAppElement('#root');

const ShowVideoToLoggedInUsers = ({
  backgroundImage,
  video,
  videoTitle,
  baseURL,
  mediaId,
  demo,
  selectVideo
}) => {
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

  const store = useStore();
  const { primaryColor, textColor } = useSelector((store) => store.colorStore);

  return (
    <>
      {demo ? (
        <>
          <div
            // onClick={() => reactSwal.fire({
            //   title: videoTitle,
            //   html: <Provider store={store}>
            //     <StandaloneVideoPlayer
            //       {...{ baseURL, mediaId }}
            //     />
            //   </Provider>,
            //   width: '90vw',
            //   height: '90vh',
            //   customClass: {
            //     popup: `bg-${primaryColor}`,
            //     title: `text-${textColor}`,
            //   },
            //   showConfirmButton: false
            // })}
            className="video-module-background"
            style={{ backgroundImage: 'url(' + backgroundImage + ')' }}
            alt="community-img">
            <div className="video-module-play-button-wrapper">
              <button
                style={{ border: 'none', background: 'none' }}
                className="video-module-play-button"
                onClick={() => openVideo()}>
                <img src={playIcon} alt="Play" />
              </button>
            </div>
          </div>
          {video && (
            <Modal
              isOpen={modalVideoIsOpen}
              onRequestClose={closeModal}
              style={customStylesForVideo}
              contentLabel="Example Modal">
              <h2
                className="video-grey-man-video-title"
                style={{
                  paddingTop: '0rem',
                  paddingBottom: '1rem'
                }}>
                {videoTitle}
              </h2>
              <div
                className="col-12 row mx-0 h1"
                style={{
                  justifyContent: 'center'
                }}>
                <video
                  // id={"vjs-" + videoName}
                  className="video-player"
                  controls
                  autoPlay
                  preload="auto"
                  data-setup="{}">
                  <source
                    // autostart="false"
                    src={video}
                    type="video/mp4"
                  />
                </video>
              </div>
            </Modal>
          )}
        </>
      ) : (
        <>
          <div
            onClick={() =>
              reactSwal.fire({
                title: videoTitle,
                html: (
                  <Provider store={store}>
                    {selectVideo && selectVideo?._id ? (
                      <NftVideoplayer selectVideo={selectVideo} main={true} />
                    ) : (
                      <StandaloneVideoPlayer {...{ baseURL, mediaId }} />
                    )}
                  </Provider>
                ),
                width: '90vw',
                // height: '90vh',
                customClass: {
                  popup: `bg-${primaryColor}`,
                  title: `text-${textColor}`
                },
                showConfirmButton: false
              })
            }
            className="video-module-background"
            style={{ backgroundImage: 'url(' + backgroundImage + ')' }}
            alt="community-img">
            <div className="video-module-play-button-wrapper">
              <button
                style={{ border: 'none', background: 'none' }}
                className="video-module-play-button"
                onClick={() => openVideo()}>
                <img src={playIcon} alt="Play" />
              </button>
            </div>
          </div>
          {video && (
            <Modal
              isOpen={modalVideoIsOpen}
              onRequestClose={closeModal}
              style={customStylesForVideo}
              contentLabel="Example Modal">
              <h2
                className="video-grey-man-video-title"
                style={{
                  paddingTop: '0rem',
                  paddingBottom: '1rem'
                }}>
                {videoTitle}
              </h2>
              <VideoPlayerBySignature mediaAddress={video} />
            </Modal>
          )}
        </>
      )}
    </>
  );
};

export default ShowVideoToLoggedInUsers;
