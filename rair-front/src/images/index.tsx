// import Images
import astar from "./astar.ico";
import baseMainnet from "./base-logo.svg";
import binance from "./binance-diamond.svg";
import blackBg from "./BlackBg.webp";
import whiteBg from "./ClayBg.webp";
import curios from "./curios.webp";
import dapper from "./dapper-logo.webp";
import newDefaultRairBG from "./Default-RairTech.webp";
import avatar from "./defaultAvatarProfile.webp";
import discordIconWhiteNoBorder from "./discord-white-no-border.webp";
import documentIcon from "./documentIcon.svg";
import ethereum from "./ethereum-logo.svg";
import tokenLogoRair from "./favicon2.png";
import grandpaGif from "./grandpa.gif";
import hotdropsDefaultBanner from "./hotDrops_defaultBanner.png";
import defaultHotDropsImg from "./hotdrops-default.png";
import HotdropsFaviconDefault from "./Hotdrops-favicon.ico";
import logoHotDropsLight from "./HotdropsLogoLight.png";
import kigGif from "./kid.gif";
import lennyGif from "./lenny.gif";
import loadingFavicon from "./loading-favicon.svg";
import logoHotDrops from "./logo-hotdrops.png";
import metamaskLogo from "./metamask_logo.webp";
import minTable from "./mintable-logo.webp";
import hotdropsLogoMobile from "./mobile-logo-hotdrops.png";
import oneOf from "./oneOf-logo.webp";
import openSea from "./openSea-logo.webp";
// import Icons
import polygonMatic from "./polygon-matic.svg";
import RairFaviconDefault from "./rair_favicon.ico";
import logoBlackMobile from "./RAIR-Tech-Logo-POWERED-BY-BLACK-2021.webp";
import logoWhiteMobile from "./RAIR-Tech-Logo-POWERED-BY-WHITE-2021.webp";
import rairTechLogoBlue from "./rairLogo_blue.webp";
import rairTechLogoBlack from "./rairTechLogoBlack.webp";
import rairTechLogoWhite from "./rairTechLogoWhite.webp";
import rarible from "./rarible-logo.webp";
import soniumLogo from "./sonium_logo.svg";
import verifiedIcon from "./verify-icon.png";
import yotiLogo from "./yoti-logo.png";
import coreIdLogo from "./coreNewIcon.png";
import rairProtocol from "./rair-protocol.png";
import lockIcon from "./lock-icon.png";

import { useAppSelector } from "../hooks/useReduxHooks";

// images
export const bgLogoBlack = blackBg;
export const bgLogoWhite = whiteBg;
export const RairFavicon = RairFaviconDefault;
export const HotdropsFavicon = HotdropsFaviconDefault;
export const VerifiedIcon = verifiedIcon;
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
export const HotDropsLogo = logoHotDrops;
export const HotDropsLogoLight = logoHotDropsLight;
export const defaultHotDrops = defaultHotDropsImg;
export const HotDropsLogoMobile = hotdropsLogoMobile;
export const hotDropsDefaultBanner = hotdropsDefaultBanner;
export const GrandpaWait = grandpaGif;
export const LennyWait = lennyGif;
export const KidWait = kigGif;
export const YotiLogo = yotiLogo;
export const RairBackground = newDefaultRairBG;
export const RairTokenLogo = tokenLogoRair;
export const RairProtocol = rairProtocol;

// Icons
export const discrodIconNoBorder = discordIconWhiteNoBorder;
export const MaticLogo = polygonMatic;
export const BinanceDiamond = binance;
export const EthereumLogo = ethereum;
export const DocumentIcon = documentIcon;
export const AstarLogo = astar;
export const BaseLogo = baseMainnet;
export const SoniumLogo = soniumLogo;
export const LoadingDefaultFavicon = loadingFavicon;
export const CoreIdLogo = coreIdLogo;
export const LockIcon = lockIcon;

export const DiscordIcon = ({ color, primaryColor }) => {
  return (
    <svg
      width="20px"
      height="20px"
      viewBox="0 0 71 55"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0)">
        <path
          d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"
          fill={primaryColor === "#dedede" ? "#D0D0D0" : color}
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect
            width="71px"
            height="55px"
            fill={primaryColor === "#dedede" ? "#D0D0D0" : color}
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
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.77998 14.6505L7.05998 10.4205L14.74 3.50046C15.08 3.19046 14.67 3.04046 14.22 3.31046L4.73998 9.30046L0.639983 8.00046C-0.240017 7.75046 -0.250017 7.14046 0.839983 6.70046L16.81 0.540456C17.54 0.210456 18.24 0.720456 17.96 1.84046L15.24 14.6505C15.05 15.5605 14.5 15.7805 13.74 15.3605L9.59998 12.3005L7.60998 14.2305C7.37998 14.4605 7.18998 14.6505 6.77998 14.6505Z"
        fill={primaryColor === "#dedede" ? "#D0D0D0" : color}
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
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.4731 0.250347C17.6896 0.798448 16.8221 1.21766 15.9041 1.49183C15.4113 0.929926 14.7564 0.531662 14.028 0.350904C13.2996 0.170146 12.5327 0.215614 11.8312 0.48116C11.1297 0.746706 10.5273 1.21952 10.1056 1.83565C9.68384 2.45178 9.46308 3.1815 9.47314 3.92611V4.73754C8.0353 4.77452 6.61055 4.45826 5.32579 3.81693C4.04103 3.17561 2.93613 2.22912 2.10951 1.06177C2.10951 1.06177 -1.16322 8.36462 6.20042 11.6103C4.51539 12.7447 2.50809 13.3135 0.473145 13.2332C7.83678 17.2903 16.8368 13.2332 16.8368 3.90177C16.836 3.67575 16.8141 3.45029 16.7713 3.22829C17.6064 2.41158 18.1956 1.38043 18.4731 0.250347Z"
        fill={primaryColor === "#dedede" ? "#D0D0D0" : color}
      />
    </svg>
  );
};

export const InstagramIcon = ({ color, primaryColor }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
    >
      <path
        fill={primaryColor === "#dedede" ? "#D0D0D0" : color}
        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
      />
    </svg>
  );
};

export const SunIcon = () => {
  const { isDarkMode } = useAppSelector((store) => store.colors);
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 16.6895C14.5888 16.6895 16.6875 14.5908 16.6875 12.002C16.6875 9.41312 14.5888 7.31445 12 7.31445C9.41116 7.31445 7.3125 9.41312 7.3125 12.002C7.3125 14.5908 9.41116 16.6895 12 16.6895Z"
        stroke={!isDarkMode ? "#E882D5" : "#7879F1"}
        strokeWidth="1.13838"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 1.6875V3.56382"
        stroke={!isDarkMode ? "#E882D5" : "#7879F1"}
        strokeWidth="1.13838"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 20.4375V22.3138"
        stroke={!isDarkMode ? "#E882D5" : "#7879F1"}
        strokeWidth="1.13838"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.70605 4.70703L6.03824 6.03922"
        stroke={!isDarkMode ? "#E882D5" : "#7879F1"}
        strokeWidth="1.13838"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.9629 17.9629L19.2951 19.2951"
        stroke={!isDarkMode ? "#E882D5" : "#7879F1"}
        strokeWidth="1.13838"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.6875 12H3.56382"
        stroke={!isDarkMode ? "#E882D5" : "#7879F1"}
        strokeWidth="1.13838"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.4375 12H22.3138"
        stroke={!isDarkMode ? "#E882D5" : "#7879F1"}
        strokeWidth="1.13838"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.70605 19.2951L6.03824 17.9629"
        stroke={!isDarkMode ? "#E882D5" : "#7879F1"}
        strokeWidth="1.13838"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.9629 6.03922L19.2951 4.70703"
        stroke={!isDarkMode ? "#E882D5" : "#7879F1"}
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
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.3333 6.40096C14.3333 4.96853 13.7714 3.59478 12.7712 2.5819C11.771 1.56903 10.4145 1 9 1C7.58551 1 6.22896 1.56903 5.22876 2.5819C4.22857 3.59478 3.66667 4.96853 3.66667 6.40096C3.66667 12.7021 1 14.5024 1 14.5024H17C17 14.5024 14.3333 12.7021 14.3333 6.40096Z"
        stroke={primaryColor === "#dedede" ? "#D0D0D0" : "#fff"}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5375 18.1016C10.3812 18.3744 10.1569 18.6008 9.887 18.7583C9.61712 18.9157 9.31114 18.9985 8.99969 18.9985C8.68824 18.9985 8.38226 18.9157 8.11238 18.7583C7.8425 18.6008 7.61819 18.3744 7.46191 18.1016"
        stroke={primaryColor === "#dedede" ? "#D0D0D0" : "#fff"}
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
      xmlns="http://www.w3.org/2000/svg"
    >
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
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_635_2475)">
        <path
          d="M1.41016 5.57812H12.3477"
          stroke={primaryColor === "#dedede" ? "#222021" : "white"}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M1.41016 12.8691H24.3268"
          stroke={primaryColor === "#dedede" ? "#222021" : "white"}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M13.9102 20.1602L24.3268 20.1602"
          stroke={primaryColor === "#dedede" ? "#222021" : "white"}
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
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.78516 20.584L20.9507 5.15275"
        stroke={primaryColor === "#dedede" ? "#222021" : "white"}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20.9502 20.584L4.78463 5.15275"
        stroke={primaryColor === "#dedede" ? "#222021" : "white"}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const ExpandImageIcon = ({ primaryColor }) => {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 14V17C1 17.5304 1.21071 18.0391 1.58579 18.4142C1.96086 18.7893 2.46957 19 3 19H6"
        stroke={primaryColor === "#dedede" ? "#222021" : "white"}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1 6V3C1 2.46957 1.21071 1.96086 1.58579 1.58579C1.96086 1.21071 2.46957 0.999999 3 0.999999H6"
        stroke={primaryColor === "#dedede" ? "#222021" : "white"}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 14V17C19 17.5304 18.7893 18.0391 18.4142 18.4142C18.0391 18.7893 17.5304 19 17 19H14"
        stroke={primaryColor === "#dedede" ? "#222021" : "white"}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 6V3C19 2.46957 18.7893 1.96086 18.4142 1.58579C18.0391 1.21071 17.5304 0.999999 17 0.999999H14"
        stroke={primaryColor === "#dedede" ? "#222021" : "white"}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const VideoIcon = ({ primaryColor }) => {
  return (
    <svg
      width="1.3rem"
      height="1.3rem"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 8C16 6.34315 14.6569 5 13 5H4C2.34315 5 1 6.34315 1 8V16C1 17.6569 2.34315 19 4 19H13C14.6569 19 16 17.6569 16 16V13.9432L21.4188 17.8137C21.7236 18.0315 22.1245 18.0606 22.4576 17.8892C22.7907 17.7178 23 17.3746 23 17V7C23 6.62541 22.7907 6.28224 22.4576 6.11083C22.1245 5.93943 21.7236 5.96854 21.4188 6.18627L16 10.0568V8ZM16.7205 12L21 8.94319V15.0568L16.7205 12ZM13 7C13.5523 7 14 7.44772 14 8V12V16C14 16.5523 13.5523 17 13 17H4C3.44772 17 3 16.5523 3 16V8C3 7.44772 3.44772 7 4 7H13Z"
        fill={primaryColor === "#dedede" ? "#222021" : "white"}
      />
    </svg>
  );
};

export const NFTTabIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width="1.3rem"
      height="1.3rem"
      viewBox="0 0 100 100"
      xmlSpace="preserve"
    >
      <defs></defs>
      <g>
        <path
          d="M 45 90 c -1.206 0 -2.412 -0.311 -3.488 -0.931 L 8.58 70.054 c -2.152 -1.241 -3.488 -3.556 -3.488 -6.04 V 25.987 c 0 -2.485 1.337 -4.8 3.489 -6.041 L 41.512 0.932 c 2.152 -1.242 4.824 -1.243 6.977 0 L 81.42 19.945 c 2.151 1.241 3.488 3.556 3.488 6.041 v 38.027 c 0 2.485 -1.337 4.8 -3.489 6.041 L 48.488 89.068 C 47.412 89.689 46.206 90 45 90 z M 45 5.998 c -0.168 0 -0.336 0.043 -0.487 0.13 L 11.58 25.142 c -0.301 0.174 -0.488 0.498 -0.488 0.845 v 38.027 c 0 0.347 0.187 0.671 0.487 0.844 l 32.933 19.015 c 0.3 0.172 0.674 0.174 0.975 0 L 78.42 64.859 c 0.301 -0.174 0.487 -0.497 0.487 -0.845 V 25.987 c 0 -0.348 -0.187 -0.671 -0.486 -0.844 L 45.487 6.128 C 45.337 6.041 45.168 5.998 45 5.998 z"
          // style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
          // transform=" matrix(1 0 0 1 0 0) "
          strokeLinecap="round"
        />
        <path
          d="M 32.122 58.462 c -1.019 0 -1.992 -0.521 -2.549 -1.418 l -7.438 -11.983 v 10.401 c 0 1.657 -1.343 3 -3 3 c -1.657 0 -3 -1.343 -3 -3 V 34.538 c 0 -1.34 0.889 -2.518 2.177 -2.885 c 1.292 -0.365 2.666 0.165 3.372 1.303 l 7.438 11.983 V 34.538 c 0 -1.657 1.343 -3 3 -3 c 1.657 0 3 1.343 3 3 v 20.924 c 0 1.34 -0.889 2.518 -2.177 2.885 C 32.672 58.425 32.395 58.462 32.122 58.462 z"
          // style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
          // transform=" matrix(1 0 0 1 0 0) "
          strokeLinecap="round"
        />
        <path
          d="M 42.236 58.462 c -1.657 0 -3 -1.343 -3 -3 V 34.538 c 0 -1.657 1.343 -3 3 -3 h 8.321 c 1.657 0 3 1.343 3 3 s -1.343 3 -3 3 h -5.321 v 17.924 C 45.236 57.119 43.893 58.462 42.236 58.462 z"
          // style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
          // transform=" matrix(1 0 0 1 0 0) "
          strokeLinecap="round"
        />
        <path
          d="M 50.557 48 h -8.321 c -1.657 0 -3 -1.343 -3 -3 c 0 -1.657 1.343 -3 3 -3 h 8.321 c 1.657 0 3 1.343 3 3 C 53.557 46.657 52.214 48 50.557 48 z"
          // style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
          // transform=" matrix(1 0 0 1 0 0) "
          strokeLinecap="round"
        />
        <path
          d="M 70.865 37.538 H 58.974 c -1.657 0 -3 -1.343 -3 -3 s 1.343 -3 3 -3 h 11.891 c 1.657 0 3 1.343 3 3 S 72.522 37.538 70.865 37.538 z"
          // style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
          // transform=" matrix(1 0 0 1 0 0) "
          strokeLinecap="round"
        />
        <path
          d="M 64.919 58.462 c -1.657 0 -3 -1.343 -3 -3 V 34.538 c 0 -1.657 1.343 -3 3 -3 c 1.657 0 3 1.343 3 3 v 20.924 C 67.919 57.119 66.577 58.462 64.919 58.462 z"
          // style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
          // transform=" matrix(1 0 0 1 0 0) "
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};

export const BillTransferIcon = ({ primaryColor }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512">
      <path
        fill={primaryColor === "#dedede" ? "#19a7f6" : "#19a7f6"}
        d="M535 41c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l64 64c4.5 4.5 7 10.6 7 17s-2.5 12.5-7 17l-64 64c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l23-23L384 112c-13.3 0-24-10.7-24-24s10.7-24 24-24l174.1 0L535 41zM105 377l-23 23L256 400c13.3 0 24 10.7 24 24s-10.7 24-24 24L81.9 448l23 23c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L7 441c-4.5-4.5-7-10.6-7-17s2.5-12.5 7-17l64-64c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9zM96 64H337.9c-3.7 7.2-5.9 15.3-5.9 24c0 28.7 23.3 52 52 52l117.4 0c-4 17 .6 35.5 13.8 48.8c20.3 20.3 53.2 20.3 73.5 0L608 169.5V384c0 35.3-28.7 64-64 64H302.1c3.7-7.2 5.9-15.3 5.9-24c0-28.7-23.3-52-52-52l-117.4 0c4-17-.6-35.5-13.8-48.8c-20.3-20.3-53.2-20.3-73.5 0L32 342.5V128c0-35.3 28.7-64 64-64zm64 64H96v64c35.3 0 64-28.7 64-64zM544 320c-35.3 0-64 28.7-64 64h64V320zM320 352a96 96 0 1 0 0-192 96 96 0 1 0 0 192z"
      />
    </svg>
  );
};
