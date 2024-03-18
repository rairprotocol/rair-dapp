import React from 'react';
import { useCallback, useState } from 'react';
import Modal from 'react-modal';
import { Provider, useSelector, useStore } from 'react-redux';

import VideoPlayerBySignature from './VideoPlayerBySignature ';

import { RootState } from '../../../../ducks';
import { ColorStoreType } from '../../../../ducks/colors/colorStore.types';
import useSwal from '../../../../hooks/useSwal';
import NftVideoplayer from '../../../MockUpPage/NftList/NftData/NftVideoplayer/NftVideoplayer';
import StandaloneVideoPlayer from '../../../video/videoPlayerGenerall';
import { playImagesColored } from '../../images/greyMan/grayMan';
import { IShowVideoToLoggedInUsers } from '../../splashPage.types';

import './VideoPlayer.css';

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

const ShowVideoToLoggedInUsers: React.FC<IShowVideoToLoggedInUsers> = ({
  backgroundImage,
  video,
  videoTitle,
  baseURL,
  mediaId,
  demo,
  selectVideo
}) => {
  const [modalVideoIsOpen, setVideoIsOpen] = useState<boolean>(false);
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
  const reactSwal = useSwal();
  const { primaryColor, textColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

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
            style={{ backgroundImage: 'url(' + backgroundImage + ')' }}>
            <div className="video-module-play-button-wrapper">
              <button
                style={{ border: 'none', background: 'none' }}
                className="video-module-play-button"
                onClick={() => openVideo()}>
                <img src={playImagesColored} alt="Button Play Video" />
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
                  className="video-player"
                  controls
                  autoPlay
                  preload="auto"
                  data-setup="{}">
                  <source src={video} type="video/mp4" />
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
                customClass: {
                  popup: `bg-${primaryColor}`,
                  title: `text-${textColor}`
                },
                showConfirmButton: false
              })
            }
            className="video-module-background"
            style={{ backgroundImage: 'url(' + backgroundImage + ')' }}>
            <div className="video-module-play-button-wrapper">
              <button
                style={{ border: 'none', background: 'none' }}
                className="video-module-play-button"
                onClick={() => openVideo()}>
                <img src={playImagesColored} alt="Button Play video" />
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
