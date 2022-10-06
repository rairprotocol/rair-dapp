import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { OnboardingButton } from '../common/OnboardingButton/OnboardingButton';
import { VideoPlayerParams } from '../video/video.types';
import VideoPlayer from '../video/videoPlayer';

import './iframeStyles.css';
import '../../App.css';

const IframePage = ({
  loginDone,
  setIsIframePage,
  renderBtnConnect,
  programmaticProvider,
  startedLogin,
  connectUserData
}) => {
  useEffect(() => {
    setIsIframePage(true);
  }, [setIsIframePage]);

  const params = useParams<VideoPlayerParams>();

  const { videoId } = params;

  const { origin } = window.location;

  const localImgUrl = `https://rair.mypinata.cloud/ipfs/${videoId}/thumbnail.gif`;

  const devImgUrl = `https://storage.googleapis.com/rair-videos/${videoId}/thumbnail.gif`;

  const previewImg = origin.includes('localhost') ? localImgUrl : devImgUrl;

  return (
    <div
      className="iframe-wrapper"
      style={{
        backgroundImage: `${loginDone ? 'none' : `url(${previewImg})`}`,
        backgroundRepeat: ' no-repeat',
        backgroundSize: 'cover'
      }}>
      <div className="connect-btn-container">
        {renderBtnConnect ? (
          <OnboardingButton />
        ) : (
          <button
            disabled={
              !window.ethereum && !programmaticProvider && !startedLogin
            }
            className={`btn btn-${'charcoal'} btn-connect-wallet-mobile iframe-btn`}
            onClick={connectUserData}>
            {startedLogin ? 'Please wait...' : 'Connect to Unlock'}
          </button>
        )}
      </div>
      {loginDone && <VideoPlayer />}
    </div>
  );
};

export default IframePage;
