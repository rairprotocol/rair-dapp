import React, { useCallback, useEffect, useState } from 'react';

const ImageCustomForSearch = ({ item }) => {
  const [isFileUrl, setIsFileUrl] = useState();

  const checkUrl = useCallback((item) => {
    if (item.metadata.animation_url) {
      // refactored
      const fileUrl = item.metadata.animation_url;
      const parts = fileUrl.split('/').pop().split('.');
      const ext = parts.length > 1 ? parts.pop() : '';
      setIsFileUrl(ext);
    }
  }, []);

  useEffect(() => {
    checkUrl(item);
  }, [checkUrl, item]);

  return isFileUrl === 'gif' ? (
    <img
      className="data-find-img bot"
      src={
        item.metadata?.animation_url
        // ?
        // item.metadata.animation_url :
        // item.metadata.image
      }
      alt={''}
    />
  ) : (
    <img
      className="data-find-img bot"
      src={
        // item.metadata.animation_url ?
        // item.metadata.animation_url :
        item.metadata?.image
      }
      // alt={item.metadata.description} />
      alt={''}
    />
  );
};

export default ImageCustomForSearch;
