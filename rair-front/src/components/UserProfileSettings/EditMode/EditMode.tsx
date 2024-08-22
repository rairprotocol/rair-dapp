import { useState } from 'react';
import { Provider, useStore } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

import { TUserResponse } from '../../../axios.responseTypes';
import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxHooks';
import useSwal from '../../../hooks/useSwal';
import { loadCurrentUser } from '../../../redux/userSlice';
import { TooltipBox } from '../../common/Tooltip/TooltipBox';
import { SvgUserIcon } from '../SettingsIcons/SettingsIcons';
import { AgreementsPopUp } from '../TermsOfServicePopUp/TermsOfServicePopUp';

const EditMode = ({
  handlePopUp,
  imagePreviewUrl,
  editMode,
  onChangeEditMode,
  userEmail,
  setMainEmail,
  setMainName,
  setImagePreviewUrl,
  mainName
}) => {
  const dispatch = useAppDispatch();
  const store = useStore();
  const reactSwal = useSwal();

  const hotdropsVar = import.meta.env.VITE_TESTNET;

  const { primaryColor, textColor } = useAppSelector((store) => store.colors);
  const { currentUserAddress } = useAppSelector((store) => store.web3);
  const [userName, setUserName] = useState(mainName.replace(/@/g, ''));
  const [emailUser, setEmailUser] = useState(userEmail);
  const [userAvatar, setUserAvatar] = useState(
    imagePreviewUrl ? imagePreviewUrl : ''
  );
  const [filePhoto, setFilePhoto] = useState<any>();
  const [copyState, setCopyState] = useState(false);

  const onChangeAvatar = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const fileF = e.target.files[0];
    reader.onloadend = () => {
      setUserAvatar(reader.result);
      setFilePhoto(fileF);
    };
    reader.readAsDataURL(fileF);
  };

  const onSubmitData = async (e) => {
    e.preventDefault();
    if (!currentUserAddress) {
      return;
    }
    if (!userEmail) {
      reactSwal.fire({
        title: <h2 style={{ color: 'var(--bubblegum)' }}>Terms of Service</h2>,
        html: (
          <Provider store={store}>
            <AgreementsPopUp
              userName={userName}
              emailUser={emailUser}
              filePhoto={filePhoto}
              currentUserAddress={currentUserAddress}
            />
          </Provider>
        ),
        showConfirmButton: false,
        width: '90vw',
        customClass: {
          popup: `bg-${primaryColor} rounded-rair`,
          title: `text-${textColor}`
        }
      });
    } else {
      const formData = new FormData();
      formData.append('nickName', userName);
      formData.append('email', emailUser);
      if (filePhoto) {
        formData.append('files', filePhoto);
        formData.append('avatar', filePhoto?.name);
      }

      try {
        const profileUpdateResponse = await axios.patch<TUserResponse>(
          `/api/users/${currentUserAddress.toLowerCase()}`,
          formData,
          {
            headers: {
              Accept: 'multipart/form-data'
            }
          }
        );
        const { user, success } = profileUpdateResponse.data;

        if (success) {
          dispatch(loadCurrentUser());
          if (user?.nickName) {
            setUserName(user.nickName.replace(/@/g, ''));
            setMainName(user.nickName);
          }
          setMainEmail(user?.email);
          if (user?.avatar) {
            setUserAvatar(user.avatar);
            setImagePreviewUrl(user.avatar);
          }
        }

        onChangeEditMode();
      } catch (err) {
        reactSwal.fire(
          'Info',
          `The name ${userName} already exists`,
          'question'
        );
      }
    }
  };

  return (
    <div className="profile-settings">
      <div className="profile-header">
        <div
          className={`btn-back ${
            hotdropsVar === 'true' ? 'hotdrops-color' : ''
          }`}
          onClick={handlePopUp}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </div>
        <div
          className="profile-title"
          style={{
            color: primaryColor === 'rhyno' ? 'rgb(41, 41, 41)' : 'white'
          }}>
          Profile settings
        </div>
        <div></div>
      </div>
      <div className="profile-info">
        <form
          onSubmit={onSubmitData}
          style={{
            display: 'flex',
            flexDirection: 'column'
          }}>
          {imagePreviewUrl ? (
            <>
              {editMode ? (
                <TooltipBox title="Click to change your avatar!">
                  <div
                    className={`change-profile-img ${
                      primaryColor === 'rhyno' ? 'rhyno' : ''
                    }`}>
                    <label>
                      <div className="change-profile-photo-block">
                        <img alt="User Avatar" src={userAvatar} />
                      </div>
                      <input
                        style={{ display: 'none' }}
                        type="file"
                        onChange={onChangeAvatar}
                      />
                    </label>
                  </div>
                </TooltipBox>
              ) : (
                <div className="user-avatar">
                  <img
                    style={{
                      width: 'auto',
                      height: 100,
                      borderRadius: 16
                    }}
                    src={imagePreviewUrl}
                    alt="User Avatar"
                  />
                </div>
              )}
            </>
          ) : (
            <>
              {editMode ? (
                <div
                  className={`change-profile-img ${
                    primaryColor === 'rhyno' ? 'rhyno' : ''
                  }`}>
                  <label>
                    <div className="change-profile-photo-block">
                      <img alt="User Avatar" src={userAvatar} />
                    </div>
                    <input
                      style={{ display: 'none' }}
                      type="file"
                      onChange={onChangeAvatar}
                    />
                  </label>
                </div>
              ) : (
                <div className="user-avatar-default">
                  <SvgUserIcon />
                </div>
              )}
            </>
          )}
          <div
            className={`profile-form ${
              primaryColor === 'rhyno' ? 'rhyno' : ''
            }`}>
            <div>
              <label
                style={{
                  fontSize: '14px',
                  color:
                    primaryColor === 'rhyno' ? 'rgb(41, 41, 41)' : '#A7A6A6'
                }}>
                Name
              </label>
              <div className={`profile-input`}>
                {editMode ? (
                  <input
                    required
                    onChange={(e) => setUserName(e.target.value)}
                    type="text"
                    className="profile-input-name"
                    value={userName}
                  />
                ) : (
                  <>
                    <TooltipBox title={'Click to copy your address'}>
                      <span
                        className={
                          hotdropsVar === 'true' ? 'hotdrops-border' : ''
                        }
                        style={{
                          fontSize: '14px',
                          color:
                            primaryColor === 'rhyno'
                              ? 'rgb(41, 41, 41)'
                              : 'white',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          if (currentUserAddress) {
                            navigator.clipboard.writeText(currentUserAddress);
                            setCopyState(true);
                          }
                        }}>
                        {copyState
                          ? 'Copied!'
                          : currentUserAddress?.slice(0, 5) +
                            '....' +
                            currentUserAddress?.slice(length - 4)}
                      </span>
                    </TooltipBox>
                  </>
                )}
              </div>

              <label
                style={{
                  fontSize: '14px',
                  color:
                    primaryColor === 'rhyno' ? 'rgb(41, 41, 41)' : '#A7A6A6',
                  marginTop: '16px'
                }}>
                E-mail
              </label>
              <div className="profile-input">
                {editMode ? (
                  <input
                    required
                    type="email"
                    className="profile-input-email"
                    value={emailUser}
                    onChange={(e) => setEmailUser(e.target.value)}
                  />
                ) : (
                  <span
                    className={hotdropsVar === 'true' ? 'hotdrops-border' : ''}
                    style={{
                      fontSize: '14px',
                      color:
                        primaryColor === 'rhyno' ? 'rgb(41, 41, 41)' : 'white'
                    }}>
                    {userEmail ? userEmail : 'email@example.com'}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="user-edit">
            {editMode ? (
              <div className="profile-input edit-mode">
                <button
                  className="profile-input-edit btn"
                  type="submit"
                  style={{
                    fontSize: '14px',
                    color:
                      primaryColor === 'rhyno' ? 'rgb(41, 41, 41)' : 'white'
                  }}>
                  Save
                </button>
                {/* <TermsOfServicePopUp /> */}
                <span
                  className="profile-input-edit btn"
                  onClick={() => onChangeEditMode()}
                  style={{
                    fontSize: '14px',
                    color:
                      primaryColor === 'rhyno' ? 'rgb(41, 41, 41)' : 'white'
                  }}>
                  Exit
                </span>
              </div>
            ) : (
              <div className="profile-input">
                <NavLink to={`/${currentUserAddress}`}>
                  <span
                    className={`profile-input-edit btn ${
                      hotdropsVar === 'true' ? 'hotdrops-bg' : ''
                    }`}
                    // onClick={() => onChangeEditMode()}
                    style={{
                      color: '#fff',
                      fontSize: '14px'
                    }}>
                    View profile
                  </span>
                </NavLink>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMode;
