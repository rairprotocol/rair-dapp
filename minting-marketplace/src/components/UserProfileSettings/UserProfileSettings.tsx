//@ts-nocheck
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "./UserProfileSettings.css";

// React Redux types
import PopUpSettings from "./PopUpSetting";
import PopUpNotification from "./PopUpNotification/PopUpNotification";
import { setColorScheme } from "../../ducks/colors";

const UserProfileSettings = ({
  loginDone,
  currentUserAddress,
  adminAccess,
  setLoginDone,
  userData
}) => {
  const dispatch = useDispatch();
  const { primaryColor } = useSelector((store) => store.colorStore);

  return (
    <div
      style={{
        // position: "absolute",
        display: "flex",
        alignContent: "center",
        marginRight: "16px"
      }}
    >
      <div
        style={{
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        {loginDone && (
          <div
            style={{
              marginRight: "12px",
              display: "flex",
              alignContent: "center",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
            className="user-block"
          >
            <PopUpNotification
              primaryColor={primaryColor}
              isNotification={false}
            />
            <PopUpSettings
              userData={userData}
              primaryColor={primaryColor}
              setLoginDone={setLoginDone}
              adminAccess={adminAccess}
              currentUserAddress={currentUserAddress}
            />
          </div>
        )}
      </div>
      <div>
        <button
          className="btn-change-theme"
          style={{
            backgroundColor:
              primaryColor === "charcoal" ? "#222021" : "#D3D2D3"
          }}
          onClick={(e) => {
            dispatch(setColorScheme(primaryColor === "rhyno" ? "charcoal" : "rhyno"));
          }}
        >
          {primaryColor === "rhyno" ? (
            <i className="far fa-moon" />
          ) : (
            <i className="fas fa-sun" />
          )}
        </button>
      </div>
    </div>
  );
};

export default UserProfileSettings;
