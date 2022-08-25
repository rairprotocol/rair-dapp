//@ts-nocheck
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SvgUserIcon } from '../SettingsIcons/SettingsIcons';
import Swal from 'sweetalert2';
import axios from 'axios';
import { getUserStart } from '../../../ducks/users/actions';

const EditMode = ({
  handlePopUp,
  imagePreviewUrl,
  defaultPictures,
  cutUserAddress,
  editMode,
  onChangeEditMode,
  userEmail,
  setMainEmail,
  setMainName,
  setImagePreviewUrl,
  mainName
}) => {
  const dispatch = useDispatch();
  const { primaryColor } = useSelector((store) => store.colorStore);
  const { currentUserAddress } = useSelector((store) => store.contractStore);
  const [userName, setUserName] = useState(mainName.replace(/@/g, ''));
  const [emailUser, setEmailUser] = useState(userEmail);
  const [userAvatar, setUserAvatar] = useState(
    imagePreviewUrl ? imagePreviewUrl : ''
  );
  const [filePhoto, setFilePhoto] = useState();

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
    const formData = new FormData();
    formData.append('nickName', userName);
    formData.append('email', emailUser);
    if (filePhoto) {
      formData.append('files', filePhoto);
      formData.append('avatar', filePhoto.name);
    }

    try {
      const profileUpdateResponse = await axios.post<TUserResponse>(
        `/api/users/${currentUserAddress.toLowerCase()}`,
        formData,
        {
          headers: {
            Accept: 'multipart/form-data',
            'X-rair-token': localStorage.token
          }
        }
      );
      const { user, success } = profileUpdateResponse.data;

      if (user.nickName) {
        setUserName(user.nickName.replace(/@/g, ''));
        dispatch(getUserStart(currentUserAddress));
      }
      if (success) {
        setMainName(user.nickName);
        setMainEmail(user.email);

        dispatch(getUserStart(currentUserAddress));
      }
      if (user?.avatar) {
        setUserAvatar(user.avatar);
        setImagePreviewUrl(user.avatar);
      }

      onChangeEditMode();
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const error = err as AxiosError;
      Swal.fire('Info', `The name ${userName} already exists`, 'question');
    }
  };

  return (
    <div className="profile-settings">
      <div className="profile-header">
        <div className="btn-back" onClick={handlePopUp}>
          <i className="fas fa-chevron-left"></i>
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
                <div
                  className={`change-profile-img ${
                    primaryColor === 'rhyno' ? 'rhyno' : ''
                  }`}>
                  <label>
                    <div className="change-profile-photo-block">
                      <img alt="" src={userAvatar} />
                    </div>
                    <input
                      style={{ display: 'none' }}
                      type="file"
                      onChange={onChangeAvatar}
                    />
                  </label>
                </div>
              ) : (
                <div className="user-avatar">
                  <img
                    style={{
                      width: 'auto',
                      height: 100,
                      borderRadius: 16
                    }}
                    src={imagePreviewUrl}
                    alt="avatart"
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
                      <img alt="" src={userAvatar} />
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
                  <span
                    style={{
                      fontSize: '14px',
                      color:
                        primaryColor === 'rhyno' ? 'rgb(41, 41, 41)' : 'white'
                    }}>
                    {userName && userName.length > 20
                      ? cutUserAddress()
                      : userName}
                  </span>
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
                <span
                  className="profile-input-edit btn"
                  onClick={() => onChangeEditMode()}
                  style={{
                    fontSize: '14px'
                  }}>
                  Edit
                </span>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMode;
