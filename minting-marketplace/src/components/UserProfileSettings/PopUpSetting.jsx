import React, { useCallback, useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { Popup } from "reactjs-popup";

// React Redux types
import * as authTypes from "../../ducks/auth/types";
import * as userTypes from "../../ducks/users/types";
import * as contractTypes from "../../ducks/contracts/types";
import UploadProfilePicture from "./UploadProfilePicture/UploadProfilePicture";

const PopUpSettings = ({
  currentUserAddress,
  // adminAccess,
  setLoginDone,
  primaryColor,
}) => {
  const ref = useRef();
  const history = useHistory();
  const dispatch = useDispatch();
  const [next, setNext] = useState(false);
  // const [userName, setUserName] = useState(currentUserAddress);
  const [openModal, setOpenModal] = useState(false);
  const [openModalPic, setOpenModalPic] = useState(false);
  const [, /*userData*/ setUserData] = useState({});
  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();

  const [imagePreviewUrl, setImagePreviewUrl] = useState(
    "https://static.dezeen.com/uploads/2021/06/elon-musk-architect_dezeen_1704_col_1.jpg"
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

  const handleNext = () => {
    setNext((prev) => !prev);
  };

  // const onChangeName = (e) => {
  //   setUserName(e.target.value);
  // };

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
        />
      </>
    );
  } else {
    <Popup />;
  }
  return (
    <Popup
      ref={ref}
      trigger={(open) => {
        setOpenModal(open);
        if (!open) {
          setNext(false);
        }
        return (
          <button
            className="button profile-btn"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              alignContent: "center",
              flexDirection: "row",
              // border: `1px solid ${primaryColor === "charcoal" ? "#fff" : "#383637"}`,
              // border: "1px solid var(--royal-purple)",
              backgroundColor: `${
                primaryColor === "charcoal" ? "#222021" : "#D3D2D3"
              }`,
            }}
          >
            <img
              style={{
                position: "absolute",
                width: "30px",
                height: "100%",
                objectFit: "cover",
                left: 0,
                top: 0,
              }}
              src={
                imagePreviewUrl === null
                  ? "https://static.dezeen.com/uploads/2021/06/elon-musk-architect_dezeen_1704_col_1.jpg"
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
              {
                // currentUserAddress && userName
                // `${currentUserAddress.substr(
                //   0,
                //   6
                // )}...${currentUserAddress.substr(
                //   currentUserAddress.length - 4
                // )}   `
              }
            </span>
            <i className="icon-menu fas fa-bars"></i>
          </button>
        );
      }}
      position="bottom center"
      closeOnDocumentClick
    >
      <div
        className="user-popup"
        style={{ background: "#383637", borderRadius: 16 }}
      >
        <div style={{ display: `${next ? "none" : "block"}` }}>
          <ul className="list-popup">
            <li onClick={handleNext}>
              <i className="fas fa-cog"></i>Profile settings
            </li>
            <li onClick={pushToMyItems}>
              <i className="fas fa-boxes"></i>My items
            </li>
            {process.env.REACT_APP_DISABLE_CREATOR_VIEWS !== "true" && (
              <li onClick={pushToFactory}>
                <i className="fas fa-hammer"></i>Factory
              </li>
            )}
            <li onClick={logout}>
              <i className="fas fa-sign-out-alt"></i>Logout
            </li>
          </ul>
        </div>
        <div
          className="profile-settings"
          style={{ display: `${next && openModal ? "block" : "none"}` }}
        >
          <div className="profile-header">
            <div className="btn-back" onClick={handleNext}>
              <i className="fas fa-chevron-left"></i>
            </div>
            <div className="profile-title">Profile settings</div>
            <div></div>
          </div>
          <div className="profile-info">
            <div className="user-avatar">
              <img
                onClick={(event) =>
                  event.altKey && event.shiftKey
                    ? alert("Front v0.9 3tabsView")
                    : null
                }
                style={{
                  width: "auto",
                  height: 100,
                  borderRadius: 16,
                }}
                src={
                  imagePreviewUrl === null
                    ? "https://static.dezeen.com/uploads/2021/06/elon-musk-architect_dezeen_1704_col_1.jpg"
                    : imagePreviewUrl
                }
                alt="avatart"
              />
            </div>
            <div className="profile-form">
              <div>
                <label>Name</label>
                <div className="profile-input">
                  {/* <input value={userName} onChange={onChangeName} type="text" /> */}
                  {/* <span>{userName}</span> */}
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
      </div>
    </Popup>
  );
};

export default PopUpSettings;
