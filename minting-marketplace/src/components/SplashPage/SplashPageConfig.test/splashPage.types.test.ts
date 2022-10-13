export type TClassName = {
  className: string;
};

export type TWrapperModel = TClassName & {
  children: React.ReactNode;
};

export type TSplashPageCardWrapperTest = TWrapperModel;

export type TCardTextBlock = TWrapperModel;

export type TCardImageBlock = TClassName & {
  image?: string;
};

export type TCardText = TClassName & {
  text?: string;
};

export type TCardButtonsWrapper = TWrapperModel;

export type TCardButton = TClassName & {
  title?: string;
  buttonAction?: () => void;
};
