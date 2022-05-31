export type ColorChoice = "charcoal" | "rhyno";
type BackgroundBlendModeType =
  | "difference"
  | "exclusion"
  | "soft-light"
  | "hue"
  | "saturation"
  | "color"
  | "luminosity"
  | "hard-light"
  | "color-burn"
  | "color-dodge"
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "darken"
  | "lighten";

export type ColorStoreType = {
  primaryColor: ColorChoice;
  secondaryColor: ColorChoice;
  headerLogo: string;
  textColor: string | undefined;
  backgroundImage: string;
  backgroundImageEffect: {
    backgroundBlendMode: BackgroundBlendModeType | undefined;
  };
};

export type SchemaType = {
  [key: string]: ColorStoreType;
};

