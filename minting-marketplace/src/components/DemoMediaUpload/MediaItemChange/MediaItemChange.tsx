import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
import { IMediaItemChange } from '../types/DemoMediaUpload.types';

import './MediaItemChange.css';

const MediaItemChange: React.FC<IMediaItemChange> = ({
  item,
  setMediaList,
  index,
  mediaList,
  uploadSuccess,
  textFlag
}) => {
  const { primaryColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  const [titleValue, setTitleValue] = useState<string>(item.title);
  const [editTitleVideo, setEditTitleVideo] = useState<boolean>(false);

  const toggleTitleVideo = () => {
    setEditTitleVideo((prev) => !prev);
  };

  const onChangeTitle = (e) => {
    setTitleValue(e.target.value);
  };

  const closeEdit = () => {
    setTitleValue(item.title);
    toggleTitleVideo();
  };

  const changeTitleMediaItem = () => {
    const newMediaList = mediaList;
    newMediaList[index].title = titleValue;
    setMediaList(newMediaList);
    toggleTitleVideo();
  };

  return (
    <div className="col-12 media-item-title">
      {textFlag ? (
        <div>
          <p className="col-12">
            {item.title.length > 15
              ? item.title.substr(0, 6) +
                '...' +
                item.title.substr(item.title.length - 10, 10)
              : item.title}
          </p>
        </div>
      ) : (
        <div>
          {!editTitleVideo ? (
            <>
              <p className="col-12">
                {item.title.length > 15
                  ? item.title.substr(0, 6) +
                    '...' +
                    item.title.substr(item.title.length - 10, 10)
                  : item.title}
              </p>
              <button
                disabled={uploadSuccess === false}
                className={`btn btn-success rounded-rairo mx-3 ${
                  primaryColor === 'rhyno' ? 'rhyno' : ''
                }`}
                onClick={toggleTitleVideo}>
                <i className="fas fa-pencil-alt"></i>
              </button>
            </>
          ) : (
            <form onSubmit={changeTitleMediaItem}>
              <input
                required
                className="rounded-rair form-control"
                onChange={onChangeTitle}
                value={titleValue}
              />
              <div className="mediaItem-group-btn">
                <button
                  className={`btn btn-success rounded-rairo ${
                    primaryColor === 'rhyno' ? 'rhyno' : ''
                  }`}
                  type="submit">
                  <i className="fas fa-pencil-alt"></i>
                </button>
                <button
                  className={`btn btn-danger rounded-rairo mx-3 ${
                    primaryColor === 'rhyno' ? 'rhyno' : ''
                  }`}
                  onClick={closeEdit}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaItemChange;
