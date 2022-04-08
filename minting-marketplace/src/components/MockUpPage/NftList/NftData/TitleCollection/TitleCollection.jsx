import React, { useState, useRef, useEffect } from "react";

import "./TitleCollection.css";
import defaultUser from "./../../../assets/defultUser.png";
import SharePopUp from "./SharePopUp/SharePopUp";
import { useParams } from "react-router-dom";

const TitleCollection = ({
  title,
  userName,
  currentUser,
  tokenData,
  someUsersData,
  selectedData,
}) => {
  const { tokenId } = useParams();
  const [sharePopUp, setSharePopUp] = useState(false);
  const shareRef = useRef();

  const toggleShare = () => {
    setSharePopUp((prev) => !prev);
  };
  useEffect(() => {}, [currentUser, userName]);

  // console.log(currentUser);
  // console.log(userName, 'userName');
  // if (currentUser) {
  // if (currentUser?.publicAddress === userName) {
  if (someUsersData) {
    return (
      <div className="container-title-collection">
        <div className="block-title-share">
          <h2>{title === "none" ? `#${tokenId}` : title}</h2>
          <button className="block-btn-share" onClick={toggleShare}>
            Share
          </button>
          {sharePopUp && (
            <SharePopUp setSharePopUp={setSharePopUp} shareRef={shareRef} />
          )}
        </div>
        <div className="block-user-creator">
          <span>by:</span>
          <img
            // src={currentUser?.avatar ? currentUser.avatar : defaultUser}
            src={someUsersData && someUsersData.avatar ? someUsersData.avatar : defaultUser}
            alt="user"
          />
          {/* <h5>{currentUser?.nickName ? currentUser.nickName : userName}</h5> */}
          <h5>{someUsersData ? someUsersData.nickName : userName}</h5>
        </div>
        <div className="block-collection-desc">
          {selectedData && selectedData.description}
        </div>
      </div>
    );
  } else {
    return (
      <div className="container-title-collection">
        <div className="block-title-share">
          <h2>{title === "none" ? `#${tokenId}` : title}</h2>
          <button className="block-btn-share" onClick={toggleShare}>
            Share
          </button>
          {sharePopUp && (
            <SharePopUp setSharePopUp={setSharePopUp} shareRef={shareRef} />
          )}
        </div>
        <div className="block-user-creator">
          <span>by:</span>
          <img src={defaultUser} alt="user" />
          <h5>{userName}</h5>
        </div>
        <div className="block-collection-desc">
          {selectedData && selectedData.description}
        </div>
      </div>
    );
  }
};

export default TitleCollection;
