//@ts-nocheck
import React, { memo } from 'react';

import cl from './ImageUpload.module.css';

const ImageUploadComponent = ({ onChange, src }) => {
  return (
    <label
      htmlFor={cl.photoUpload}
      className={`${cl.customFileUpload} ${'fas'}`}>
      <div className={cl.imgWrap + ' ' + cl.imgUpload}>
        <img alt="Uploaded user avatar" htmlFor={cl.photoUpload} src={src} />
      </div>
      <input id={cl.photoUpload} type="file" onChange={onChange} />
    </label>
  );
};

export const ImageUpload = memo(ImageUploadComponent);
