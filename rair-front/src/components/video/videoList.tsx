import { useContext } from 'react';
import { useSelector } from 'react-redux';

import { IVideoList } from './video.types';
import VideoItem from './videoItem';

import { RootState } from '../../ducks';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import {
  GlobalModalContext,
  TGlobalModalContext
} from '../../providers/ModalProvider';
import LoadingComponent from '../common/LoadingComponent';
import HomePageFilterModal from '../GlobalModal/FilterModal/FilterModal';
import GlobalModal from '../GlobalModal/GlobalModal';

const VideoList: React.FC<IVideoList> = ({
  videos,
  titleSearch,
  handleVideoIsUnlocked
}) => {
  const loading = useSelector<RootState, boolean>(
    (state) => state.videosStore.loading
  );
  const { width } = useWindowDimensions();
  const isMobileDesign = width < 1100;
  const modalParentNode = width > 1100 ? 'filter-modal-parent' : 'App';
  const { globalModalState } =
    useContext<TGlobalModalContext>(GlobalModalContext);

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div
      style={{
        display: 'flex',
        transition: 'all .2s ease',
        width: '100%'
      }}>
      {/* <div className="input-search-wrapper list-button-wrapper"></div> */}
      <div
        className={`list-button-wrapper unlockables-wrapper tree-tab-unlocks ${
          globalModalState?.isOpen ? 'with-modal' : ''
        }`}
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
              .map((item) => {
                return (
                  <VideoItem
                    key={item}
                    mediaList={videos}
                    item={item}
                    handleVideoIsUnlocked={handleVideoIsUnlocked}
                  />
                );
              })
          ) : (
            <h3 className="w-100 text-center">No videos found</h3>
          )
        ) : (
          'Searching...'
        )}
      </div>
      <div id="filter-modal-parent">
        <GlobalModal
          parentContainerId={modalParentNode}
          renderModalContent={() => (
            <HomePageFilterModal
              className="unlockables-tab"
              isMobileDesign={isMobileDesign}
            />
          )}
        />
      </div>
    </div>
  );
};

export default VideoList;
