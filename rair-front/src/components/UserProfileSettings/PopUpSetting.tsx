import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Popup } from "reactjs-popup";
import {
  faBars,
  faSignOutAlt,
  faUpload,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatEther } from "ethers";

import useConnectUser from "../../hooks/useConnectUser";
import useContracts from "../../hooks/useContracts";
import { useAppSelector } from "../../hooks/useReduxHooks";
import useServerSettings from "../../hooks/useServerSettings";
import { RairFavicon, RairTokenLogo, VerifiedIcon } from "../../images";
import LoadingComponent from "../common/LoadingComponent";
import { TooltipBox } from "../common/Tooltip/TooltipBox";

import useWeb3Tx from "./../../hooks/useWeb3Tx";
import EditMode from "./EditMode/EditMode";
import defaultPictures from "./images/defaultUserPictures.png";
import { SvgFactoryIcon } from "./SettingsIcons/SettingsIcons";

const PopUpSettings = ({ showAlert, setTabIndexItems }) => {
  const settingBlockRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const [next, setNext] = useState(false);
  const [userName, setUserName] = useState<string | undefined>();
  const [userEmail, setUserEmail] = useState<string | undefined>();
  const [triggerState, setTriggerState] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [userBalance, setUserBalance] = useState<string>("");
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(false);
  const [userBalanceTrigger, setUserBalanceTrigger] = useState<boolean>(false);
  const [userRairBalance, setUserRairBalance] = useState<bigint | undefined>();

  const hotdropsVar = import.meta.env.VITE_TESTNET;
  const { getBlockchainData } = useServerSettings();

  const { primaryColor, textColor, iconColor, isDarkMode } = useAppSelector(
    (store) => store.colors
  );

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | undefined>();
  const { adminRights, isLoggedIn, nickName, avatar, email, ageVerified } =
    useAppSelector((store) => store.user);

  const { logoutUser } = useConnectUser();

  const { mainTokenInstance } = useContracts();
  const { currentUserAddress, connectedChain } = useAppSelector(
    (store) => store.web3
  );

  const { web3TxHandler } = useWeb3Tx();

  const getUserRairBalance = useCallback(async () => {
    if (
      !userBalanceTrigger ||
      !currentUserAddress ||
      !mainTokenInstance ||
      userRairBalance
    ) {
      return;
    }
    const result = await web3TxHandler(mainTokenInstance, "balanceOf", [
      currentUserAddress,
    ]);
    if (result) {
      setUserRairBalance(result);
    }
  }, [
    userBalanceTrigger,
    currentUserAddress,
    mainTokenInstance,
    userRairBalance,
    web3TxHandler,
  ]);

  useEffect(() => {
    getUserRairBalance();
  }, [getUserRairBalance]);

  const onChangeEditMode = useCallback(() => {
    setEditMode((prev) => !prev);
  }, [setEditMode]);

  useEffect(() => {
    if (isLoggedIn) {
      setUserName(nickName);
      setUserEmail(email);
      if (avatar) {
        setImagePreviewUrl(avatar);
      }
    }
  }, [avatar, email, isLoggedIn, nickName]);

  const getBalance = useCallback(async () => {
    if (currentUserAddress && mainTokenInstance?.runner?.provider) {
      setIsLoadingBalance(true);
      const balance =
        await mainTokenInstance?.runner?.provider?.getBalance(
          currentUserAddress
        );

      if (balance !== undefined) {
        const result = formatEther(balance.toString());
        const final = Number(result.toString())?.toFixed(2)?.toString();

        setUserBalance(final);
        setIsLoadingBalance(false);
      }
    }
  }, [currentUserAddress, mainTokenInstance]);

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  const cutUserAddress = () => {
    if (userName) {
      const length = userName.length;
      return length > 13
        ? userName.slice(0, 5) + "...." + userName.slice(length - 4)
        : userName;
    }
    if (currentUserAddress) {
      return (
        currentUserAddress.slice(0, 4) + "...." + currentUserAddress.slice(38)
      );
    }
  };

  const pushToUploadVideo = (tab: number) => {
    setTabIndexItems(tab);
    navigate("/demo/upload");
  };

  const pushToFactory = () => {
    navigate("/creator/deploy");
  };

  const pushToProfile = () => {
    navigate(`/${currentUserAddress}`);
    setTriggerState(false);
  };

  const handlePopUp = () => {
    setNext((prev) => !prev);
  };

  const onCloseNext = useCallback(() => {
    if (!triggerState) {
      setNext(false);
    }
  }, [triggerState]);

  useEffect(() => {
    onCloseNext();
  }, [onCloseNext]);

  useEffect(() => {
    return () => setEditMode(false);
  }, []);

  return (
    <>
      <button
        className={`button profile-btn ${!isDarkMode ? "rhyno" : ""}`}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <div
          className={`profile-buy-button ${!isDarkMode ? "rhyno" : ""}`}
        ></div>
        <div
          onClick={() => setUserBalanceTrigger((prev) => !prev)}
          className={`profile-user-balance ${!isDarkMode ? "rhyno" : ""}`}
        >
          <img
            style={{
              marginRight: "5px",
            }}
            src={!isDarkMode ? RairFavicon : RairTokenLogo}
            alt="logo"
          />
          {getBlockchainData(connectedChain) && (
            <img src={getBlockchainData(connectedChain)?.image} alt="logo" />
          )}
        </div>
        <div
          onClick={() => setTriggerState((prev) => !prev)}
          className="profile-btn-img"
          style={{
            height: "100%",
            width: "37px",
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            overflow: "hidden",
            background: `${imagePreviewUrl === null ? "var(--royal-ice)" : ""}`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {imagePreviewUrl ? (
            <img
              onClick={(event) =>
                event.altKey && event.shiftKey
                  ? alert("Front v0.06.12.22 iFrame+qualityVideo")
                  : null
              }
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              src={imagePreviewUrl === null ? defaultPictures : imagePreviewUrl}
              alt="User Avatar"
            />
          ) : (
            <FontAwesomeIcon icon={faUser} />
          )}
        </div>
        {ageVerified && (
          <img
            style={{
              position: "absolute",
              width: 20,
              height: 20,
              top: "-1px",
              left: "45%",
            }}
            src={VerifiedIcon}
            alt="verified icon"
          />
        )}
        <div
          onClick={() => setTriggerState((prev) => !prev)}
          style={{
            display: "flex",
            width: "140px",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 5px",
          }}
        >
          <span
            style={{
              padding: "0 0px 0 2px",
              color: textColor,
              fontSize: "14px",
            }}
          >
            {cutUserAddress()}
          </span>
          <FontAwesomeIcon
            icon={faBars}
            className="icon-menu"
            style={{
              color:
                import.meta.env.VITE_TESTNET === "true"
                  ? `${iconColor === "#1486c5" ? "#F95631" : iconColor}`
                  : `${iconColor === "#1486c5" ? "#E882D5" : iconColor}`,
              WebkitBackgroundClip: "text",
            }}
          />
        </div>
      </button>
      <Popup
        className="popup-settings-block"
        open={userBalanceTrigger}
        position="bottom center"
        closeOnDocumentClick
        onClose={() => {
          setUserBalanceTrigger(false);
        }}
      >
        <div
          ref={settingBlockRef}
          className={`user-popup ${primaryColor === "#dedede" ? "rhyno" : ""}`}
          style={{
            background: `${
              primaryColor === "#dedede"
                ? "#fff"
                : `color-mix(in srgb, ${primaryColor}, #888888)`
            }`,
            borderRadius: 16,
            filter: "drop-shadow(0.4px 0.5px 1px black)",
            border: `${
              primaryColor === "#dedede" ? "1px solid #DEDEDE" : "none"
            }`,
            marginTop: `${showAlert ? "65px" : "12px"}`,
          }}
        >
          <div
            style={{
              padding: "10px",
              color: `${primaryColor === "#dedede" ? "#000" : "#fff"}`,
              display: "flex",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
              }}
            >
              <div
                style={{
                  display: "flex",
                  marginBottom: "15px",
                }}
              >
                <div>
                  {isLoadingBalance ? (
                    <LoadingComponent size={18} />
                  ) : (
                    userBalance
                  )}
                </div>
                <div>
                  {getBlockchainData(connectedChain) && (
                    <img
                      style={{
                        height: "25px",
                        marginLeft: "15px",
                      }}
                      src={getBlockchainData(connectedChain)?.image}
                      alt="logo"
                    />
                  )}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                }}
              >
                <div>
                  {isLoadingBalance ? (
                    <LoadingComponent size={18} />
                  ) : (
                    formatEther(userRairBalance || 0)
                  )}
                </div>
                <div>
                  <img
                    style={{
                      height: "25px",
                      marginLeft: "15px",
                    }}
                    src={
                      primaryColor === "#dedede" ? RairFavicon : RairTokenLogo
                    }
                    alt="logo"
                  />
                </div>
              </div>
            </div>
            <div
              style={{
                marginLeft: "25px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  marginBottom: "10px",
                }}
                className="user-new-balance-title-text"
              >
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
                >
                  Exchange rate
                </div>
                <div
                  style={{
                    fontSize: "14px",
                  }}
                >
                  50K RAIR/bETH
                </div>
              </div>
              <div>
                <TooltipBox position={"bottom"} title="Coming soon!">
                  <button
                    style={{
                      background: "#7762D7",
                      color: "#fff",
                      border: "1px solid #000",
                      borderRadius: "12px",
                      width: "120px",
                      height: "50px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    Top up
                  </button>
                </TooltipBox>
              </div>
            </div>
          </div>
        </div>
      </Popup>
      <Popup
        className="popup-settings-block"
        open={triggerState}
        position="bottom center"
        closeOnDocumentClick
        onClose={() => {
          setTriggerState(false);
          setEditMode(false);
        }}
      >
        <div
          ref={settingBlockRef}
          className={`user-popup ${primaryColor === "#dedede" ? "rhyno" : ""}`}
          style={{
            background: `${
              primaryColor === "#dedede"
                ? "#fff"
                : `color-mix(in srgb, ${primaryColor}, #888888)`
            }`,
            borderRadius: 16,
            filter: "drop-shadow(0.4px 0.5px 1px black)",
            border: `${
              primaryColor === "#dedede" ? "1px solid #DEDEDE" : "none"
            }`,
            marginTop: `${showAlert ? "65px" : "12px"}`,
          }}
        >
          {!next ? (
            <div>
              <ul className="list-popup">
                <li
                  // onClick={handlePopUp}
                  onClick={pushToProfile}
                  style={{
                    color:
                      primaryColor === "#dedede" ? "rgb(41, 41, 41)" : "white",
                  }}
                >
                  <FontAwesomeIcon icon={faUser} style={{ color: iconColor }} />{" "}
                  Profile settings
                </li>
                {/* {hotdropsVar !== 'true' && ( */}
                {/* {(hotdropsVar === 'true'
                  ? isLoggedIn && adminRights
                  : isLoggedIn) && (
                  <li
                    onClick={() => pushToUploadVideo(2)}
                    style={{
                      color: textColor
                    }}>
                    <FontAwesomeIcon
                      icon={faUpload}
                      style={{ color: iconColor }}
                    />{' '}
                    Upload video
                  </li>
                )} */}
                {/* )} */}
                {/* <li
                  onClick={() => pushToMyItems(2)}
                  style={{
                    color:
                      primaryColor === 'rhyno' ? 'rgb(41, 41, 41)' : 'white'
                  }}>
                  <SvgMyFavorites primaryColor={primaryColor} /> My favorites
                </li> */}
                {/* <li
                  onClick={() => pushToMyItems(0)}
                  style={{
                    color:
                      primaryColor === 'rhyno' ? 'rgb(41, 41, 41)' : 'white'
                  }}>
                  <SvgItemsIcon primaryColor={primaryColor} /> My Items
                </li> */}
                {/* {import.meta.env.VITE_DISABLE_CREATOR_VIEWS !== 'true' &&
                  adminRights && (
                    <li
                      onClick={pushToFactory}
                      style={{
                        color:
                          primaryColor === '#dedede'
                            ? 'rgb(41, 41, 41)'
                            : 'white'
                      }}>
                      <SvgFactoryIcon
                        customSecondaryButtonColor={iconColor}
                        primaryColor={primaryColor}
                      />{' '}
                      Factory
                    </li>
                  )} */}
                <li
                  onClick={logoutUser}
                  style={{
                    color:
                      primaryColor === "#dedede" ? "rgb(41, 41, 41)" : "white",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    style={{
                      color:
                        iconColor === "#1486c5"
                          ? primaryColor === "#dedede"
                            ? "#222021"
                            : "white"
                          : iconColor,
                    }}
                  />
                  Logout
                </li>
              </ul>
            </div>
          ) : (
            <EditMode
              handlePopUp={handlePopUp}
              imagePreviewUrl={imagePreviewUrl}
              editMode={editMode}
              onChangeEditMode={onChangeEditMode}
              userEmail={userEmail}
              mainName={userName ? userName : cutUserAddress()}
              setMainName={setUserName}
              setMainEmail={setUserEmail}
              setImagePreviewUrl={setImagePreviewUrl}
            />
          )}
        </div>
      </Popup>
    </>
  );
};

export default PopUpSettings;
