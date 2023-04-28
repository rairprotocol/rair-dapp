import { memo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../../../ducks';
import { TVideosInitialState } from '../../../../ducks/videos/videosDucks.types';
import LoadingComponent from '../../../common/LoadingComponent';
import VideoItem from '../../../video/videoItem';
// import cl from './PersonalProfileMyVideoTab.module.css';

interface IPersonalProfileMyVideoTabComponent {
  titleSearch: string;
  publicAddress?: string;
}

const PersonalProfileMyVideoTabComponent: React.FC<
  IPersonalProfileMyVideoTabComponent
> = ({ titleSearch, publicAddress }) => {
  const dispatch = useDispatch();

  const { videos, loading } = useSelector<RootState, TVideosInitialState>(
    (store) => store.videosStore
  );
  const myVideo = {};

  const updateVideo = useCallback(
    (params) => {
      dispatch({ type: 'GET_LIST_VIDEOS_START', params: params });
    },
    [dispatch]
  );

  useEffect(() => {
    const params = {
      itemsPerPage: '10000000',
      publicAddress: publicAddress ? publicAddress : undefined
      // pageNum: '1',
    };
    updateVideo(params);
  }, [updateVideo, publicAddress]);

  const findMyVideo = (obj: object, subField: string, value: boolean) => {
    if (obj !== null) {
      for (const i in obj) {
        const video = obj[i];
        if (publicAddress) {
          myVideo[i] = video;
        } else {
          if (video[subField] === value) {
            myVideo[i] = video;
          }
        }
      }
    }
  };
  if (videos !== null) {
    findMyVideo(videos, 'isUnlocked', true);
  }

  if (loading) {
    return <LoadingComponent />;
  }
  return (
    <div className="PersonalProfileMyVideoTab-wrapper">
      <div
        className="list-button-wrapper tree-tab-unlocks"
        style={{ verticalAlign: 'top' }}>
        {myVideo ? (
          Object.keys(myVideo).length > 0 ? (
            Object.keys(myVideo)
              .filter((item) =>
                myVideo[item].title
                  .toLowerCase()
                  .includes(titleSearch.toLowerCase())
              )
              .map((item, index) => {
                return (
                  <VideoItem key={index} mediaList={myVideo} item={item} />
                );
              })
          ) : (
            <h5 className="w-100 text-center">No files found</h5>
          )
        ) : (
          'Searching...'
        )}
      </div>
    </div>
  );
};

export const PersonalProfileMyVideoTab = memo(
  PersonalProfileMyVideoTabComponent
);
