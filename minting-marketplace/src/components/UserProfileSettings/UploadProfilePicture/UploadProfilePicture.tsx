// @ts-nocheck
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import axios, { AxiosError } from 'axios';
import Swal from 'sweetalert2';

import { TUserResponse } from '../../../axios.responseTypes';

import { Edit } from './Edit/Edit';
import { Profile } from './Profile/Profile';

const UploadProfilePicture = ({
  setOpenModalPic,
  currentUserAddress,
  setUserName,
  setUserEmail,
  setImagePreviewUrl,
  imagePreviewUrl,
  setTriggerState,
  userEmail,
  userName
}) => {
  const [file, setFile] = useState('');
  const [name, setName] = useState(userName);
  const [status, setStatus] = useState(userEmail);
  const [active, setActive] = useState('edit');
  const { primaryColor } = useSelector((store) => store.colorStore);

  const [, /*updateUsr*/ setUpdateUsr] = useState({});

  const updateProfile = useCallback(async () => {
    const formData = new FormData();
    formData.append('nickName', name.replace(/@/g, ''));
    formData.append('email', status);
    if (file) {
      formData.append('files', file);
      formData.append('avatar', file.name);
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
      setUpdateUsr(user);
      if (success) {
        setUserName(user.nickName);
        setUserEmail(user.email);
      }
      if (user?.avatar) {
        setImagePreviewUrl(user.avatar);
      }
    } catch (err) {
      const error = err as AxiosError;
      Swal.fire('Info', `${error.message}`, 'question');
    }
  }, [
    name,
    status,
    file,
    currentUserAddress,
    setUserName,
    setUserEmail,
    setImagePreviewUrl
  ]);

  // const upPr = useCallback(async () => {
  //   const res = await fetch(
  //     `/api/users/${currentUserAddress.toLowerCase()}?publicAddress=${currentUserAddress.toLowerCase()}`,
  //     {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         nickName: name,
  //         email: status,
  //       }),
  //     }
  //   )
  //   .then(blob => blob.json());
  //   setUpdateUsr(res);
  //   setUserName(res.user.nickName);
  //   setUserEmail(res.user.email)
  // }, [currentUserAddress, name, status, setUserEmail, setUserName]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const activeP = active === 'edit' ? 'profile' : 'edit';
      setActive(activeP);
      updateProfile();
    },
    [active, updateProfile]
  );

  const rootEl = useRef(null);

  const onCloseModalPic = useCallback(() => {
    setOpenModalPic(false);
    setTriggerState(false);
  }, [setOpenModalPic, setTriggerState]);

  const onClick = useCallback(
    (e) => rootEl.current.contains(e.target) || onCloseModalPic(),
    [onCloseModalPic]
  );

  useEffect(() => {
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [onClick, setOpenModalPic]);

  return (
    <div ref={rootEl}>
      {active === 'edit' ? (
        <Edit
          currentUserAddress={currentUserAddress}
          imagePreviewUrl={imagePreviewUrl}
          name={name}
          status={status}
          setImagePreviewUrl={setImagePreviewUrl}
          setStatus={setStatus}
          setName={setName}
          setFile={setFile}
          onSubmit={handleSubmit}
          setOpenModalPic={setOpenModalPic}
          setTriggerState={setTriggerState}
          primaryColor={primaryColor}
        />
      ) : (
        <Profile
          setOpenModalPic={setOpenModalPic}
          onSubmit={handleSubmit}
          src={imagePreviewUrl}
          name={name}
          status={status}
          setTriggerState={setTriggerState}
          primaryColor={primaryColor}
        />
      )}
    </div>
  );
};

export default UploadProfilePicture;
