import React, { useCallback, useEffect, useState } from 'react';

interface ImageCustomForSearchProps {
  item: {
    metadata: {
      animation_url?: string;
      image?: string;
    };
  };
}

const ImageCustomForSearch: React.FC<ImageCustomForSearchProps> = ({
  item
}) => {
  const [isFileUrl, setIsFileUrl] = useState<string | undefined>();

  const checkUrl = useCallback((item: ImageCustomForSearchProps['item']) => {
    if (item.metadata.animation_url) {
      const fileUrl = item.metadata.animation_url;
      const parts = fileUrl.split('/').pop()?.split('.');
      const ext = parts && parts.length > 1 ? parts.pop() : '';
      setIsFileUrl(ext);
    }
  }, []);

  useEffect(() => {
    checkUrl(item);
  }, [checkUrl, item]);

  return isFileUrl === 'gif' ? (
    <img
      className="data-find-img bot"
      src={item.metadata?.animation_url}
      alt={''}
    />
  ) : (
    <img className="data-find-img bot" src={item.metadata?.image} alt={''} />
  );
};

export default ImageCustomForSearch;
