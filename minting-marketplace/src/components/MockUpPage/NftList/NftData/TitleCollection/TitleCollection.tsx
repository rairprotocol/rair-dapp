//@ts-nocheck
import React, { useState } from 'react';

import './TitleCollection.css';
import defaultUser from './../../../assets/defultUser.png';
import SharePopUp from './SharePopUp/SharePopUp';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const TitleCollection = ({
  title,
  userName,
  // currentUser,
  someUsersData,
  selectedData
}) => {
  const { primaryColor } = useSelector((store) => store.colorStore);

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

  // useEffect(() => {}, [currentUser, userName]);

  if (someUsersData) {
    return (
      <div className="container-title-collection">
        <div className="block-title-share">
          <h2>{title === 'none' ? `#${tokenId}` : title}</h2>
          <div>
            <button
              onClick={handleClickOpen}
              className="share-button"
              style={{
                background: `${
                  primaryColor === 'rhyno' ? 'var(--stimorol)' : 'none'
                }`
              }}>
              Share
            </button>
            <SharePopUp
              primaryColor={primaryColor}
              selectedValue={selectedValue}
              open={open}
              onClose={handleClose}
              selectedData={selectedData}
            />
          </div>
        </div>
        <div className="block-user-creator">
          <span>by:</span>
          <img
            // src={currentUser?.avatar ? currentUser.avatar : defaultUser}
            src={someUsersData.avatar ? someUsersData.avatar : defaultUser}
            alt="user"
          />
          {/* <h5>{currentUser?.nickName ? currentUser.nickName : userName}</h5> */}
          <h5 style={{ wordBreak: 'break-all' }}>
            {someUsersData.nickName ? someUsersData.nickName : userName}
          </h5>
        </div>
        <div className="block-collection-desc">
          {selectedData && selectedData.description === 'none'
            ? ''
            : selectedData.description}
        </div>
      </div>
    );
  } else {
    return (
      <div className="container-title-collection">
        <div className="block-title-share">
          <h2>{title === 'none' ? `#${tokenId}` : title}</h2>
          <div>
            <button
              onClick={handleClickOpen}
              className="share-button"
              style={{
                background: `${
                  primaryColor === 'rhyno' ? 'var(--stimorol)' : 'none'
                }`
              }}>
              Share
            </button>
            <SharePopUp
              primaryColor={primaryColor}
              selectedValue={selectedValue}
              open={open}
              onClose={handleClose}
              selectedData={selectedData}
            />
          </div>
        </div>
        <div className="block-user-creator">
          <span>by:</span>
          <img src={defaultUser} alt="user" />
          <h5>
            {userName && userName.length > 25
              ? `${userName.substring(0, 25)}...`
              : userName}
          </h5>
        </div>
        <div className="block-collection-desc">
          {selectedData && selectedData.description === 'none'
            ? ''
            : selectedData.description}
        </div>
      </div>
    );
  }
};

export default TitleCollection;
