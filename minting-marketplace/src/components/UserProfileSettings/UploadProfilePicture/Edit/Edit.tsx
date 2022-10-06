//@ts-nocheck
import React, { memo, useCallback } from 'react';

import { ImageUpload } from '../ImageUpload/ImageUpload';
import { Name } from '../Name/Name';
import { Status } from '../Status/Status';

import cl from './Edit.module.css';

const EditComponent = ({
  onSubmit,
  imagePreviewUrl,
  setImagePreviewUrl,
  setName,
  name,
  setStatus,
  status,
  setFile,
  setOpenModalPic,
  setTriggerState,
  primaryColor
}) => {
  const photoUpload = useCallback(
    (e) => {
      e.preventDefault();
      const reader = new FileReader();
      const fileF = e.target.files[0];
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
        setFile(fileF);
      };
      reader.readAsDataURL(fileF);
    },
    [setImagePreviewUrl, setFile]
  );

  const closeEditList = () => {
    setTriggerState(false);
    setOpenModalPic(false);
  };

  return (
    <div
      className={cl.card}
      style={{
        background: primaryColor === 'rhyno' ? 'rgb(192, 192, 192)' : '#383637'
      }}>
      <form onSubmit={onSubmit}>
        <ImageUpload onChange={photoUpload} src={imagePreviewUrl} />
        <Name
          onChange={(e) => setName(e.target.value)}
          value={name.replace(/@/g, '')}
        />
        <Status onChange={(e) => setStatus(e.target.value)} value={status} />
        <button type="submit" className={cl.save}>
          Save{' '}
        </button>
        <button onClick={closeEditList} className={cl.save}>
          Exit{' '}
        </button>
      </form>
    </div>
  );
};

export const Edit = memo(EditComponent);
