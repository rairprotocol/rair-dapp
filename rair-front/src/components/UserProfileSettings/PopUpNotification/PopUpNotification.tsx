//@ts-nocheck
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Popup } from 'reactjs-popup';
import Swal from 'sweetalert2';

import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
import { TUsersInitialState } from '../../../ducks/users/users.types';
import useSwal from '../../../hooks/useSwal';
import { BellIcon } from '../../../images';
import { SocialBox } from '../../../styled-components/SocialLinkIcons/SocialLinkIcons';
import LoadingComponent from '../../common/LoadingComponent';
import NotificationPage from '../NotificationPage/NotificationPage';

import { rFetch } from "./../../../utils/rFetch";
import NftImg from './images/image.png';
import NotificationBox from './NotificationBox/NotificationBox';

const PopUpNotification = () =>
  // props was - isNotification
  {
    const currentName =
      import.meta.env.VITE_TESTNET === 'true' ? 'HotDrops' : 'Rair.tech';
    const [openModal, setOpenModal] = useState(false);
    const { headerLogo, primaryColor, headerLogoMobile } = useSelector<
      RootState,
      ColorStoreType
    >((store) => store.colorStore);
    const { uploadVideo } = useSelector<RootState, any>(
      (store) => store.videoDemoStore
    );
    const [realData, setRealData] = useState([]);
    const [flagLoading, setFlagLoading] = useState(false);
    const { userRd } = useSelector<RootState, TUsersInitialState>(
      (store) => store.userStore
    );
    const reactSwal = useSwal();

    const getNotifications = useCallback(async () => {
      if (openModal) {
        setFlagLoading(true);
        const result = await rFetch(`/api/notifications/`);
        if (result.success) {
          setRealData(result.notifications);
          setFlagLoading(false);
        }
      }
    }, [openModal]);

    useEffect(() => {
      getNotifications();
    }, [getNotifications]);

    const onCloseNext = useCallback(() => {
      if (!openModal) {
        setOpenModal(false);
      }
    }, [openModal]);

    useEffect(() => {
      onCloseNext();
    }, [onCloseNext]);

    useEffect(() => {
      if (uploadVideo) {
        setOpenModal(true);
      } else {
        setOpenModal(false);
      }
    }, [uploadVideo]);

    return (
      <>
        <SocialBox
          onClick={() => setOpenModal((prev) => !prev)}
          className="social-bell-icon notifications"
          marginRight={'17px'}
          notification={true}>
          {uploadVideo && userRd?.email && <span></span>}
          <BellIcon primaryColor={primaryColor} />
          {realData && realData.length > 0 && (
            <div className="red-circle-notifications"></div>
          )}
        </SocialBox>
        <Popup
          className="popup-notification-block"
          open={openModal}
          closeOnDocumentClick
          onClose={() => {
            setOpenModal(false);
          }}>
          {openModal && (
            <div
              className="pop-up-notification"
              style={{
                backgroundColor: `${
                  primaryColor === 'rhyno' ? 'rgb(246 246 246)' : '#383637'
                }`,
                border: '1px solid #fff',
                color: `${primaryColor === 'rhyno' && '#000'}`,
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
              {flagLoading ? (
                <LoadingComponent />
              ) : realData && realData.length > 0 ? (
                realData.map((el) => {
                  return (
                    <NotificationBox
                      getNotifications={getNotifications}
                      el={el}
                      key={el._id}
                      title={el.message}
                      primaryColor={primaryColor}
                    />;
                  );
                })
              ) : (
                <div
                  style={{
                    padding: '25px 16px'
                  }}>
                  You don't have any notifications now
                </div>
              )}
            </div>
          )}
        </Popup>
      </>
    );
  };

export default PopUpNotification;
