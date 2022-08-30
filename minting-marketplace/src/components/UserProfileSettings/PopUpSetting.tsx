//@ts-nocheck
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Popup } from 'reactjs-popup';
import defaultPictures from './images/defaultUserPictures.png';
// import UploadProfilePicture from './UploadProfilePicture/UploadProfilePicture';

// React Redux types
import { getTokenComplete } from '../../ducks/auth/actions';
import { setUserAddress } from '../../ducks/contracts/actions';
import { setAdminRights } from '../../ducks/users/actions';
import {
  SvgFactoryIcon,
  SvgItemsIcon,
  SvgUserIcon
} from './SettingsIcons/SettingsIcons';
import EditMode from './EditMode/EditMode';

const PopUpSettings = ({
  currentUserAddress,
  setLoginDone,
  primaryColor,
  showAlert,
  selectedChain
}) => {
  const settingBlockRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [next, setNext] = useState(false);
  const [, /*openModal*/ setOpenModal] = useState(false);
  // const [openModalPic, setOpenModalPic] = useState(false);
  const [, /*userData*/ setUserData] = useState({});
  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [triggerState, setTriggerState] = useState();
  const [editMode, setEditMode] = useState(false);

  const { adminRights, userRd } = useSelector((store) => store.userStore);

  const [imagePreviewUrl, setImagePreviewUrl] = useState(
    // "https://static.dezeen.com/uploads/2021/06/elon-musk-architect_dezeen_1704_col_1.jpg"
    null
  );

  const onChangeEditMode = useCallback(() => {
    setEditMode((prev) => !prev);
  }, [setEditMode]);

  useEffect(() => {
    if (userRd) {
      setUserName(userRd.nickName);
      setUserEmail(userRd.email);
      setUserData(userRd);
      if (userRd.avatar) {
        setImagePreviewUrl(userRd.avatar);
      }
    }
  }, [userRd]);

  const cutUserAddress = () => {
    if (userName) {
      const length = userName.length;
      return length > 13
        ? userName.slice(0, 5) + '....' + userName.slice(length - 4)
        : userName;
    }
    if (currentUserAddress) {
      return (
        currentUserAddress.slice(0, 4) + '....' + currentUserAddress.slice(38)
      );
    }
  };

  useEffect(() => {
    setOpenModal();
  }, [setOpenModal]);

  const logout = () => {
    dispatch(getTokenComplete(null));
    dispatch(setUserAddress(undefined));
    dispatch(setAdminRights(false));
    localStorage.removeItem('token');
    setLoginDone(false);
    navigate('/');
  };

  const pushToMyItems = () => {
    navigate('/my-items');
  };

  const pushToFactory = () => {
    navigate('/creator/deploy');
  };

  const handlePopUp = () => {
    setNext((prev) => !prev);
    setOpenModal((prev) => !prev);
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

  // if (openModalPic) {
  //   return (
  //     <>
  //       <UploadProfilePicture
  //         setUserName={setUserName}
  //         setUserEmail={setUserEmail}
  //         currentUserAddress={currentUserAddress}
  //         setOpenModalPic={setOpenModalPic}
  //         setImagePreviewUrl={setImagePreviewUrl}
  //         imagePreviewUrl={imagePreviewUrl}
  //         setTriggerState={setTriggerState}
  //         userEmail={userEmail}
  //         userName={userName}
  //       />
  //     </>
  //   );
  // } else {
  //   <Popup />;
  // }

  return (
    <>
      <button
        onClick={() => setTriggerState((prev) => !prev)}
        className={`button profile-btn ${
          primaryColor === 'rhyno' ? 'rhyno' : ''
        }`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start'
        }}>
        <div
          className="profile-btn-img"
          style={{
            height: '100%',
            width: '37px',
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            overflow: 'hidden',
            background: `${imagePreviewUrl === null ? 'var(--royal-ice)' : ''}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          {imagePreviewUrl ? (
            <img
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              src={imagePreviewUrl === null ? defaultPictures : imagePreviewUrl}
              alt="avatart-user"
            />
          ) : (
            <SvgUserIcon />
          )}
        </div>
        <div
          style={{
            display: 'flex',
            width: '140px',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 5px'
          }}>
          <span
            style={{
              padding: '0 0px 0 2px',
              color: primaryColor === 'charcoal' ? '#fff' : '#383637',
              fontSize: '14px'
            }}>
            {cutUserAddress()}
          </span>
          <i className="icon-menu fas fa-bars"></i>
        </div>
      </button>
      <Popup
        className="popup-settings-block"
        open={triggerState}
        position="bottom center"
        closeOnDocumentClick
        onClose={() => {
          setTriggerState(false);
          setEditMode(false);
        }}>
        <div
          ref={settingBlockRef}
          className={`user-popup ${primaryColor === 'rhyno' ? 'rhyno' : ''}`}
          style={{
            background: primaryColor === 'rhyno' ? '#F2F2F2' : '#383637',
            borderRadius: 16,
            filter: 'drop-shadow(0.4px 0.5px 1px black)',
            boder: `${primaryColor === 'rhyno' ? '1px solid #DEDEDE' : 'none'}`,
            marginTop: `${selectedChain && showAlert ? '65px' : '12px'}`
          }}>
          {!next ? (
            <div>
              <ul className="list-popup">
                <li
                  onClick={handlePopUp}
                  style={{
                    color:
                      primaryColor === 'rhyno' ? 'rgb(41, 41, 41)' : 'white'
                  }}>
                  <SvgUserIcon primaryColor={primaryColor} /> Profile settings
                </li>
                <li
                  onClick={pushToMyItems}
                  style={{
                    color:
                      primaryColor === 'rhyno' ? 'rgb(41, 41, 41)' : 'white'
                  }}>
                  <SvgItemsIcon primaryColor={primaryColor} /> My Items
                </li>
                {process.env.REACT_APP_DISABLE_CREATOR_VIEWS !== 'true' &&
                  adminRights && (
                    <li
                      onClick={pushToFactory}
                      style={{
                        color:
                          primaryColor === 'rhyno' ? 'rgb(41, 41, 41)' : 'white'
                      }}>
                      <SvgFactoryIcon primaryColor={primaryColor} /> Factory
                    </li>
                  )}
                <li
                  onClick={logout}
                  style={{
                    color:
                      primaryColor === 'rhyno' ? 'rgb(41, 41, 41)' : 'white'
                  }}>
                  <i className="fas fa-sign-out-alt"></i>Logout
                </li>
              </ul>
            </div>
          ) : (
            <EditMode
              handlePopUp={handlePopUp}
              imagePreviewUrl={imagePreviewUrl}
              defaultPictures={defaultPictures}
              cutUserAddress={cutUserAddress}
              editMode={editMode}
              onChangeEditMode={onChangeEditMode}
              userEmail={userEmail}
              mainName={userName}
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
