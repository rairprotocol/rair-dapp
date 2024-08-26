import { memo, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { faCheck, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AddIcon from '@mui/icons-material/Add';
import axios, { AxiosError } from 'axios';

import {
  BackendResponse,
  TUserResponse
} from '../../../../axios.responseTypes';
import {
  useAppDispatch,
  useAppSelector
} from '../../../../hooks/useReduxHooks';
import useSwal from '../../../../hooks/useSwal';
import { defaultAvatar, VerifiedIcon } from '../../../../images';
import { loadCurrentUser } from '../../../../redux/userSlice';
import { TooltipBox } from '../../../common/Tooltip/TooltipBox';

import cl from './PersonalProfileIcon.module.css';

interface IPersonalProfileIconComponent {
  isPage?: boolean;
  setEditModeUpper?: (arg: boolean) => void;
}

const PersonalProfileIconComponent: React.FC<IPersonalProfileIconComponent> = ({
  isPage,
  setEditModeUpper
}) => {
  const dispatch = useAppDispatch();
  const [editMode, setEditMode] = useState(false);
  const { ageVerified, nickName, email, avatar, isLoggedIn, publicAddress } =
    useAppSelector((state) => state.user);
  const { userAddress } = useParams();
  const rSwal = useSwal();

  useEffect(() => {
    if (publicAddress) {
      setUserName(publicAddress);
    }
  }, [publicAddress]);

  const [copyState, setCopyState] = useState(false);

  const [userName, setUserName] = useState<string>('');
  const [userNameNew, setUserNameNew] = useState(userName);

  const [emailUser, setEmailUser] = useState(email);
  const [emailUserNew, setEmailUserNew] = useState(emailUser);

  const [isPhotoUpdate, setIsPhotoUpdate] = useState(false);

  const [originalPhotoValue, setOriginalPhotoValue] =
    useState<any>(defaultAvatar);
  const [newPhotoValue, setNewPhotoValue] = useState(originalPhotoValue);

  const { currentUserAddress } = useAppSelector((store) => store.web3);
  const { textColor } = useAppSelector((state) => state.colors);

  const resetAllStatesOnCancel = useCallback(() => {
    setEditMode(false);
    if (setEditModeUpper) {
      setEditModeUpper(false);
    }
    setIsPhotoUpdate(false);

    setEmailUserNew(email);
    setEmailUser(email);

    setUserName(nickName ? nickName.replace(/@/g, '') : publicAddress || '');
    setUserNameNew(nickName ? nickName.replace(/@/g, '') : publicAddress || '');

    if (avatar) {
      setOriginalPhotoValue(avatar);
    } else {
      setOriginalPhotoValue(defaultAvatar);
    }
  }, [email, nickName, publicAddress, avatar, setEditModeUpper]);

  const checkInputForSame = (
    userName: string | undefined,
    userNameNew: string | undefined,
    emailUser: string | undefined,
    emailUserNew: string | undefined,
    filePhoto: string | object | undefined,
    userAvatar: string | undefined
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
      if (emailUser && emailUser !== emailUserNew) {
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
        const { success } = profileUpdateResponse.data;
        if (success) {
          dispatch(loadCurrentUser());
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
          rSwal.fire('Info', `The name ${userName} already exists`, 'question');
        } else {
          rSwal.fire('Info', `The ${errorData.message} `, 'question');
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
      dispatch,
      rSwal
    ]
  );

  useEffect(() => {
    if (currentUserAddress) {
      dispatch(loadCurrentUser());
    }
  }, [currentUserAddress, dispatch]);

  useEffect(() => {
    if (isLoggedIn) {
      setUserName((nickName && nickName.replace(/@/g, '')) || '');
      setEmailUser(email && email);
      if (avatar) {
        setOriginalPhotoValue(avatar);
        setNewPhotoValue(avatar);
      }
    }
  }, [
    isLoggedIn,
    nickName,
    email,
    avatar,
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
    resetAllStatesOnCancel();
  }, [resetAllStatesOnCancel]);

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
            {isLoggedIn && ageVerified && (
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
                  onClick={() => resetAllStatesOnCancel()}>
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
