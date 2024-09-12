import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

import { TUserResponse } from '../../../axios.responseTypes';
import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxHooks';
import useSwal from '../../../hooks/useSwal';
import {
  MobileEditFields,
  MobileProfileBtnWrapper,
  MobileProfileField,
  MobileStandartFields
} from '../NavigationItems/NavigationItems';

const MobileEditProfile: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm();
  const { isLoggedIn, nickName, email } = useAppSelector((state) => state.user);
  const { currentUserAddress } = useAppSelector((store) => store.web3);

  const { primaryColor } = useAppSelector((store) => store.colors);

  const dispatch = useAppDispatch();

  const [editMode, setEditMode] = useState<boolean>(false);

  const onChangeEditMode = () => {
    setEditMode((prev) => !prev);
  };

  const rSwal = useSwal();

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors }
  // } = useForm({
  //   defaultValues: {
  //     email: userData.email
  //   }
  // });
  // const avatarFile = userData.avatar ? userData.avatar : defaultPictures;
  // const [imagePreviewUrl, setImagePreviewUrl] = useState(avatarFile);
  // const [file, setFile] = useState('');
  // const [loading, setLoading] = useState(false);
  // const [status, setStatus] = useState(false);

  // const photoUpload = useCallback(
  //   (e) => {
  //     e.preventDefault();
  //     const reader = new FileReader();
  //     const fileF = e.target.files[0];
  //     reader.onloadend = () => {
  //       setImagePreviewUrl(reader.result);
  //       setFile(fileF);
  //     };
  //     reader.readAsDataURL(fileF);
  //   },
  //   [setImagePreviewUrl, setFile]
  // );

  const updateProfile = useCallback(
    async (data) => {
      if (
        nickName?.replace(/@/g, '') !== getValues('username') ||
        email !== getValues('useremail')
      ) {
        const formData = new FormData();
        formData.append('nickName', data.username);
        formData.append('email', data.useremail);
        if (!currentUserAddress) {
          return;
        }
        try {
          const profileEditResponse = await axios.patch<TUserResponse>(
            `/api/users/${currentUserAddress.toLowerCase()}`,
            formData,
            {
              headers: {
                Accept: 'multipart/form-data'
              }
            }
          );
          const { user, success } = profileEditResponse.data;
          if (success && user) {
            // if (user.avatar) {
            //   setImagePreviewUrl(user.avatar);
            // }
            // setLoading(false);
            onChangeEditMode();
            dispatch({
              type: 'GET_USER_START',
              publicAddress: currentUserAddress
            });
          }
        } catch (err) {
          const error = err as any;

          if (
            error.response?.data.message ===
            `Plan executor error during findAndModify :: caused by :: E11000 duplicate key error collection: rair-db.User index: nickName_1 dup key: { nickName: "@${getValues(
              'username'
            )}" }`
          ) {
            rSwal.fire(
              'Info',
              `The name ${getValues('username')} already exists`,
              'question'
            );
          } else if (
            error.response?.data.message ===
            // eslint-disable-next-line no-useless-escape, prettier/prettier
            '"email" must be a valid email'
          ) {
            rSwal.fire('Info', `Wrong email format`, 'question');
          } else {
            rSwal.fire(
              'Info',
              `The ${error.response?.data.message} `,
              'question'
            );
          }
        }
      } else {
        rSwal.fire('Info', `You need to change something`, 'question');
      }
    },
    [nickName, getValues, email, currentUserAddress, dispatch, rSwal]
  );

  const onSubmit = (data) => {
    if (currentUserAddress) {
      updateProfile(data);
    }
  };

  return (
    <MobileEditFields>
      {isLoggedIn && (
        <>
          {editMode ? (
            <form id="form1" onSubmit={handleSubmit(onSubmit)}>
              <MobileProfileField
                primaryColor={primaryColor}
                errors={errors.username}>
                <label htmlFor="">Name</label>
                <input
                  defaultValue={nickName?.replace(/@/g, '')}
                  {...register('username', { required: true })}
                  type="text"
                  placeholder="Enter your name"
                />
              </MobileProfileField>
              <MobileProfileField
                primaryColor={primaryColor}
                errors={errors.useremail}>
                <label htmlFor="">E-mail</label>
                <input
                  defaultValue={email}
                  {...register('useremail', { required: true })}
                  type="text"
                  placeholder="Enter your e-mail"
                />
              </MobileProfileField>
              <MobileProfileField>
                <MobileProfileBtnWrapper primaryColor={primaryColor}>
                  <button type="submit">Save</button>
                  <button onClick={onChangeEditMode} type="button">
                    Exit
                  </button>
                </MobileProfileBtnWrapper>
              </MobileProfileField>
            </form>
          ) : (
            <MobileStandartFields>
              <MobileProfileField>
                <p>Name</p>
                {nickName && (
                  <div className="block-simulated-input">
                    {nickName.length > 13
                      ? nickName.slice(0, 5) +
                        '....' +
                        nickName.slice(nickName.length - 4)
                      : nickName}
                  </div>
                )}
              </MobileProfileField>
              <MobileProfileField>
                <p>E-mail</p>
                <div className="block-simulated-input">
                  {email ? email : 'email@example.com'}
                </div>
              </MobileProfileField>
              <MobileProfileField>
                <button onClick={onChangeEditMode} type="button">
                  Edit
                </button>
              </MobileProfileField>
            </MobileStandartFields>
          )}
        </>
      )}
    </MobileEditFields>
  );
};

export default MobileEditProfile;
