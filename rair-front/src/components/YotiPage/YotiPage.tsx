import { FC, useState } from 'react';
import FaceCapture from '@getyoti/react-face-capture';

import useSwal from '../../hooks/useSwal';
import { YotiLogo } from '../../images';
import { loadCurrentUser } from '../../redux/userSlice';
import { rFetch } from '../../utils/rFetch';

import './YotiPage.css';

interface YotiPage {
  setOpenVideoPlayer?: React.Dispatch<React.SetStateAction<boolean>>;
}

const YotiPage: FC<YotiPage> = ({ setOpenVideoPlayer }) => {
  const [yotiVerify, setYotiVerify] = useState(false);
  const reactSwal = useSwal();

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

    loadCurrentUser();

    if (data.success && data.data.age.age_check === 'pass') {
      reactSwal
        .fire({
          title: 'Age verified!',
          html: 'Thanks you for verification',
          icon: 'success'
        })
        .then((result) => {
          if (result.isConfirmed && setOpenVideoPlayer) {
            setOpenVideoPlayer(true);
          }
        });
    } else {
      reactSwal.fire({
        title: 'Your age is not verified',
        html: 'Please try again later',
        icon: 'error'
      });
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
          numStableFrames={4}
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
