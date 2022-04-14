import React, { useCallback, useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Popup } from "reactjs-popup";
import defaultPictures from './images/defaultUserPictures.png';
import UploadProfilePicture from "./UploadProfilePicture/UploadProfilePicture";

// React Redux types
import * as authTypes from "../../ducks/auth/types";
import * as userTypes from "../../ducks/users/types";
import * as contractTypes from "../../ducks/contracts/types";

const PopUpSettings = ({
  currentUserAddress,
  // adminAccess,
  setLoginDone,
  primaryColor,
}) => {
  const settingBlockRef = useRef();
  const history = useHistory();
  const dispatch = useDispatch();
  const [next, setNext] = useState(false);
  // const [userName, setUserName] = useState(currentUserAddress);
  const [/*openModal*/, setOpenModal] = useState(false);
  const [openModalPic, setOpenModalPic] = useState(false);
  const [, /*userData*/ setUserData] = useState({});
  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [triggerState, setTriggerState] = useState();

  const [imagePreviewUrl, setImagePreviewUrl] = useState(
    // "https://static.dezeen.com/uploads/2021/06/elon-musk-architect_dezeen_1704_col_1.jpg"
    defaultPictures
  );

  const getInfoFromUser = useCallback(async () => {
    // find user
    const result = await fetch(`/api/users/${currentUserAddress}`).then(
      (blob) => blob.json()
    );
    setUserName(result.user.nickName);
    setUserEmail(result.user.email);
    setUserData(result.user);
    setImagePreviewUrl(result.user?.avatar);
  }, [currentUserAddress]);

  useEffect(() => {
    getInfoFromUser();
  }, [getInfoFromUser]);

  useEffect(() => {
    setOpenModal();
  }, [setOpenModal]);

  const logout = () => {
    dispatch({ type: authTypes.GET_TOKEN_COMPLETE, payload: null });
    dispatch({ type: contractTypes.SET_USER_ADDRESS, payload: undefined });
    dispatch({ type: userTypes.SET_ADMIN_RIGHTS, payload: false });
    localStorage.removeItem("token");
    setLoginDone(false);
    history.push("/");
  };

  const pushToMyItems = () => {
    history.push("/my-items");
  };

  const pushToFactory = () => {
    history.push("/creator/deploy");
  };

  const handlePopUp = () => {
    setNext(prev => !prev);
    setOpenModal(prev => !prev);
  }

  const onCloseNext = useCallback(() => {
    if (!triggerState) {
      setNext(false);
    }
  }, [triggerState])

  useEffect(() => {
    onCloseNext();
  }, [onCloseNext])

  if (openModalPic) {
    return (
      <>
        <UploadProfilePicture
          setUserName={setUserName}
          setUserEmail={setUserEmail}
          currentUserAddress={currentUserAddress}
          setOpenModalPic={setOpenModalPic}
          setImagePreviewUrl={setImagePreviewUrl}
          imagePreviewUrl={imagePreviewUrl}
          setTriggerState={setTriggerState}
        />
      </>
    );
  } else {
    <Popup />;
  }

  return (
    <>
      <button
        onClick={() => setTriggerState(prev => !prev)}
        className="button profile-btn"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          alignContent: "center",
          flexDirection: "row",
          backgroundColor: `${primaryColor === "charcoal" ? "#222021" : "#D3D2D3"
            }`,
        }}
      >
        <img
          style={{
            position: "absolute",
            width: "30px",
            height: "100%",
            objectFit: "cover",
            left: 5,
            top: 0,
            transform: 'scale(0.8)',
          }}
          src={
            imagePreviewUrl === null
              ? defaultPictures
              : imagePreviewUrl
          }
          alt="avatart-user"
        />
        <span
          style={{
            padding: "0 10px 0 5px",
            color: primaryColor === "charcoal" ? "#fff" : "#383637",
          }}
        >
          {userName
            ? userName.slice(0, 12)
            : currentUserAddress.slice(0, 7)}
          {currentUserAddress.length || userName.length > 13
            ? userName
              ? ""
              : "..."
            : currentUserAddress.length > 13
              ? "..."
              : ""}
        </span>
        <i className="icon-menu fas fa-bars"></i>
      </button>
      <Popup
        className="popup-settings-block"
        open={triggerState}
        position="bottom center"
        closeOnDocumentClick
        onClose={() => setTriggerState(false)}
      >
        <div
          ref={settingBlockRef}
          className="user-popup"
          style={{ background: "#383637", borderRadius: 16 }}
        >
          {
            !next ? <div>
              <ul className="list-popup">
                <li onClick={handlePopUp}>
                  <i className="fas fa-cog"></i>Profile settings
                </li>
                <li onClick={pushToMyItems}>
                  <i className="fas fa-boxes"></i>My items
                </li>
                {process.env.REACT_APP_DISABLE_CREATOR_VIEWS !== 'true' &&
                  <li onClick={pushToFactory}>
                    <i className="fas fa-hammer"></i>Factory
                  </li>
                }
                <li onClick={logout}>
                  <i className="fas fa-sign-out-alt"></i>Logout
                </li>
              </ul>
            </div> : <div
              className="profile-settings"

            >
              <div className="profile-header">
                <div className="btn-back" onClick={handlePopUp}>
                  <i className="fas fa-chevron-left"></i>
                </div>
                <div className="profile-title">Profile settings</div>
                <div></div>
              </div>
              <div className="profile-info">
                <div className="user-avatar">
                  <img
                    onClick={(event) =>
                      event.altKey && event.shiftKey ? alert("Front v0.9 3tabsView") : null
                    }
                    style={{
                      width: "auto",
                      height: 100,
                      borderRadius: 16,
                    }}
                    src={
                      imagePreviewUrl === null
                        ? defaultPictures
                        : imagePreviewUrl
                    }
                    alt="avatart"
                  />
                </div>
                <div className="profile-form">
                  <div>
                    <label>Name</label>
                    <div className="profile-input">
                      <span>
                        {userName
                          ? userName.slice(0, 24)
                          : currentUserAddress.slice(0, 24)}
                        {currentUserAddress.length || userName.length > 24
                          ? userName
                            ? "..."
                            : ""
                          : currentUserAddress.length > 13
                            ? "..."
                            : ""}
                      </span>
                    </div>

                    <label>Email</label>
                    <div className="profile-input">
                      {/* <input type="text" placeholder="Enter your email" /> */}
                      <span>{userEmail ? userEmail : "email@example.com"}</span>
                    </div>
                  </div>
                </div>
                <div className="user-edit">
                  <div className="profile-input">
                    <span
                      className="profile-input-edit"
                      onClick={() => setOpenModalPic(true)}
                    >
                      Edit
                    </span>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </Popup>
    </>
  );
};

export default PopUpSettings;
