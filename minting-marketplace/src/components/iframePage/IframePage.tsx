import { useEffect } from 'react';
import VideoPlayer from '../video/videoPlayer';
const IframePage = ({ loginDone, setIsIframePage }) => {
  useEffect(() => {
    setIsIframePage(true);
  }, [setIsIframePage]);

  return (
    <div>
      <h1>Shared Video Player</h1>
      {loginDone && <VideoPlayer />}
    </div>
  );
};

export default IframePage;
