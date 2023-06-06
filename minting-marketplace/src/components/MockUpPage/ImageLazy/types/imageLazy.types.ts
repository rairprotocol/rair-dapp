export interface ILazyImageItem {
  width?: string;
  height?: string;
  cover?: boolean;
}

export interface IImageLazy {
  src: string | undefined;
  alt: string | undefined;
  width?: string;
  height?: string;
  className?: string;
  cover?: boolean;
  id?: string;
}
