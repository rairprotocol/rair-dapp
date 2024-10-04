import { useContext } from 'react';

import { IVideoList } from './video.types';
import VideoItem from './videoItem';

import { useAppSelector } from '../../hooks/useReduxHooks';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import {
  GlobalModalContext,
  TGlobalModalContext
} from '../../providers/ModalProvider';
import { dataStatuses } from '../../redux/commonTypes';
import LoadingComponent from '../common/LoadingComponent';
import HomePageFilterModal from '../GlobalModal/FilterModal/FilterModal';
import GlobalModal from '../GlobalModal/GlobalModal';

const VideoList: React.FC<IVideoList> = ({ titleSearch }) => {
  const { videoListStatus, totalVideos, videos } = useAppSelector(
    (state) => state.videos
  );
  const { width } = useWindowDimensions();
  const isMobileDesign = width < 1100;
  const modalParentNode = width > 1100 ? 'filter-modal-parent' : 'App';
  const { globalModalState } =
    useContext<TGlobalModalContext>(GlobalModalContext);

  if (videoListStatus !== dataStatuses.Complete) {
    return <LoadingComponent />;
  }

  return (
    <div
      style={{
        display: 'flex',
        transition: 'all .2s ease',
        width: '100%'
      }}>
      <div
        className={`list-button-wrapper unlockables-wrapper tree-tab-unlocks ${
          globalModalState?.isOpen ? 'with-modal' : ''
        }`}
        style={{
          verticalAlign: 'top',
          width: '100%'
        }}>
        {totalVideos === 0 ? (
          <h3 className="w-100 text-center">No videos found</h3>
        ) : (
          videos
            .filter((video) =>
              video.title.toLowerCase().includes(titleSearch.toLowerCase())
            )
            .map((video, index) => {
              return <VideoItem key={index} item={video} />;
            })
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
