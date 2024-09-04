import PopUpSettings from './PopUpSetting';

import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks';
import { SunIcon } from '../../images';
import { setColorScheme } from '../../redux/colorSlice';
import { SocialBox } from '../../styled-components/SocialLinkIcons/SocialLinkIcons';
import { TooltipBox } from '../common/Tooltip/TooltipBox';

import './UserProfileSettings.css';

const UserProfileSettings = ({ showAlert, setTabIndexItems }) => {
  const dispatch = useAppDispatch();
  const { isLoggedIn } = useAppSelector((store) => store.user);
  const { primaryColor, isDarkMode } = useAppSelector((store) => store.colors);

  return (
    <div
      style={{
        display: 'flex',
        alignContent: 'center'
      }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <TooltipBox position={'bottom'} title="Switch Theme">
          <SocialBox
            className="social-sun-icon"
            primaryColor={primaryColor}
            marginRight={'17px'}
            onClick={() => {
              dispatch(setColorScheme(isDarkMode ? 'light' : 'dark'));
            }}>
            <SunIcon />
          </SocialBox>
        </TooltipBox>
        {isLoggedIn && (
          <div
            style={{
              marginRight: '12px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            className="user-block">
            <PopUpSettings
              showAlert={showAlert}
              setTabIndexItems={setTabIndexItems}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileSettings;
