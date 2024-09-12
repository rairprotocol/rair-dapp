import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import useConnectUser from '../../hooks/useConnectUser';
import { useAppSelector } from '../../hooks/useReduxHooks';
import { dataStatuses } from '../../redux/commonTypes';
import { OnboardingButton } from '../common/OnboardingButton/OnboardingButton';
import { VideoPlayerParams } from '../video/video.types';
import VideoPlayer from '../video/videoPlayer';

import './iframeStyles.css';
import '../../App.css';

const IframePage = ({
  setIsIframePage,
  renderBtnConnect,
  programmaticProvider
}) => {
  useEffect(() => {
    setIsIframePage(true);
  }, [setIsIframePage]);

  const { isLoggedIn, loginStatus } = useAppSelector((store) => store.user);

  const params = useParams<VideoPlayerParams>();
  const { connectUserData } = useConnectUser();

  const { videoId } = params;

  const { origin } = window.location;

  const localImgUrl = `${
    import.meta.env.VITE_IPFS_GATEWAY
  }${videoId}/thumbnail.gif`;

  const devImgUrl = `https://storage.googleapis.com/rair-videos/${videoId}/thumbnail.gif`;

  const previewImg = origin.includes('localhost') ? localImgUrl : devImgUrl;

  return (
    <div
      className="iframe-wrapper"
      style={{
        backgroundImage: `${isLoggedIn ? 'none' : `url(${previewImg})`}`,
        backgroundRepeat: ' no-repeat',
        backgroundSize: 'cover'
      }}>
      <div className="connect-btn-container">
        {renderBtnConnect ? (
          <OnboardingButton />
        ) : (
          <button
            disabled={
              !window.ethereum &&
              !programmaticProvider &&
              loginStatus === dataStatuses.Loading
            }
            className={`btn btn-${'charcoal'} btn-connect-wallet-mobile iframe-btn`}
            onClick={() => connectUserData()}>
            {loginStatus === dataStatuses.Loading
              ? 'Please wait...'
              : 'Connect and Sign (x2) to Unlock'}
          </button>
        )}
      </div>
      {isLoggedIn && <VideoPlayer />}
    </div>
  );
};

export default IframePage;
