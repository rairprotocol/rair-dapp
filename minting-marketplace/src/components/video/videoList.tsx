import { useSelector } from 'react-redux';

import { IVideoList } from './video.types';
import VideoItem from './videoItem';

import { RootState } from '../../ducks';

const VideoList: React.FC<IVideoList> = ({
  videos,
  titleSearch,
  handleVideoIsUnlocked
}) => {
  const loading = useSelector<RootState, boolean>(
    (state) => state.videosStore.loading
  );

  return (
    <>
      {/* <div className="input-search-wrapper list-button-wrapper"></div> */}
      <div
        className="list-button-wrapper unlockables-wrapper tree-tab-unlocks"
        style={{
          verticalAlign: 'top',
          width: '100%',
          filter: loading ? 'blur(1.5px)' : 'none'
        }}>
        {videos ? (
          Object.keys(videos).length > 0 ? (
            Object.keys(videos)
              .filter((item) =>
                videos[item].title
                  .toLowerCase()
                  .includes(titleSearch.toLowerCase())
              )
              .map((item, index) => {
                return (
                  <VideoItem
                    key={index}
                    mediaList={videos}
                    item={item}
                    handleVideoIsUnlocked={handleVideoIsUnlocked}
                  />
                );
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
