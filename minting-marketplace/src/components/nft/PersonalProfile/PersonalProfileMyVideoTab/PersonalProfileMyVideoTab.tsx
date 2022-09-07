import { memo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../ducks';
import { TVideosInitialState } from '../../../../ducks/videos/videosDucks.types';
import VideoItem from '../../../video/videoItem';
// import cl from './PersonalProfileMyVideoTab.module.css';

const PersonalProfileMyVideoTabComponent = ({ titleSearch }) => {
  const dispatch = useDispatch();

  const { videos, loading } = useSelector<RootState, TVideosInitialState>(
    (store) => store.videosStore
  );
  const myVideo = {};
  const _locTok: string = localStorage.token;

  const updateVideo = useCallback(
    (params) => {
      dispatch({ type: 'GET_LIST_VIDEOS_START', params: params });
    },
    [dispatch]
  );

  useEffect(() => {
    const params = {
      itemsPerPage: '10000000',
      // pageNum: '1',
      xTok: _locTok
    };
    updateVideo(params);
  }, [_locTok, updateVideo]);

  const findMyVideo = (obj: object, subField: string, value: boolean) => {
    if (obj !== null) {
      for (const i in obj) {
        const video = obj[i];
        if (video[subField] === value) {
          myVideo[i] = video;
        }
      }
    }
  };
  if (videos !== null) {
    findMyVideo(videos, 'isUnlocked', true);
  }

  if (loading) {
    return (
      <div className="loader-wrapper">
        <div className="load" />
      </div>
    );
  }
  return (
    <div className="PersonalProfileMyVideoTab-wrapper">
      <div
        className="list-button-wrapper tree-tab-unlocks"
        style={{ verticalAlign: 'top', width: '100%' }}>
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
