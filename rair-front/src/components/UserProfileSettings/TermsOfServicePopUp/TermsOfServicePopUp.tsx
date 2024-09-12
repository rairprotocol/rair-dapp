import { useState } from 'react';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

import { TUserResponse } from '../../../axios.responseTypes';
import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxHooks';
import useSwal from '../../../hooks/useSwal';
import { loadCurrentUser } from '../../../redux/userSlice';
import { getRandomValues } from '../../../utils/getRandomValues';

const TermsOfServicePopUp = () => {
  return <ConfirmAgreements />;
};

export const AgreementsPopUp = ({
  userName,
  emailUser,
  filePhoto,
  currentUserAddress
}) => {
  const [privacyPolicy, setPrivacyPolicy] = useState<boolean>(false);
  const [termsOfUse, setTermsOfUse] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const { textColor, primaryButtonColor } = useAppSelector(
    (store) => store.colors
  );
  const rSwal = useSwal();

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
      const { success } = profileUpdateResponse.data;

      if (success) {
        rSwal.fire(
          'Success',
          `You have just changed your email address successfully!`,
          'success'
        );
      }

      dispatch(loadCurrentUser());
    } catch (err) {
      rSwal.fire('Info', `The name ${userName} already exists`, 'question');
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
  const { primaryColor, textColor } = useAppSelector((store) => store.colors);

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
