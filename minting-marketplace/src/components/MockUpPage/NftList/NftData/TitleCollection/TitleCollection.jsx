import React, { useState, useRef } from "react";
import "./TitleCollection.css";
import defaultUser from "./../../../assets/defultUser.png";
import SharePopUp from "./SharePopUp/SharePopUp";
import { useParams } from "react-router-dom";

const TitleCollection = ({ title, userName, currentUser, tokenData }) => {
  const { tokenId } = useParams();
  const [sharePopUp, setSharePopUp] = useState(false);
  const shareRef = useRef();

  //   console.log(userName,currentUser );
  const toggleShare = () => {
    setSharePopUp((prev) => !prev);
  };
  if (currentUser?.userData?.publicAddress === userName) {
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
            src={
              currentUser?.userData?.avatar
                ? currentUser.userData.avatar
                : defaultUser
            }
            alt="user"
          />
          <h5>
            {currentUser?.userData?.nickName
              ? currentUser.userData.nickName
              : userName}
          </h5>
        </div>
        <div className="block-collection-desc">
          {
            tokenData ? tokenData[0]?.metadata.description : "none desc"
          }
        </div>
      </div>
    );
  }
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
        {
          tokenData ? tokenData[0]?.metadata.description : ""
        }
      </div>
    </div>
  );
};

export default TitleCollection;
