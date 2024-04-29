import { useEffect } from 'react';
import { useSelector } from 'react-redux';
//import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { RootState } from '../../ducks';
import { TUsersInitialState } from '../../ducks/users/users.types';
import useConnectUser from '../../hooks/useConnectUser';
//import { RootState } from '../../ducks';
//import { ColorStoreType } from '../../ducks/colors/colorStore.types';
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

  const { loggedIn, loginProcess } = useSelector<RootState, TUsersInitialState>(
    (store) => store.userStore
  );

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
        backgroundImage: `${loggedIn ? 'none' : `url(${previewImg})`}`,
        backgroundRepeat: ' no-repeat',
        backgroundSize: 'cover'
      }}>
      <div className="connect-btn-container">
        {renderBtnConnect ? (
          <OnboardingButton />
        ) : (
          <button
            disabled={
              !window.ethereum && !programmaticProvider && !loginProcess
            }
            className={`btn btn-${'charcoal'} btn-connect-wallet-mobile iframe-btn`}
            onClick={() => connectUserData()}>
            {loginProcess
              ? 'Please wait...'
              : 'Connect and Sign (x2) to Unlock'}
          </button>
        )}
      </div>
      {loggedIn && <VideoPlayer />}
    </div>
  );
};

export default IframePage;
