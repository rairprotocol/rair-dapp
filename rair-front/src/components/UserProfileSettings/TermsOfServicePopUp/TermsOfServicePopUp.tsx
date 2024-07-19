import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios, { AxiosError } from 'axios';
import Swal from 'sweetalert2';

import { TUserResponse } from '../../../axios.responseTypes';
import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
import { getUserStart } from '../../../ducks/users/actions';
import useSwal from '../../../hooks/useSwal';
import { getRandomValues } from '../../../utils/getRandomValues';

const TermsOfServicePopUp = () => {
  return <ConfirmAgreements />;
};

export const AgreementsPopUp = ({
  userName,
  emailUser,
  filePhoto,
  currentUserAddress,
  setUserName,
  setMainEmail,
  setMainName,
  setUserAvatar,
  setImagePreviewUrl,
  onChangeEditMode
}) => {
  const [privacyPolicy, setPrivacyPolicy] = useState<boolean>(false);
  const [termsOfUse, setTermsOfUse] = useState<boolean>(false);
  const dispatch = useDispatch();

  const { textColor, primaryButtonColor } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);

  const onChangeUserInfo = async () => {
    const formData = new FormData();
    formData.append('nickName', userName);
    formData.append('email', emailUser);
    if (filePhoto) {
      formData.append('files', filePhoto);
      formData.append('avatar', filePhoto.name);
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

      if (user) {
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
        Swal.fire(
          'Success',
          `You have just changed your email address successfully!`,
          'success'
        );
      }
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const error = err as AxiosError;
      Swal.fire('Info', `The name ${userName} already exists`, 'question');
    }
  };

  return (
    <div className={`text-${textColor}`}>
      <div className="py-4 w-100 row">
        <div className="col-12 col-sm-1 d-none d-md-inline" />
        <div className="col-12 col-sm-10 pe-2 pe-md-5">
          {[
            {
              label: 'I agree to the',
              link: 'Privacy Policy',
              linkTarget: '/privacy',
              getter: privacyPolicy,
              setter: setPrivacyPolicy
            },
            {
              label: 'I accept the',
              link: 'Terms of Use',
              linkTarget: '/terms-use',
              getter: termsOfUse,
              setter: setTermsOfUse
            }
          ].map((item, index) => {
            const id = getRandomValues();
            return (
              <div key={index} className="my-2 w-100 px-0 mx-0 row">
                <label
                  className="h5 col-10 col-md-11 col-lg-10 col-xl-9 ps-md-5"
                  htmlFor={String(id)}>
                  {item.label} <wbr />
                  {item.link && (
                    <h4
                      className="d-inline"
                      onClick={() => window.open(item.linkTarget, '_blank')}
                      style={{ color: 'var(--bubblegum)' }}>
                      {item.link}
                    </h4>
                  )}
                </label>
                {item.setter && (
                  <div className="col-2 col-xl-3 col-sm-1 text-end text-md-center text-xl-start p-0">
                    <button
                      className={`btn btn-${
                        item.getter ? 'royal-ice' : 'secondary'
                      } rounded-rair`}
                      id={String(id)}
                      onClick={() => item.setter(!item.getter)}>
                      <FontAwesomeIcon
                        icon={faCheck}
                        style={{
                          color: item.getter ? 'inherit' : 'transparent'
                        }}
                      />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="col-12 col-sm-1 d-none d-md-inline" />
        <div className="w-100">
          <button
            onClick={onChangeUserInfo}
            disabled={!privacyPolicy || !termsOfUse}
            style={{
              background: primaryButtonColor,
              color: textColor
            }}
            className="btn my-4 rair-button rounded-rair col-12 col-sm-8 col-md-4">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const ConfirmAgreements = () => {
  const { primaryColor, textColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  const reactSwal = useSwal();
  const openModal = () => {
    reactSwal.fire({
      title: <h2 style={{ color: 'var(--bubblegum)' }}>Terms of Service</h2>,
      showConfirmButton: false,
      width: '90vw',
      customClass: {
        popup: `bg-${primaryColor} rounded-rair`,
        title: `text-${textColor}`
      }
    });
  };

  return (
    <div>
      <button onClick={() => openModal()}>Save</button>
    </div>
  );
};

export default TermsOfServicePopUp;
