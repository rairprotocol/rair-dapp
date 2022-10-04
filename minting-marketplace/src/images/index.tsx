// import Images
import binance from './binance-diamond.svg';
import blackBg from './BlackBg.webp';
import whiteBg from './ClayBg.webp';
import curios from './curios.webp';
import dapper from './dapper-logo.webp';
import avatar from './defaultAvatarProfile.webp';
import discordIconWhiteNoBorder from './discord-white-no-border.webp';
import documentIcon from './documentIcon.svg';
import ethereum from './ethereum-logo.svg';
import metamaskLogo from './metamask_logo.webp';
import minTable from './mintable-logo.webp';
import oneOf from './oneOf-logo.webp';
import openSea from './openSea-logo.webp';
// import Icons
import polygonMatic from './polygon-matic.svg';
import logoBlackMobile from './RAIR-Tech-Logo-POWERED-BY-BLACK-2021.webp';
import logoWhiteMobile from './RAIR-Tech-Logo-POWERED-BY-WHITE-2021.webp';
import rairTechLogoBlue from './rairLogo_blue.webp';
import rairTechLogoBlack from './rairTechLogoBlack.webp';
import rairTechLogoWhite from './rairTechLogoWhite.webp';
import rarible from './rarible-logo.webp';

// images
export const bgLogoBlack = blackBg;
export const bgLogoWhite = whiteBg;
export const headerLogoWhiteMobile = logoWhiteMobile;
export const headerLogoBlackMobile = logoBlackMobile;
export const headerLogoBlack = rairTechLogoBlack;
export const headerLogoWhite = rairTechLogoWhite;
export const RairLogoBlue = rairTechLogoBlue;
export const metaMaskIcon = metamaskLogo;
export const defaultAvatar = avatar;
export const OpenSea = openSea;
export const Rarible = rarible;
export const OneOf = oneOf;
export const Dapper = dapper;
export const MinTable = minTable;
export const Curios = curios;

// Icons
export const discrodIconNoBorder = discordIconWhiteNoBorder;
export const MaticLogo = polygonMatic;
export const BinanceDiamond = binance;
export const EthereumLogo = ethereum;
export const DocumentIcon = documentIcon;

export const DiscordIcon = ({ color, primaryColor }) => {
  return (
    <svg
      width="20px"
      height="20px"
      viewBox="0 0 71 55"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0)">
        <path
          d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"
          fill={primaryColor === 'rhyno' ? '#D0D0D0' : color}
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect
            width="71px"
            height="55px"
            fill={primaryColor === 'rhyno' ? '#D0D0D0' : color}
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export const TelegramIcon = ({ color, primaryColor }) => {
  return (
    <svg
      width="19"
      height="16"
      viewBox="0 0 19 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.77998 14.6505L7.05998 10.4205L14.74 3.50046C15.08 3.19046 14.67 3.04046 14.22 3.31046L4.73998 9.30046L0.639983 8.00046C-0.240017 7.75046 -0.250017 7.14046 0.839983 6.70046L16.81 0.540456C17.54 0.210456 18.24 0.720456 17.96 1.84046L15.24 14.6505C15.05 15.5605 14.5 15.7805 13.74 15.3605L9.59998 12.3005L7.60998 14.2305C7.37998 14.4605 7.18998 14.6505 6.77998 14.6505Z"
        fill={primaryColor === 'rhyno' ? '#D0D0D0' : color}
      />
    </svg>
  );
};

export const TwitterIcon = ({ color, primaryColor }) => {
  return (
    <svg
      width="19"
      height="15"
      viewBox="0 0 19 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18.4731 0.250347C17.6896 0.798448 16.8221 1.21766 15.9041 1.49183C15.4113 0.929926 14.7564 0.531662 14.028 0.350904C13.2996 0.170146 12.5327 0.215614 11.8312 0.48116C11.1297 0.746706 10.5273 1.21952 10.1056 1.83565C9.68384 2.45178 9.46308 3.1815 9.47314 3.92611V4.73754C8.0353 4.77452 6.61055 4.45826 5.32579 3.81693C4.04103 3.17561 2.93613 2.22912 2.10951 1.06177C2.10951 1.06177 -1.16322 8.36462 6.20042 11.6103C4.51539 12.7447 2.50809 13.3135 0.473145 13.2332C7.83678 17.2903 16.8368 13.2332 16.8368 3.90177C16.836 3.67575 16.8141 3.45029 16.7713 3.22829C17.6064 2.41158 18.1956 1.38043 18.4731 0.250347Z"
        fill={primaryColor === 'rhyno' ? '#D0D0D0' : color}
      />
    </svg>
  );
};

export const SunIcon = ({ primaryColor }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 16.6895C14.5888 16.6895 16.6875 14.5908 16.6875 12.002C16.6875 9.41312 14.5888 7.31445 12 7.31445C9.41116 7.31445 7.3125 9.41312 7.3125 12.002C7.3125 14.5908 9.41116 16.6895 12 16.6895Z"
        stroke={primaryColor === 'rhyno' ? '#E882D5' : '#7879F1'}
        strokeWidth="1.13838"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 1.6875V3.56382"
        stroke={primaryColor === 'rhyno' ? '#E882D5' : '#7879F1'}
        strokeWidth="1.13838"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 20.4375V22.3138"
        stroke={primaryColor === 'rhyno' ? '#E882D5' : '#7879F1'}
        strokeWidth="1.13838"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.70605 4.70703L6.03824 6.03922"
        stroke={primaryColor === 'rhyno' ? '#E882D5' : '#7879F1'}
        strokeWidth="1.13838"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.9629 17.9629L19.2951 19.2951"
        stroke={primaryColor === 'rhyno' ? '#E882D5' : '#7879F1'}
        strokeWidth="1.13838"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.6875 12H3.56382"
        stroke={primaryColor === 'rhyno' ? '#E882D5' : '#7879F1'}
        strokeWidth="1.13838"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.4375 12H22.3138"
        stroke={primaryColor === 'rhyno' ? '#E882D5' : '#7879F1'}
        strokeWidth="1.13838"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.70605 19.2951L6.03824 17.9629"
        stroke={primaryColor === 'rhyno' ? '#E882D5' : '#7879F1'}
        strokeWidth="1.13838"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.9629 6.03922L19.2951 4.70703"
        stroke={primaryColor === 'rhyno' ? '#E882D5' : '#7879F1'}
        strokeWidth="1.13838"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const BellIcon = ({ primaryColor }) => {
  return (
    <svg
      width="18"
      height="20"
      viewBox="0 0 18 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14.3333 6.40096C14.3333 4.96853 13.7714 3.59478 12.7712 2.5819C11.771 1.56903 10.4145 1 9 1C7.58551 1 6.22896 1.56903 5.22876 2.5819C4.22857 3.59478 3.66667 4.96853 3.66667 6.40096C3.66667 12.7021 1 14.5024 1 14.5024H17C17 14.5024 14.3333 12.7021 14.3333 6.40096Z"
        stroke={primaryColor === 'rhyno' ? '#D0D0D0' : '#fff'}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5375 18.1016C10.3812 18.3744 10.1569 18.6008 9.887 18.7583C9.61712 18.9157 9.31114 18.9985 8.99969 18.9985C8.68824 18.9985 8.38226 18.9157 8.11238 18.7583C7.8425 18.6008 7.61819 18.3744 7.46191 18.1016"
        stroke={primaryColor === 'rhyno' ? '#D0D0D0' : '#fff'}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const WarningErrorIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="12" fill="#F63419" />
      <path
        d="M11.0793 15.384L10.9353 7.08H13.0633L12.9193 15.384H11.0793ZM10.9353 19V16.76H13.0633V19H10.9353Z"
        fill="white"
      />
    </svg>
  );
};

export const MenuIcon = ({ primaryColor }) => {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_635_2475)">
        <path
          d="M1.41016 5.57812H12.3477"
          stroke={primaryColor === 'rhyno' ? '#222021' : 'white'}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M1.41016 12.8691H24.3268"
          stroke={primaryColor === 'rhyno' ? '#222021' : 'white'}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M13.9102 20.1602L24.3268 20.1602"
          stroke={primaryColor === 'rhyno' ? '#222021' : 'white'}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_635_2475">
          <rect
            width="25"
            height="25"
            fill="white"
            transform="translate(0.368164 0.369141)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export const CloseIconMobile = ({ primaryColor }) => {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4.78516 20.584L20.9507 5.15275"
        stroke={primaryColor === 'rhyno' ? '#222021' : 'white'}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20.9502 20.584L4.78463 5.15275"
        stroke={primaryColor === 'rhyno' ? '#222021' : 'white'}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
