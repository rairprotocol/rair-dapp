import { useCallback, useState } from 'react';
import Modal from 'react-modal';
import { Provider, useSelector, useStore } from 'react-redux';

import { RootState } from '../../../../ducks';
import { ColorStoreType } from '../../../../ducks/colors/colorStore.types';
import useSwal from '../../../../hooks/useSwal';
import { metaMaskIcon } from '../../../../images';
import { ImageLazy } from '../../../MockUpPage/ImageLazy/ImageLazy';
import StandaloneVideoPlayer from '../../../video/videoPlayerGenerall';
import VideoPlayerBySignature from '../VideoPlayer/VideoPlayerBySignature ';

import '../VideoPlayer/VideoPlayer.css';

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

const VideoTilesItem = ({
  videoName,
  videoTime,
  videoSRC,
  baseURL,
  mediaId,
  demo,
  backgroundImage
}) => {
  const store = useStore();
  const reactSwal = useSwal();

  const openRAIRvideo = () => {
    reactSwal.fire({
      title: videoName,
      html: (
        <Provider store={store}>
          <StandaloneVideoPlayer {...{ baseURL, mediaId }} />
        </Provider>
      ),
      width: '90vw',
      customClass: {
        popup: `bg-${primaryColor}`,
        title: `text-${textColor}`
      },
      showConfirmButton: false
    });
  };

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

  const { primaryColor, textColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  return (
    <>
      {demo ? (
        <>
          <div className="box-video">
            <div
              className="video-locked"
              style={{
                background: `${primaryColor === 'rhyno' ? '#fff' : '#4E4D4DCC'}`
              }}
              onClick={() => {
                videoSRC
                  ? openVideo()
                  : reactSwal.fire('Error', 'No Video Found', 'error');
              }}>
              <div
                className="block-with-video"
                style={{ position: 'relative' }}>
                <div className="video-block-metamask-some"></div>
                <ImageLazy
                  className="block-img-bg static"
                  src={backgroundImage}
                  alt="Previw for demo video"
                />
              </div>
              <div className="video-description">
                <div className="video-title">
                  <p
                    style={{
                      color: `${primaryColor === 'rhyno' ? '#000' : '#fff'}`
                    }}>
                    {videoName}
                  </p>
                </div>
                <div className="video-timer">
                  <p
                    style={{
                      color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
                    }}>
                    {videoTime}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {videoSRC && (
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
                {videoName}
              </h2>
              {/* <VideoPlayerBySignature mediaAddress={videoSRC}/> */}
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
                    src={videoSRC}
                    type="video/mp4"
                  />
                </video>
              </div>
            </Modal>
          )}
        </>
      ) : (
        <>
          <div className="box-video">
            <div
              className="video-locked"
              style={{
                background: `${primaryColor === 'rhyno' ? '#fff' : '#4E4D4DCC'}`
              }}
              onClick={() => {
                videoSRC
                  ? openVideo()
                  : baseURL && mediaId
                    ? openRAIRvideo()
                    : reactSwal.fire('Error', 'No Video Found', 'error');
              }}>
              <div
                className="block-with-video"
                style={{ position: 'relative' }}>
                <div className="video-block-metamask-some">
                  <img src={metaMaskIcon} alt="metamask logo" />
                </div>
                <ImageLazy
                  className="block-img-bg"
                  src={videoSRC}
                  alt="Unlockable preview video"
                />
              </div>
              <div className="video-description">
                <div className="video-title">
                  <p
                    style={{
                      color: `${primaryColor === 'rhyno' ? '#000' : '#fff'}`
                    }}>
                    {videoName}
                  </p>
                </div>
                <div className="video-timer">
                  <p
                    style={{
                      color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
                    }}>
                    {videoTime}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {videoSRC && (
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
                {videoName}
              </h2>
              <VideoPlayerBySignature mediaAddress={videoSRC} />
            </Modal>
          )}
        </>
      )}
    </>
  );
};

export default VideoTilesItem;
