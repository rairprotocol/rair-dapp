import React, { memo } from "react";
import cl from "./Profile.module.css";

const ProfileComponent = ({ onSubmit, src, name, status, setOpenModalPic, setTriggerState }) => {

  const onCloseEditProfile = () => {
    setTriggerState(false);
    setOpenModalPic(false)
  }

  return (
    <div className={cl.card}>
      <form onSubmit={onSubmit}>
        <h1> </h1>
        <label className={`${cl.customFileUpload} ${"fas"}`}>
          <div className={cl.imgWrap}>
            <img alt="" htmlFor={cl.photoUpload} src={src} />
          </div>
        </label>
        <div className={cl.name}>{name}</div>
        <div className={cl.status}>{status}</div>
        <button type="submit" className={cl.edit}>
          Edit Profile{" "}
        </button>
        <button onClick={onCloseEditProfile} className={cl.edit}>
          Exit{" "}
        </button>
      </form>
    </div>
  );
};

export const Profile = memo(ProfileComponent);
