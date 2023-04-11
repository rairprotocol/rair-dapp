import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
import { TUsersInitialState } from '../../../ducks/users/users.types';
import { TMediaType } from '../../creatorStudio/creatorStudio.types';
import LinearProgressWithLabel from '../LinearProgressWithLabel/LinearProgressWithLabel';
import MediaItemChange from '../MediaItemChange/MediaItemChange';
import PopUpChoiceNFT from '../PopUpChoiceNFT/PopUpChoiceNFT';
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
  selectCommonInfo,
  deleter,
  currentTitleVideo,
  socketMessage,
  setUploadSuccess,
  newUserStatus,
  setSocketMessage
}) => {
  const { primaryColor, textColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  const { userRd } = useSelector<RootState, TUsersInitialState>(
    (store) => store.userStore
  );

  const [editTitleVideo, setEditTitleVideo] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<TMediaType>(item);

  const uploadVideoCloud = useCallback(
    (cloud) => {
      uploadVideoDemo(currentItem, cloud);
      reactSwal.close();
    },
    [currentItem, uploadVideoDemo]
  );

  useEffect(() => {
    setUploadSuccess(false);
  }, [setUploadSuccess]);

  useEffect(() => {
    if (userRd && userRd.email === null) {
      setSocketMessage(undefined);
      Swal.fire({
        imageWidth: 70,
        imageHeight: 'auto',
        imageAlt: 'Custom image',
        imageUrl:
          'https://new-dev.rair.tech/static/media/RAIR-Tech-Logo-POWERED-BY-BLACK-2021.abf50c70.webp',
        title: 'Oops...',
        text: `Uploading a video with RAIR requires an email registered with our profile settings. 
        Please use the user profile menu in the upper right corner to add your email address to your profile.`
      });
    }
  }, [userRd]);

  const alertChoiceCloud = useCallback(() => {
    reactSwal.fire({
      title: 'Select video storage location (Cloud or IPFS)',
      html: (
        <div className="container-choice-clouds">
          <button
            className="btn-stimorol btn"
            onClick={() => uploadVideoCloud('gcp')}>
            Cloud
          </button>
          <button
            className="btn-stimorol btn"
            onClick={() => uploadVideoCloud('ipfs')}>
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

  useEffect(() => {
    setCurrentItem(item);
  }, [item, currentItem, mediaList]);

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
          newUserStatus={newUserStatus}
          setUploadSuccess={setUploadSuccess}
          beforeUpload={true}
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
        ) : newUserStatus ? (
          <button
            onClick={() => alertChoiceCloud()}
            disabled={!newUserStatus}
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
        <PopUpChoiceNFT
          selectCommonInfo={selectCommonInfo}
          setMediaList={setMediaList}
          mediaList={mediaList}
          index={index}
          setUploadSuccess={setUploadSuccess}
          newUserStatus={newUserStatus}
        />
        {newUserStatus ? (
          <button
            disabled={!newUserStatus}
            onClick={() => deleter(index)}
            className={`btn btn-danger rounded-rairo ${
              primaryColor === 'rhyno' ? 'rhyno' : ''
            }`}>
            <i className="far fa-trash"></i>
          </button>
        ) : (
          <button
            disabled={uploading || uploadSuccess === false}
            onClick={() => deleter(index)}
            className={`btn btn-danger rounded-rairo ${
              primaryColor === 'rhyno' ? 'rhyno' : ''
            }`}>
            <i className="far fa-trash"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default MediaListBox;
