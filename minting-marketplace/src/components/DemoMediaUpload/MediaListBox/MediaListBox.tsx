import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
import InputSelect from '../../common/InputSelect';
import LinearProgressWithLabel from '../LinearProgressWithLabel/LinearProgressWithLabel';
import MediaItemChange from '../MediaItemChange/MediaItemChange';
import { IMediaListBox } from '../types/DemoMediaUpload.types';

import { reactSwal } from './../../../utils/reactSwal';

const MediaListBox: React.FC<IMediaListBox> = ({
  item,
  index,
  mediaList,
  setMediaList,
  uploadSuccess,
  uploadProgress,
  uploading,
  uploadVideoDemo,
  categories,
  selectCommonInfo,
  deleter,
  updateMediaCategory,
  currentTitleVideo,
  socketMessage
}) => {
  const { primaryColor, textColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );
  const [editTitleVideo, setEditTitleVideo] = useState<boolean>(false);

  const uploadVideoCloud = (item, cloud) => {
    uploadVideoDemo(item, cloud);
    reactSwal.close();
  };

  const alertChoiceCloud = useCallback(() => {
    reactSwal.fire({
      title: 'Select video storage location (Cloud or IPFS)',
      html: (
        <div className="container-choice-clouds">
          <button
            className="btn-stimorol btn"
            onClick={() => uploadVideoCloud(item, 'gcp')}>
            Cloud
          </button>
          <button
            className="btn-stimorol btn"
            onClick={() => uploadVideoCloud(item, 'ipfs')}>
            IPFS
          </button>
        </div>
      ),
      showConfirmButton: false,
      showCancelButton: true,
      width: '40vw',
      background: `${primaryColor === 'rhyno' ? '#fff' : '#2d2d2d'}`,
      color: `${primaryColor === 'rhyno' ? '#2d2d2d' : '#fff'}`
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primaryColor]);

  return (
    <div
      className="medialist-box"
      key={index}
      style={{
        backgroundColor: `var(--${primaryColor}-80)`,
        color: textColor,
        borderRadius: '15px',
        marginTop: '20px'
      }}>
      <div className="mediaitem-block col-12">
        <video className="w-100" src={item.preview} />
        <MediaItemChange
          setMediaList={setMediaList}
          item={item}
          index={index}
          mediaList={mediaList}
          uploadSuccess={uploadSuccess}
          getMediaList={undefined}
          setEditTitleVideo={setEditTitleVideo}
          editTitleVideo={editTitleVideo}
        />
        {uploadProgress && currentTitleVideo === item.title ? (
          <button
            style={{
              background: 'none',
              outline: 'none'
            }}
            className={`btn-stimorol btn rounded-rair white`}>
            <LinearProgressWithLabel value={uploadProgress} />
          </button>
        ) : (
          <button
            onClick={() => alertChoiceCloud()}
            disabled={uploadSuccess === false || uploading}
            className="btn-stimorol btn rounded-rair white">
            <>
              {(uploading && currentTitleVideo === item.title) ||
              (uploadSuccess === false && currentTitleVideo === item.title) ? (
                <>
                  {socketMessage === 'uploading to Cloud'
                    ? 'uploading to Cloud'
                    : '... Loading'}
                </>
              ) : (
                <>
                  <i className="fas fa-upload" />
                  {''} Upload
                </>
              )}
            </>
          </button>
        )}
        <div className="border-stimorol rounded-rair col-12">
          <InputSelect
            options={categories}
            setter={(value) => updateMediaCategory(mediaList, index, value)}
            placeholder="Select an option"
            getter={item.category}
            {...selectCommonInfo}
          />
        </div>
        <button
          disabled={uploading || uploadSuccess === false}
          onClick={() => deleter(index)}
          // className="btn btn-danger rounded-rairo">
          // <TrashIcon />
          className={`btn btn-danger rounded-rairo ${
            primaryColor === 'rhyno' ? 'rhyno' : ''
          }`}>
          <i className="far fa-trash"></i>
        </button>
      </div>
    </div>
  );
};

export default MediaListBox;
