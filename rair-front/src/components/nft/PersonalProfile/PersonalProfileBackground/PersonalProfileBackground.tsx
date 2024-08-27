import { memo, useCallback, useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import Swal from 'sweetalert2';

import { TUserResponse } from '../../../../axios.responseTypes';
import { useAppSelector } from '../../../../hooks/useReduxHooks';

import cl from './PersonalProfileBackground.module.css';

const PersonalProfileBackgroundComponent = () => {
  const [backgroundUser, setBackgroundUser] = useState<any | null>();
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [loadingBg, setLoadingBg] = useState(false);

  const { currentUserAddress } = useAppSelector((store) => store.web3);

  const editBackground = useCallback(async () => {
    if (currentUserAddress) {
      const formData = new FormData();
      if (fileUpload) {
        setLoadingBg(true);
        formData.append('files', fileUpload);
        formData.append('background', fileUpload.name);

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
          setBackgroundUser(user.background);
          setFileUpload(null);
          setLoadingBg(false);
        }
      } else {
        const profileEditResponse = await axios.get<TUserResponse>(
          `/api/users/${currentUserAddress.toLowerCase()}`,
          {
            headers: {
              Accept: 'multipart/form-data'
            }
          }
        );

        const { user, success } = profileEditResponse.data;
        if (success && user) {
          setBackgroundUser(user.background);
        }
      }
    }
  }, [fileUpload, currentUserAddress]);

  const photoUpload = useCallback(
    (e) => {
      e.preventDefault();
      const reader = new FileReader();
      const fileF = e.target.files[0];
      reader.onloadend = () => {
        if (fileF.type !== 'video/mp4') {
          setFileUpload(fileF);
          setBackgroundUser(reader.result);
        } else {
          Swal.fire(
            'Info',
            `You cannot upload video to background!`,
            'warning'
          );
        }
      };
      if (fileF) {
        reader.readAsDataURL(fileF);
      }
    },
    [setBackgroundUser]
  );

  useEffect(() => {
    editBackground();
  }, [editBackground]);

  return (
    <div
      style={{
        backgroundImage:
          backgroundUser && !loadingBg ? `url(${backgroundUser})` : ''
      }}>
      {loadingBg && (
        <div className={cl.loadingProfile}>
          <div className="loader-wrapper">
            <div className="load" />
          </div>
        </div>
      )}
      <div>
        <label className={cl.inputFile}>
          <AddIcon className={cl.plus} />
          <input
            disabled={loadingBg ? true : false}
            type="file"
            onChange={photoUpload}
          />
        </label>
      </div>
    </div>
  );
};

export const PersonalProfileBackground = memo(
  PersonalProfileBackgroundComponent
);
