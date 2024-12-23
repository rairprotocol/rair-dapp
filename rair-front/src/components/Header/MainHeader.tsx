import { FC, Fragment, memo, useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  faSearch,
  faTimes,
  faUserSecret,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

import { IMainHeader, TAxiosCollectionData } from "./header.types";

import { SvgUserIcon } from "../../components/UserProfileSettings/SettingsIcons/SettingsIcons";
import useComponentVisible from "../../hooks/useComponentVisible";
import useConnectUser from "../../hooks/useConnectUser";
import { useAppDispatch, useAppSelector } from "../../hooks/useReduxHooks";
import { dataStatuses } from "../../redux/commonTypes";
import { clearResults, startSearch } from "../../redux/searchbarSlice";
import { fetchNotifications } from "../../redux/notificationsSlice";
import InputField from "../common/InputField";
import { TooltipBox } from "../common/Tooltip/TooltipBox";
import MainLogo from "../GroupLogos/MainLogo";
import ImageCustomForSearch from "../MockUpPage/utils/image/ImageCustomForSearch";
import PopUpNotification from "../UserProfileSettings/PopUpNotification/PopUpNotification";
import wallet from "../../images/wallet.svg";

//imports components
import UserProfileSettings from "./../UserProfileSettings/UserProfileSettings";
import AdminPanel from "./AdminPanel/AdminPanel";
import {
  HeaderContainer /*, SocialHeaderBox */,
} from "./HeaderItems/HeaderItems";
import TalkSalesComponent from "./HeaderItems/TalkToSalesComponent/TalkSalesComponent";

//styles
import "./Header.css";

const MainHeader: FC<IMainHeader> = ({
  goHome,
  creatorViewsDisabled,
  showAlert,
  isSplashPage,
  setTabIndexItems,
  isAboutPage,
  setTokenNumber,
  realChainId,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  console.log({ pathname });


  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(true);
  const {
    primaryColor,
    primaryButtonColor,
    textColor,
    secondaryTextColor,
    secondaryColor,
    iconColor,
    isDarkMode,
  } = useAppSelector((store) => store.colors);
  const { connectUserData } = useConnectUser();
  const { searchResults } = useAppSelector((store) => store.searchbar);
  const { adminRights, superAdmin, isLoggedIn, loginStatus } = useAppSelector(
    (store) => store.user
  );

  const { totalCount: notificationCount, notifications } = useAppSelector(
    (store) => store.notifications
  );

  const { currentUserAddress } = useAppSelector((store) => store.web3);

  const hotdropsVar = import.meta.env.VITE_TESTNET;

  const [textSearch, setTextSearch] = useState<string>("");
  const [adminPanel, setAdminPanel] = useState<boolean>(false);

  const goToExactlyContract = useCallback(
    async (addressId: string, collectionIndexInContract: string) => {
      if (searchResults) {
        const response = await axios.get<TAxiosCollectionData>(
          `/api/contracts/${addressId}`
        );
        const exactlyContractData = {
          blockchain: response.data.contract.blockchain,
          contractAddress: response.data.contract.contractAddress,
          indexInContract: collectionIndexInContract,
        };
        navigate(
          `/collection/${exactlyContractData.blockchain}/${exactlyContractData.contractAddress}/${exactlyContractData.indexInContract}/0`
        );
        setTextSearch("");
        dispatch(clearResults());
      }
    },
    [searchResults, dispatch, navigate]
  );

  const goToExactlyToken = useCallback(
    async (addressId: string, token: string) => {
      if (searchResults) {
        const response = await axios.get<TAxiosCollectionData>(
          `/api/contracts/${addressId}`
        );

        const exactlyTokenData = {
          blockchain: response.data.contract.blockchain,
          contractAddress: response.data.contract.contractAddress,
        };

        navigate(
          `/tokens/${exactlyTokenData.blockchain}/${exactlyTokenData.contractAddress}/0/${token}`
        );
        setTextSearch("");
        dispatch(clearResults());
      }
    },
    [searchResults, dispatch, navigate]
  );

  const goToExactlyUser = (userAddress) => {
    navigate(`/${userAddress}`);
    setTextSearch("");
  };

  useEffect(() => {
    if (currentUserAddress && isLoggedIn) {
      dispatch(fetchNotifications(0));
    }
  }, [currentUserAddress, isLoggedIn]);

  const Highlight = (props) => {
    const { filter, str } = props;
    if (!filter) return str;
    const regexp = new RegExp(
      filter.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"),
      "ig"
    );
    const matchValue = str.match(regexp);

    if (matchValue) {
      return str
        .split(regexp)
        .map((s: string, index: number, array: string[]) => {
          if (index < array.length - 1) {
            const c = matchValue.shift();
            return (
              <Fragment key={index}>
                {s}
                <span className={"highlight"}>{c}</span>
              </Fragment>
            );
          }
          return s;
        });
    }
    return str;
  };

  const handleClearText = () => {
    setTextSearch("");
  };

  useEffect(() => {
    if (textSearch.length > 0) {
      dispatch(startSearch({ searchTerm: textSearch }));
    }
  }, [dispatch, textSearch]);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, []);

  return (
    <HeaderContainer
      hotdrops={hotdropsVar}
      className="col-12 header-master"
      isDarkMode={isDarkMode}
      showAlert={showAlert}
      isSplashPage={isSplashPage}
      realChainId={realChainId}
      secondaryColor={secondaryColor}
      ref={ref}
    >
      <div className="corner-left">
        <MainLogo goHome={goHome} />
      </div>

      <nav>
        <ul
          className="nav-links"
          style={{
            color: secondaryTextColor,
          }}
        >
          <li style={{
            color: pathname === '/' ? '#fff' : undefined,
          }}>
            <Link to="/">Home</Link>
          </li>
          <li
            style={{
              color: pathname === '/about-page' ? '#fff' : undefined,
            }}
          >
            <Link to="/about">About</Link>
          </li>
          <li style={{
            color: pathname === '/user/videos' ? '#fff' : undefined,
          }}>
            <Link to="/user/videos">Videos</Link>
          </li>
          </ul>
      </nav>
      
      <div className="box-header-info corner-right">
        {!isLoggedIn && (
          <div>
            {isAboutPage ? null : (
              <button
                className="btn rair-button btn-connect-wallet"
                onClick={() => connectUserData()}
              >
                {loginStatus === dataStatuses.Loading
                  ? "Please wait... "
                  : "Connect Wallet "}
                <img src={wallet} alt="" />
              </button>
            )}
          </div>
        )}
        <div className="box-connect-btn">
          <div className="social-media">
            {currentUserAddress && (
              <PopUpNotification
                notificationCount={notificationCount}
                realDataNotification={notifications}
              />
            )}
          </div>
        </div>
      </div>
    </HeaderContainer>
  );
};

export default memo(MainHeader);
