interface ISvgUserIcon {
  primaryColor?: string;
  width?: string;
  height?: string;
  customSecondaryButtonColor?: string;
}

export const SvgUserIcon: React.FC<ISvgUserIcon> = ({
  primaryColor,
  width,
  height,
  customSecondaryButtonColor
}) => {
  return (
    <svg
      width={width ? width : '16'}
      height={height ? height : '16'}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14.7308 10.1566C14.2006 9.69067 13.5575 9.28809 12.8193 8.96008C12.5038 8.81995 12.1345 8.96204 11.9944 9.27747C11.8542 9.5929 11.9963 9.96216 12.3118 10.1024C12.9342 10.379 13.4706 10.7131 13.9058 11.0956C14.4423 11.567 14.75 12.2496 14.75 12.9688V14.125C14.75 14.4696 14.4696 14.75 14.125 14.75H1.875C1.5304 14.75 1.25 14.4696 1.25 14.125V12.9688C1.25 12.2496 1.55774 11.567 2.09424 11.0956C2.72571 10.5406 4.56555 9.25 8 9.25C10.5502 9.25 12.625 7.17517 12.625 4.625C12.625 2.07483 10.5502 0 8 0C5.44983 0 3.375 2.07483 3.375 4.625C3.375 6.11584 4.08423 7.44397 5.18286 8.29028C3.17261 8.73218 1.92212 9.58276 1.26917 10.1566C0.462646 10.8652 0 11.8901 0 12.9688V14.125C0 15.1589 0.841064 16 1.875 16H14.125C15.1589 16 16 15.1589 16 14.125V12.9688C16 11.8901 15.5374 10.8652 14.7308 10.1566ZM4.625 4.625C4.625 2.76404 6.13904 1.25 8 1.25C9.86096 1.25 11.375 2.76404 11.375 4.625C11.375 6.48596 9.86096 8 8 8C6.13904 8 4.625 6.48596 4.625 4.625Z"
        fill={customSecondaryButtonColor === '#1486c5' ? primaryColor === '#dedede' ? '#222021' : 'white' :customSecondaryButtonColor}
      />
    </svg>
  );
};

export const SvgUpload = ({ width, height, primaryColor, customSecondaryButtonColor }) => {
  return (
    <svg
      width={width ? width : '16'}
      height={height ? height : '16'}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512">
      <path
        d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"
        fill={customSecondaryButtonColor === '#1486c5' ? primaryColor === '#dedede' ? '#222021' : 'white' :customSecondaryButtonColor}
      />
    </svg>
  );
};

export const SvgMyFavorites = ({ primaryColor , customSecondaryButtonColor}) => {
  return (
    <svg
      width="17"
      height="15"
      viewBox="0 0 17 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4.75 1C2.67894 1 1 2.59771 1 4.56859C1 6.15968 1.656 9.93569 8.11563 13.7534C8.34955 13.8917 8.65045 13.8917 8.88437 13.7534C15.344 9.93569 16 6.15968 16 4.56859C16 2.59771 14.321 1 12.25 1C10.179 1 8.5 3.16279 8.5 3.16279C8.5 3.16279 6.82106 1 4.75 1Z"
        stroke={customSecondaryButtonColor === '#1486c5' ? primaryColor === '#dedede' ? '#222021' : 'white' :customSecondaryButtonColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const SvgItemsIcon = ({ primaryColor, customSecondaryButtonColor }) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13 6.89563L5 2.75977"
        stroke={customSecondaryButtonColor === '#1486c5' ? primaryColor === '#dedede' ? '#222021' : 'white' :customSecondaryButtonColor}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 12.1548V5.77971C16.9997 5.50022 16.9174 5.22572 16.7614 4.98374C16.6054 4.74177 16.3811 4.54083 16.1111 4.40109L9.88889 1.21353C9.61863 1.07364 9.31207 1 9 1C8.68793 1 8.38137 1.07364 8.11111 1.21353L1.88889 4.40109C1.6189 4.54083 1.39465 4.74177 1.23863 4.98374C1.08262 5.22572 1.00032 5.50022 1 5.77971V12.1548C1.00032 12.4343 1.08262 12.7088 1.23863 12.9508C1.39465 13.1928 1.6189 13.3937 1.88889 13.5334L8.11111 16.721C8.38137 16.8609 8.68793 16.9345 9 16.9345C9.31207 16.9345 9.61863 16.8609 9.88889 16.721L16.1111 13.5334C16.3811 13.3937 16.6054 13.1928 16.7614 12.9508C16.9174 12.7088 16.9997 12.4343 17 12.1548Z"
        stroke={customSecondaryButtonColor === '#1486c5' ? primaryColor === '#dedede' ? '#222021' : 'white' :customSecondaryButtonColor}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.24023 4.95117L9.00023 8.97547L16.7602 4.95117"
        stroke={customSecondaryButtonColor === '#1486c5' ? primaryColor === '#dedede' ? '#222021' : 'white' :customSecondaryButtonColor}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 16.9995V8.9668"
        stroke={customSecondaryButtonColor === '#1486c5' ? primaryColor === '#dedede' ? '#222021' : 'white' :customSecondaryButtonColor}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const SvgFactoryIcon = ({ primaryColor, customSecondaryButtonColor }) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.1427 8.96311L4.0305 16.4511C3.33602 17.1822 2.21481 17.1822 1.52033 16.4511C1.35538 16.2776 1.22452 16.0716 1.13524 15.8449C1.04596 15.6181 1 15.3751 1 15.1297C1 14.8842 1.04596 14.6412 1.13524 14.4144C1.22452 14.1877 1.35538 13.9817 1.52033 13.8083L8.63248 6.32031"
        stroke={customSecondaryButtonColor === '#1486c5' ? primaryColor === '#dedede' ? '#222021' : 'white' :customSecondaryButtonColor}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3516 11.6065L16.9997 7.76562"
        stroke={customSecondaryButtonColor === '#1486c5' ? primaryColor === '#dedede' ? '#222021' : 'white' :customSecondaryButtonColor}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.0865 8.69936L15.0406 7.5982C14.5385 7.06964 14.2624 6.36489 14.2624 5.61609V4.85849L11.9865 2.44473C11.5545 1.98719 11.0408 1.62402 10.4751 1.37609C9.90933 1.12816 9.30264 1.00035 8.68983 1H6.12109L6.89088 1.72237C7.43764 2.23277 7.87545 2.85939 8.17543 3.56091C8.47542 4.26244 8.63078 5.02294 8.63126 5.79228V7.16654L10.3047 8.92841H12.3714L14.2624 10.611"
        stroke={customSecondaryButtonColor === '#1486c5' ? primaryColor === '#dedede' ? '#222021' : 'white' :customSecondaryButtonColor}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const SvgReloadIcon = ({ primaryColor, customSecondaryButtonColor }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.5 1.66602V6.66602H12.5"
        stroke={customSecondaryButtonColor === '#1486c5' ? primaryColor === '#dedede' ? '#222021' : 'white' :customSecondaryButtonColor}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 9.99903C2.50132 8.55179 2.92133 7.13585 3.70938 5.92198C4.49743 4.70811 5.61985 3.74817 6.94126 3.15794C8.26267 2.56771 9.72662 2.3724 11.1566 2.59557C12.5865 2.81875 13.9213 3.45087 15 4.4157L17.5 6.6657"
        stroke={customSecondaryButtonColor === '#1486c5' ? primaryColor === '#dedede' ? '#222021' : 'white' :customSecondaryButtonColor}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 18.334V13.334H7.5"
        stroke={customSecondaryButtonColor === '#1486c5' ? primaryColor === '#dedede' ? '#222021' : 'white' :customSecondaryButtonColor}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 10C17.4987 11.4472 17.0787 12.8632 16.2906 14.0771C15.5026 15.2909 14.3802 16.2509 13.0587 16.8411C11.7373 17.4313 10.2734 17.6266 8.84345 17.4035C7.41352 17.1803 6.07871 16.5482 5 15.5833L2.5 13.3333"
        stroke={customSecondaryButtonColor === '#1486c5' ? primaryColor === '#dedede' ? '#222021' : 'white' :customSecondaryButtonColor}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
