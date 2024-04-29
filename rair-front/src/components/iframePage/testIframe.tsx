import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { VideoPlayerParams } from '../video/video.types';

import './iframeStyles.css';

const TestIframe = ({ setIsIframePage }) => {
  useEffect(() => {
    setIsIframePage(true);
  }, [setIsIframePage]);
  const params = useParams<VideoPlayerParams>();
  const { contract, mainManifest, videoId } = params;
  const origin = window.location.origin;
  return (
    <div className="test-iframe-wrapper">
      <iframe
        id="my-iframe"
        src={`${origin}/watch/${contract}/${videoId}/${mainManifest}`}
        width="500px"
        height="450px"
        title="my-iframe"></iframe>
    </div>
  );
};

export default TestIframe;
