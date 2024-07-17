import { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { faCheck, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AddIcon from '@mui/icons-material/Add';
import axios, { AxiosError } from 'axios';
import Swal from 'sweetalert2';

import {
  BackendResponse,
  TUserResponse
} from '../../../../axios.responseTypes';
import { RootState } from '../../../../ducks';
import { ColorStoreType } from '../../../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../../../ducks/contracts/contracts.types';
import { getUserStart, setUserData } from '../../../../ducks/users/actions';
import { TUsersInitialState } from '../../../../ducks/users/users.types';
import { defaultAvatar, VerifiedIcon } from '../../../../images';
import { rFetch } from '../../../../utils/rFetch';
import { TooltipBox } from '../../../common/Tooltip/TooltipBox';

import cl from './PersonalProfileIcon.module.css';

interface IPersonalProfileIconComponent {
  userData: any;
  isPage?: boolean;
  setEditModeUpper?: (arg: boolean) => void;
}

const PersonalProfileIconComponent: React.FC<IPersonalProfileIconComponent> = ({
  userData,
  isPage,
  setEditModeUpper
}) => {
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const { userRd } = useSelector<RootState, TUsersInitialState>(
    (state) => state.userStore
  );
  const { userAddress } = useParams();

  const [copyState, setCopyState] = useState(false);

  const [userName, setUserName] = useState(userData.publicAddress);
  const [userNameNew, setUserNameNew] = useState(userName);

  const [emailUser, setEmailUser] = useState(userData.email);
  const [emailUserNew, setEmailUserNew] = useState(emailUser);

  const [isPhotoUpdate, setIsPhotoUpdate] = useState(false);

  const [originalPhotoValue, setOriginalPhotoValue] =
    useState<any>(defaultAvatar);
  const [newPhotoValue, setNewPhotoValue] = useState(originalPhotoValue);

  const { currentUserAddress } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );
  const { textColor } = useSelector<RootState, ColorStoreType>(
    (state) => state.colorStore
  );

  const resetAllStatesOnCancel = useCallback(
    (userData) => {
      setEditMode(false);
      if (setEditModeUpper) {
        setEditModeUpper(false);
      }
      setIsPhotoUpdate(false);

      setEmailUserNew(userData.email);
      setEmailUser(userData.email);

      setUserName(
        userData.nickName
          ? userData.nickName.replace(/@/g, '')
          : userData.publicAddress
      );
      setUserNameNew(
        userData.nickName
          ? userData.nickName.replace(/@/g, '')
          : userData.publicAddress
      );

      if (userData && userData.avatar) {
        setOriginalPhotoValue(userData.avatar);
      } else {
        setOriginalPhotoValue(defaultAvatar);
      }
    },
    [setEditModeUpper]
  );

  const checkInputForSame = (
    userName: string,
    userNameNew: string,
    emailUser: string,
    emailUserNew: string,
    filePhoto: string | object,
    userAvatar: string
  ) => {
    if (
      userName &&
      userNameNew &&
      emailUser &&
      emailUserNew &&
      userAvatar &&
      filePhoto
    ) {
      const sameName = userName !== userNameNew;
      const sameEmail = emailUser !== emailUserNew;
      const sameProfPic = filePhoto !== userAvatar;
      const resultSame = !(sameName || sameEmail || sameProfPic);

      return resultSame;
    }
  };

  const onChangeAvatar = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const fileF = e.target.files[0];
    reader.onloadend = () => {
      setIsPhotoUpdate(true);

      setNewPhotoValue(reader.result);
      setOriginalPhotoValue(fileF);
    };
    reader.readAsDataURL(fileF);
  };

  const onChangeEditMode = useCallback(() => {
    setEditMode((prev) => !prev);
    if (setEditModeUpper) {
      setEditModeUpper(!editMode);
    }
    setIsPhotoUpdate(false);
  }, [editMode, setEditModeUpper]);

  const onSubmitData = useCallback(
    async (e) => {
      e.preventDefault();
      if (!currentUserAddress) {
        return;
      }
      const formData = new FormData();
      if (userName !== userNameNew) {
        formData.append('nickName', userName);
      }
      if (emailUser !== emailUserNew) {
        formData.append('email', emailUser);
      }
      if (originalPhotoValue && originalPhotoValue !== newPhotoValue) {
        formData.append('files', originalPhotoValue);
        formData.append('avatar', originalPhotoValue.name);
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
        const { user } = profileUpdateResponse.data;
        if (user && user.nickName) {
          if (userName !== userNameNew) {
            setUserName(user.nickName.replace(/@/g, ''));
            setUserNameNew(user.nickName.replace(/@/g, ''));
          }
          setEmailUser(user.email);
          setEmailUserNew(user.email);

          setOriginalPhotoValue(user.avatar);
          setNewPhotoValue(user.avatar);

          const { success, user: userInfoData } = await rFetch(
            '/api/auth/me/',
            undefined,
            undefined,
            false
          );

          if (success) {
            dispatch(setUserData(userInfoData));
          }

          dispatch({
            type: 'GET_USER_START',
            publicAddress: currentUserAddress
          });
        }
        onChangeEditMode();
      } catch (err) {
        const error = err as AxiosError;

        const errorData: BackendResponse = error?.response
          ?.data as BackendResponse;
        if (
          errorData.message ===
          `Plan executor error during findAndModify :: caused by :: E11000 duplicate key error collection: rair-db.User index: nickName_1 dup key: { nickName: "@${userName}" }`
        ) {
          Swal.fire('Info', `The name ${userName} already exists`, 'question');
        } else {
          Swal.fire('Info', `The ${errorData.message} `, 'question');
        }
      }
    },
    [
      currentUserAddress,
      emailUser,
      emailUserNew,
      newPhotoValue,
      onChangeEditMode,
      originalPhotoValue,
      userName,
      userNameNew,
      dispatch
    ]
  );

  useEffect(() => {
    if (currentUserAddress) {
      dispatch(getUserStart(currentUserAddress));
    }
  }, [currentUserAddress, dispatch]);

  useEffect(() => {
    if (userRd) {
      setUserName(
        userRd && userRd.nickName && userRd.nickName.replace(/@/g, '')
      );
      setEmailUser(userRd && userRd.email && userRd.email);
      if (userRd.avatar) {
        setOriginalPhotoValue(userRd.avatar);
        setNewPhotoValue(userRd.avatar);
      }
    }
  }, [
    userRd,
    setOriginalPhotoValue,
    setUserName,
    setNewPhotoValue,
    setEmailUser
  ]);

  useEffect(() => {
    checkInputForSame(
      userName,
      userNameNew,
      emailUser,
      emailUserNew,
      originalPhotoValue,
      newPhotoValue
    );
  }, [
    emailUser,
    emailUserNew,
    userName,
    userNameNew,
    originalPhotoValue,
    newPhotoValue
  ]);

  useEffect(() => {
    resetAllStatesOnCancel(userData);
  }, [resetAllStatesOnCancel, userData]);

  return (
    <div className={`${cl.root} ${editMode ? cl.editMode : ''}`}>
      {newPhotoValue ? (
        !editMode ? (
          <div
            style={{
              position: 'relative'
            }}
            className={cl.profileIconPicWrapper}>
            <img
              className={cl.profileIconPic}
              alt="User Avatar"
              src={originalPhotoValue}
            />
            {userData && userData.ageVerified && (
              <img className={cl.verifiedIcon} src={VerifiedIcon} />
            )}
          </div>
        ) : isPhotoUpdate ? (
          <div className={cl.profileIconPicWrapper}>
            <img
              className={cl.profileIconPic}
              alt="User Avatar"
              src={newPhotoValue}
            />
          </div>
        ) : (
          <div className={cl.profileIcon}>
            <label className={cl.labelForFile}>
              <AddIcon className={cl.plus} />
              <input
                className={cl.inputForFile}
                type="file"
                onChange={onChangeAvatar}
              />
            </label>
          </div>
        )
      ) : !editMode ? (
        <div className={`${cl.profileIcon} ${cl.emptyAcc}`}>
          <AddIcon className={cl.plus} />
          <p>{editMode}</p>
        </div>
      ) : (
        <div className={cl.profileIcon}>
          <label className={cl.labelForFile}>
            <AddIcon className={cl.plus} />
            <input
              className={cl.inputForFile}
              type="file"
              onChange={onChangeAvatar}
            />
          </label>
        </div>
      )}
      <div className={cl.profileName}>
        {editMode ? (
          <div className={cl.editMode}>
            <form onSubmit={onSubmitData} className={cl.formEdit}>
              <div className={cl.containerInput}>
                <div className={cl.inputBefore}>
                  <input
                    required
                    value={userName ? userName.replace(/@/g, '') : ''}
                    onChange={(e) => setUserName(e.target.value)}
                    className={cl.editName}
                    id={textColor && cl[textColor]}
                    placeholder="Enter your name"
                    type="text"
                  />
                  <span
                    onClick={() => {
                      setUserName('');
                      setUserNameNew('');
                    }}
                    className={cl['cleanInput' + textColor]}
                  />
                </div>
                <div className={cl.inputBefore}>
                  <input
                    required
                    value={emailUser ? emailUser : ''}
                    onChange={(e) => setEmailUser(e.target.value)}
                    className={cl.editEmail}
                    id={textColor && cl[textColor]}
                    placeholder="Enter your e-mail"
                    type="email"
                  />
                  <span
                    onClick={() => {
                      setEmailUser('');
                      setEmailUserNew('');
                    }}
                    className={cl['cleanInput' + textColor]}
                  />
                </div>
              </div>
              <div className={cl.containerBtn}>
                <button
                  disabled={checkInputForSame(
                    userName,
                    userNameNew,
                    emailUser,
                    emailUserNew,
                    originalPhotoValue,
                    newPhotoValue
                  )}
                  type="submit"
                  className={`${cl.editModeOn} ${textColor && cl[textColor]}`}>
                  <FontAwesomeIcon icon={faCheck} />
                </button>
                <button
                  className={`${cl.editModeOff} ${textColor && cl[textColor]}`}
                  onClick={() => resetAllStatesOnCancel(userRd)}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {isPage ? (
              <>
                <TooltipBox title={'Click to copy your address'}>
                  <span
                    onClick={() => {
                      if (userAddress) {
                        navigator.clipboard.writeText(userAddress);
                        setCopyState(true);

                        setTimeout(() => {
                          setCopyState(false);
                        }, 3000);
                      }
                    }}
                    className={cl['profileName' + textColor]}>
                    {userName && userName.length > 20
                      ? '@' +
                        userName.slice(0, 5) +
                        '...' +
                        userName.slice(userName.length - 4)
                      : '@' + userName}
                  </span>
                </TooltipBox>
              </>
            ) : (
              <>
                <TooltipBox title={'Click to copy your address'}>
                  <span
                    onClick={() => {
                      if (userAddress) {
                        navigator.clipboard.writeText(userAddress);
                        setCopyState(true);

                        setTimeout(() => {
                          setCopyState(false);
                        }, 3000);
                      }
                    }}
                    className={cl['profileName' + textColor]}>
                    {!copyState
                      ? userName && userName.length > 15
                        ? '@' +
                          userName.slice(0, 5) +
                          '...' +
                          userName.slice(length - 4)
                        : '@' + userName
                      : 'Copied!'}
                  </span>
                </TooltipBox>
                <FontAwesomeIcon
                  onClick={() => {
                    setEditMode(true);
                    setCopyState(false);
                    if (setEditModeUpper) {
                      setEditModeUpper(true);
                    }
                  }}
                  icon={faEdit}
                  className={`${cl.edit} ${textColor && cl[textColor]}`}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export const PersonalProfileIcon = memo(PersonalProfileIconComponent);
