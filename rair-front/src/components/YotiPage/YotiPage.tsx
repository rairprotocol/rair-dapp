import { useState } from 'react';
import { useDispatch } from 'react-redux';
import FaceCapture from '@getyoti/react-face-capture';

import { setUserData } from '../../ducks/users/actions';
import useSwal from '../../hooks/useSwal';
import { YotiLogo } from '../../images';
import { rFetch } from '../../utils/rFetch';

import './YotiPage.css';

const YotiPage = ({ setOpenVideoplayer }) => {
  const [yotiVerify, setYotiVerify] = useState(false);
  const reactSwal = useSwal();
  const dispatch = useDispatch();

  const onSuccess = async ({ img }) => {
    const data = await rFetch('/api/users/verify-age', {
      method: 'POST',
      body: JSON.stringify({
        image: img
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (data.success) {
      if (data.data.age.age_check === 'pass') {
        const { success, user: userInfoData } = await rFetch(
          '/api/auth/me/',
          undefined,
          undefined,
          false
        );

        if (success) {
          dispatch(setUserData(userInfoData));
        }
        reactSwal
          .fire({
            title: 'Age verified!',
            html: 'Thanks you for verification',
            icon: 'success'
          })
          .then((result) => {
            if (result.isConfirmed) {
              setOpenVideoplayer(true);
            }
          });
      } else {
        reactSwal.fire({
          title: 'Your age is not verified',
          html: 'Please try again later',
          icon: 'error'
        });
      }
    }
  };
  const onError = (error) => console.error(`Error =, ${error}`);

  return (
    <div>
      {yotiVerify ? (
        <FaceCapture
          clientSdkId={'10b5c4aa-cc86-413e-a5b0-962fe95831ac'}
          onSuccess={onSuccess}
          onError={onError}
          secure={false}
          returnPreviewImage={true}
          faceCaptureAssetsRootUrl={'/yoti-assets/'}
        />
      ) : (
        <div className="yoti-container">
          <div>
            <h4>Verify age once with</h4>
          </div>
          <div
            style={{
              margin: '10px 0'
            }}>
            <img src={YotiLogo} alt="yoti logo" />
          </div>
          <div
            style={{
              margin: '20px 0'
            }}>
            <a
              style={{
                color: '#fff',
                textDecoration: 'underline'
              }}
              href="https://www.yoti.com/"
              target="_blank"
              rel="noreferrer">
              how is this secure and anonymous?
            </a>
          </div>
          <button
            className="btn-yoti-verify"
            onClick={() => setYotiVerify(true)}>
            Verify now
          </button>
        </div>
      )}
    </div>
  );
};

export default YotiPage;
