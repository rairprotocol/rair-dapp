export interface ILazyImageItem {
  width?: string;
  height?: string;
}

export interface IImageLazy {
  src: string | undefined;
  alt: string | undefined;
  width?: string;
  height?: string;
  className?: string;
}
