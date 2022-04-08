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
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  if (currentUser?.userData?.publicAddress === userName) {
    useEffect(() => { }, [currentUser, userName]);

    // console.log(currentUser);
    // console.log(userName, 'userName');
    // if (currentUser) {
    // if (currentUser?.publicAddress === userName) {
    if (someUsersData) {
      return (
        <div className="container-title-collection">
          <div className="block-title-share">
            <h2>{title === "none" ? `#${tokenId}` : title}</h2>
            <div>
              <button className="block-btn-share" onClick={handleClickOpen}>Share</button>
              <SharePopUp
                selectedValue={selectedValue}
                open={open}
                onClose={handleClose}
              />
            </div>
          </div>
          <div className="block-user-creator">
            <span>by:</span>
            <img
              // src={currentUser?.avatar ? currentUser.avatar : defaultUser}
              src={someUsersData ? someUsersData.avatar : defaultUser}
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
            <div>
              <button className="block-btn-share" onClick={handleClickOpen}>Share</button>
              <SharePopUp
                selectedValue={selectedValue}
                open={open}
                onClose={handleClose}
              />
            </div>
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
}

export default TitleCollection;
