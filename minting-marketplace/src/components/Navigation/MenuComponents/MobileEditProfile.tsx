//@ts-nocheck
import React, { useCallback, useState } from 'react';
import { ImageUpload } from '../../UserProfileSettings/UploadProfilePicture/ImageUpload/ImageUpload';
import { useForm } from 'react-hook-form';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import {
  BlockAvatar,
  ButtonEdit,
  ErrorInput,
  InputChange,
  LabelForm,
  ListEditProfileMode,
  ProfileButtonBack,
  TitleEditProfile
} from '../NavigationItems/NavigationItems';
import axios, { AxiosError } from 'axios';
import Swal from 'sweetalert2';
import { TUserResponse } from '../../../axios.responseTypes';

const MobileEditProfile = ({
  toggleEditMode,
  userData,
  editMode,
  currentUserAddress,
  setUserData,
  defaultPictures
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: userData.email
    }
  });
  const avatarFile = userData.avatar ? userData.avatar : defaultPictures;
  const [imagePreviewUrl, setImagePreviewUrl] = useState(avatarFile);
  const [file, setFile] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(false);

  const photoUpload = useCallback(
    (e) => {
      e.preventDefault();
      const reader = new FileReader();
      const fileF = e.target.files[0];
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
        setFile(fileF);
      };
      reader.readAsDataURL(fileF);
    },
    [setImagePreviewUrl, setFile]
  );

  const updateProfile = useCallback(
    async (data) => {
      setLoading(true);
      const formData = new FormData();
      formData.append('nickName', data.name);
      formData.append('email', data.email);
      if (file) {
        formData.append('file', file);
      }
      try {
        const profileEditResponse = await axios.post<TUserResponse>(
          `/api/users/${currentUserAddress.toLowerCase()}`,
          formData,
          {
            headers: {
              Accept: 'multipart/form-data',
              'X-rair-token': localStorage.token
            }
          }
        );
        const { user, success } = profileEditResponse.data;
        if (success && user) {
          setUserData(user);

          if (user.avatar) {
            setImagePreviewUrl(user.avatar);
          }
          setLoading(false);
          setStatus(true);
        }
      } catch (err) {
        const error = err as AxiosError;
        Swal.fire('Info', `${error.message}`, 'question');
      }
    },
    [file, currentUserAddress, setImagePreviewUrl, setLoading, setUserData]
  );

  const onSubmit = (data) => {
    updateProfile(data);
  };

  return (
    <ListEditProfileMode editMode={editMode} primaryColor={123}>
      <ProfileButtonBack onClick={toggleEditMode}>
        <i className="fas fa-chevron-left"></i>
      </ProfileButtonBack>
      <TitleEditProfile>Edit Profile</TitleEditProfile>

      <form onSubmit={handleSubmit(onSubmit)}>
        <BlockAvatar>
          <ImageUpload onChange={photoUpload} src={imagePreviewUrl} />
        </BlockAvatar>
        <div>
          <LabelForm>Name:</LabelForm>
          <InputChange
            id="name"
            {...register('name', {
              required: true,
              maxLength: 20,
              minLength: 2
            })}
            type="text"
          />
          {errors.name && errors.name.type === 'required' && (
            <ErrorInput>This field is required!</ErrorInput>
          )}
          {errors.name && errors.name.type === 'maxLength' && (
            <ErrorInput>Name should be less 13 letters!</ErrorInput>
          )}
          {errors.name && errors.name.type === 'minLength' && (
            <ErrorInput>Name should be more 2 letters!</ErrorInput>
          )}
          <LabelForm>Email:</LabelForm>
          <InputChange
            id="email"
            {...register('email', { required: true })}
            type="email"
          />
          {errors.email && errors.email.type === 'required' && (
            <ErrorInput>This field is required!</ErrorInput>
          )}
        </div>

        {status ? (
          <Alert
            style={{ display: 'flex', justifyContent: 'center' }}
            variant="standard"
            severity="success">
            {"Success! Your profile's updated"}
          </Alert>
        ) : (
          <>
            {loading ? (
              <>
                <CircularProgress />
              </>
            ) : (
              <ButtonEdit type="submit">Save changes</ButtonEdit>
            )}
          </>
        )}
      </form>
    </ListEditProfileMode>
  );
};

export default MobileEditProfile;
