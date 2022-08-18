//@ts-nocheck
import { CircularProgress } from '@mui/material';
import { IVideoList } from './video.types';
import VideoItem from './videoItem';

const VideoList: React.FC<IVideoList> = ({ loading, videos, titleSearch }) => {
  if (loading) {
    // return <h2>Loading...</h2>;
    return (
      <div className="list-wrapper-empty">
        <CircularProgress
          sx={{ color: '#E882D5' }}
          size={100}
          thickness={4.6}
        />
      </div>
      // <div className="loader-wrapper">
      //   <div className="load" />
      // </div>
    );
  }

  return (
    <>
      {/* <div className="input-search-wrapper list-button-wrapper"></div> */}
      <div
        className="list-button-wrapper unlockables-wrapper"
        style={{ verticalAlign: 'top', width: '100%' }}>
        {videos ? (
          Object.keys(videos).length > 0 ? (
            Object.keys(videos)
              .filter((item) =>
                videos[item].title
                  .toLowerCase()
                  .includes(titleSearch.toLowerCase())
              )
              .map((item, index) => {
                return <VideoItem key={index} mediaList={videos} item={item} />;
              })
          ) : (
            <h5 className="w-100 text-center">No files found</h5>
          )
        ) : (
          'Searching...'
        )}
      </div>
    </>
  );
};

export default VideoList;
