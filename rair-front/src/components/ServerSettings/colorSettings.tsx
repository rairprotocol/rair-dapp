import { useCallback, useEffect, useState } from 'react';
import { faArrowUp, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks';
import useServerSettings from '../../hooks/useServerSettings';
import useSwal from '../../hooks/useSwal';
import {
  arcticBlue,
  bubblegum,
  charcoal,
  rhyno,
  royalPurple
} from '../../redux/colorSlice';
import { loadSettings } from '../../redux/settingsSlice';
import { rFetch } from '../../utils/rFetch';
import InputField from '../common/InputField';

const ColorSettings = () => {
  const dispatch = useAppDispatch();

  const [customPrimaryColor, setCustomPrimaryColor] = useState<string>('');
  const [customSecondaryColor, setCustomSecondaryColor] = useState<string>('');
  const [customTextColor, setCustomTextColor] = useState<string>('');
  const [customPrimaryButtonColor, setCustomPrimaryButtonColor] =
    useState<string>('');
  const [customSecondaryButtonColor, setCustomSecondaryButtonColor] =
    useState<string>('');
  const [customFadeButtonColor, setCustomFadeButtonColor] =
    useState<string>('');
  const [customIconColor, setCustomIconColor] = useState<string>('');

  const [customDarkModeLogo, setCustomDarkModeLogo] = useState<string>('');
  const [customDarkModeMobileLogo, setCustomDarkModeMobileLogo] =
    useState<string>('');
  const [customLightModeLogo, setCustomLightModeLogo] = useState<string>('');
  const [customLightModeMobileLogo, setCustomLightModeMobileLogo] =
    useState<string>('');
  const [customFavicon, setCustomFavicon] = useState<string>('');

  const { updateServerSetting } = useServerSettings();
  const reactSwal = useSwal();
  const { primaryButtonColor, textColor } = useAppSelector(
    (store) => store.colors
  );
  const {
    darkModePrimary,
    darkModeSecondary,
    darkModeText,
    buttonPrimaryColor,
    buttonSecondaryColor,
    buttonFadeColor,
    iconColor,
    darkModeBannerLogo,
    darkModeMobileLogo,
    lightModeBannerLogo,
    lightModeMobileLogo,
    favicon
  } = useAppSelector((store) => store.settings);

  useEffect(() => {
    if (darkModePrimary) {
      setCustomPrimaryColor(darkModePrimary);
    }
    if (darkModeSecondary) {
      setCustomSecondaryColor(darkModeSecondary);
    }
    if (darkModeText) {
      setCustomTextColor(darkModeText);
    }
    if (buttonPrimaryColor) {
      setCustomPrimaryButtonColor(buttonPrimaryColor);
    }
    if (buttonSecondaryColor) {
      setCustomSecondaryButtonColor(buttonSecondaryColor);
    }
    if (buttonFadeColor) {
      setCustomFadeButtonColor(buttonFadeColor);
    }
    if (iconColor) {
      setCustomIconColor(iconColor);
    }
    if (darkModeBannerLogo) {
      setCustomDarkModeLogo(darkModeBannerLogo);
    }
    if (darkModeMobileLogo) {
      setCustomDarkModeMobileLogo(darkModeMobileLogo);
    }
    if (lightModeBannerLogo) {
      setCustomLightModeLogo(lightModeBannerLogo);
    }
    if (lightModeMobileLogo) {
      setCustomLightModeMobileLogo(lightModeMobileLogo);
    }
    if (favicon) {
      setCustomFavicon(favicon);
    }
  }, [
    buttonFadeColor,
    buttonPrimaryColor,
    buttonSecondaryColor,
    darkModeBannerLogo,
    darkModeMobileLogo,
    darkModePrimary,
    darkModeSecondary,
    darkModeText,
    favicon,
    iconColor,
    lightModeBannerLogo,
    lightModeMobileLogo
  ]);

  const loadImage = useCallback(
    (setterTarget) => (file: Blob) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (file.type !== 'video/mp4') {
          setterTarget(file);
        } else {
          reactSwal.fire(
            'Info',
            `You cannot upload video as a logo`,
            'warning'
          );
        }
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    },
    [reactSwal]
  );

  const setAppLogos = useCallback(
    async (target: string, image: any) => {
      const formData = new FormData();
      if (image) {
        formData.append('logoImage', image);
      }
      formData.append('target', target);
      const { success } = await rFetch(`/api/settings/appLogo`, {
        method: 'POST',
        body: formData
      });
      if (success) {
        dispatch(loadSettings());
        reactSwal.fire(
          'Success',
          `App Logo ${image ? 'Set' : 'Removed'}`,
          'success'
        );
      }
    },
    [dispatch, reactSwal]
  );

  return (
    <>
      <div className="col-12 col-md-6 px-5 my-2">
        <h3>Custom Dark Mode Colors</h3>
        {[
          {
            getter: customPrimaryColor,
            setter: setCustomPrimaryColor,
            label: 'Primary Color'
          },
          {
            getter: customSecondaryColor,
            setter: setCustomSecondaryColor,
            label: 'Secondary Color'
          },
          {
            getter: customTextColor,
            setter: setCustomTextColor,
            label: 'Text Color'
          },
          {
            getter: customPrimaryButtonColor,
            setter: setCustomPrimaryButtonColor,
            label: 'Primary Button Color'
          },
          {
            getter: customSecondaryButtonColor,
            setter: setCustomSecondaryButtonColor,
            label: 'Secondary Button Color'
          },
          {
            getter: customFadeButtonColor,
            setter: setCustomFadeButtonColor,
            label: 'Fade Button Color'
          },
          {
            getter: customIconColor,
            setter: setCustomIconColor,
            label: 'Icon color'
          }
        ].map((item, index) => {
          return (
            <div key={index} className="row">
              <div className="col-12 col-md-6">
                <InputField
                  customClass="form-control p-0"
                  label={item.label}
                  getter={item.getter}
                  setter={item.setter}
                  type="color"
                />
              </div>
              <div className="col-12 col-md-6">
                <InputField
                  customClass="form-control p-0"
                  label="Hex (#FFFFFF)"
                  getter={item.getter}
                  setter={item.setter}
                />
              </div>
            </div>
          );
        })}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '10px'
          }}>
          <button
            className="btn btn-success"
            onClick={async () => {
              await updateServerSetting({
                darkModePrimary: customPrimaryColor,
                darkModeSecondary: customSecondaryColor,
                darkModeText: customTextColor,
                buttonPrimaryColor: customPrimaryButtonColor,
                buttonFadeColor: customFadeButtonColor,
                buttonSecondaryColor: customSecondaryButtonColor,
                iconColor: customIconColor
              });
            }}>
            Set colors
          </button>
          <button
            className="btn btn-warning"
            onClick={async () => {
              await updateServerSetting({
                darkModePrimary: charcoal,
                darkModeSecondary: rhyno,
                darkModeText: '#FFF',
                buttonPrimaryColor: royalPurple,
                buttonFadeColor: bubblegum,
                buttonSecondaryColor: arcticBlue,
                iconColor: bubblegum
              });
            }}>
            Reset colors
          </button>
        </div>
      </div>
      <div className="col-12 col-md-6 px-5 my-2">
        <h3>Custom Logos</h3>
        {[
          {
            label: 'Dark Mode Desktop Logo',
            getter: customDarkModeLogo,
            setter: setCustomDarkModeLogo,
            target: 'darkModeBannerLogo'
          },
          {
            label: 'Dark Mode Mobile logo',
            getter: customDarkModeMobileLogo,
            setter: setCustomDarkModeMobileLogo,
            target: 'darkModeMobileLogo'
          },
          {
            label: 'Light Mode Desktop Logo',
            getter: customLightModeLogo,
            setter: setCustomLightModeLogo,
            target: 'lightModeBannerLogo'
          },
          {
            label: 'Light Mode Mobile Logo',
            getter: customLightModeMobileLogo,
            setter: setCustomLightModeMobileLogo,
            target: 'lightModeMobileLogo'
          },
          {
            label: 'Favicon',
            getter: customFavicon,
            setter: setCustomFavicon,
            target: 'favicon'
          }
        ].map((item, index) => {
          return (
            <div className="row" key={index}>
              <div className="col-12 col-md-10">
                <InputField
                  customClass="form-control p-0"
                  label={item.label}
                  setter={loadImage(item.setter)}
                  setterField={['files', 0]}
                  type="file"
                />
              </div>
              <button
                disabled={!item.getter}
                onClick={() => setAppLogos(item.target, item.getter)}
                className="col-12 col-md-1 btn rair-button"
                style={{
                  background: primaryButtonColor,
                  color: textColor
                }}>
                <FontAwesomeIcon icon={faArrowUp} />
              </button>
              <button
                onClick={() => setAppLogos(item.target, undefined)}
                className="col-12 col-md-1 btn btn-danger">
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ColorSettings;
