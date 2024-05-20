import React, { useEffect, useState } from 'react';

import { Image } from './ImageLazyItem/ImageLazy.styled';
import { IImageLazy } from './types/imageLazy.types';

const placeHolder =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII=';

export const ImageLazy: React.FC<IImageLazy> = ({
  src,
  alt,
  height,
  width,
  className,
  cover,
  id
}) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(placeHolder);
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>();

  const onLoad = (event) => {
    event.target.classList.add('loaded');

    event.target.classList.remove('has-error');
  };

  const onError = (event) => {
    event.target.classList.add('has-error');
  };

  useEffect(() => {
    let observer;
    let didCancel = false;

    if (imageRef && imageSrc !== src) {
      if (IntersectionObserver) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (
                !didCancel &&
                (entry.intersectionRatio > 0 || entry.isIntersecting)
              ) {
                setImageSrc(src);
                observer.unobserve(imageRef);
              }
            });
          },
          {
            threshold: 0.01,
            rootMargin: '75%'
          }
        );
        observer.observe(imageRef);
      } else {
        setImageSrc(src);
      }
    }
    return () => {
      didCancel = true;
      if (observer && observer.unobserve) {
        observer.unobserve(imageRef);
      }
    };
  }, [src, imageSrc, imageRef]);
  return (
    <Image
      id={id}
      cover={cover}
      className={className}
      width={width}
      height={height}
      ref={setImageRef}
      src={imageSrc}
      alt={alt}
      onLoad={onLoad}
      onError={onError}
    />
  );
};
