import React, { useCallback, useEffect, useState } from 'react'

const ImageCustomForSearch = ({ item }) => {
  const [isFileUrl, setIsFileUrl] = useState();

  const checkUrl = useCallback((item) => {
    if (item.metadata.animation_url) {
      let fileUrl = item.metadata.animation_url,
        parts,
        ext =
          (parts = fileUrl.split("/").pop().split(".")).length > 1
            ? parts.pop()
            : "";
      setIsFileUrl(ext);
    }
  }, []);

  useEffect(() => {
    checkUrl(item)
  }, [checkUrl, item])

  return (
    isFileUrl === 'gif' ?
      <img className="data-find-img bot"
        src={
          item.metadata?.animation_url
          // ?
          // item.metadata.animation_url :
          // item.metadata.image
        }
        alt={''} />
      :
      <img className="data-find-img bot"
        src={
          // item.metadata.animation_url ?
          // item.metadata.animation_url :
          item.metadata?.image
        }
        // alt={item.metadata.description} />
        alt={''} />
  )
}

export default ImageCustomForSearch