import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../ducks';
import { IVideoList } from './video.types';
import { TVideosInitialState } from './../../ducks/videos/videosDucks.types';
import VideoItem from './videoItem';
// import InputField from '../common/InputField';
// import setDocumentTitle from '../../utils/setTitle';

const VideoList: React.FC<IVideoList> = ({ titleSearch, primaryColor }) => {
  const { videos, loading } = useSelector<RootState, TVideosInitialState>(
    (store) => store.videosStore
  );
  const dispatch = useDispatch();

  const updateVideo = useCallback(() => {
    dispatch({ type: 'GET_LIST_VIDEOS_START' });
  }, [dispatch]);

  useEffect(() => {
    updateVideo();
  }, [updateVideo]);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  // const [mediaList, setMediaList] = useState();
  // const [titleSearch, setTitleSearch] = useState('');
  // const updateList = async () => {
  // 	let response = await (await fetch('/api/media/list', {
  // 		headers: {
  // 			'x-rair-token': localStorage.token
  // 		}
  // 	})).json()
  // 	if (response.success) {
  // 		setMediaList(response.list)
  // 	} else if (response?.message === 'jwt expired' || response?.message === 'jwt malformed') {
  // 		localStorage.removeItem('token');
  // 	} else {
  // 		console.log(response?.message);
  // 	}
  // }

  // useEffect(() => {
  // 	if (localStorage.token) {
  // 		updateList();
  // 	}
  // }, [])

  return (
    <>
      <div className="input-search-wrapper list-button-wrapper">
        {/* <InputField
				getter={titleSearch}
				setter={setTitleSearch}
				placeholder={'Search...'}
				customCSS={{backgroundColor: `var(--${primaryColor})`}}
				customClass= 'form-control input-styled' />
				<i className="fas fa-search fa-lg fas-custom" aria-hidden="true"></i> */}
      </div>
      <div className="list-button-wrapper" style={{ verticalAlign: 'top' }}>
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
