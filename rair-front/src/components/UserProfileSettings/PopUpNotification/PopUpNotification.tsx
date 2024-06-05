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
import NotificationPage from '../NotificationPage/NotificationPage';

import NftImg from './images/image.png';
import NotificationBox from './NotificationBox/NotificationBox';

const PopUpNotification = () =>
  // props was - isNotification
  {
    const currentName =
      import.meta.env.VITE_TESTNET === 'true' ? 'HotDrops' : 'Rair.tech';
    const [openModal, setOpenModal] = useState();
    const arrayExample = [{
      title: "Factory updates",
      id: 1,
      time: 'Right now'
    },
    {
      title: "Factory updates",
      id: 2,
      time: '2 hours ago'
    },
    {
      title: "Factory updates",
      id: 3,
      time: '3 hours ago'
    },
    {
      title: "Factory updates",
      id: 4,
      time: 'two weeks ago'
    },
    {
      title: "Factory updates",
      id: 5,
      time: 'yesterday'
    }
  ];
    const [notificationArray, setNotificationArray] = useState(arrayExample);
    const { headerLogo, primaryColor, headerLogoMobile } = useSelector<
      RootState,
      ColorStoreType
    >((store) => store.colorStore);
    const { uploadVideo } = useSelector<RootState, any>(
      (store) => store.videoDemoStore
    );
    const { userRd } = useSelector<RootState, TUsersInitialState>(
      (store) => store.userStore
    );
    const reactSwal = useSwal();

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
          <div className="red-circle-notifications"></div>
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
                maxHeight: "400px",
                overflowY: "scroll",
                border: '1px solid #fff',
                color: `${primaryColor === 'rhyno' && '#000'}`
                
              }}
              // onClick={() => {
              //   setOpenModal(true);
              //   reactSwal.fire({
              //     html: (
              //       <NotificationPage
              //         NftImg={NftImg}
              //         primaryColor={primaryColor}
              //         headerLogo={headerLogo}
              //       />
              //     ),
              //     width: '90vw',
              //     customClass: {
              //       popup: `bg-${primaryColor}`
              //     },
              //     onBeforeOpen: () => {
              //       Swal.showLoading();
              //     },
              //     showConfirmButton: false,
              //     showCloseButton: true
              //     // cancelButtonText:
              //     //     '<i class="fa fa-thumbs-down"></i>',
              //     // cancelButtonAriaLabel: 'Thumbs down'
              //   });
              // }}
              >
              <div className="notification-from-rair">
                <div className="box-notification">
                  {/* <div className="dot-notification" /> */}
                  <div className="notification-img">
                    <img src={headerLogoMobile} alt="Rair Tech" />
                  </div>
                  <div className="text-notification">
                    <div className="title-notif">
                      Notification from {currentName}
                    </div>
                    <div className="text-notif">
                      Don’t click away! You can navigate away from the page once
                      your video is done uploading
                    </div>
                  </div>
                  {/* <div
                  className="time-notification"
                  style={{
                    color: `${primaryColor === 'rhyno' && '#000'}`
                  }}>
                  3 hours ago
                </div> */}
                </div>
              </div>
              {notificationArray.map((el, key) => {
                return <NotificationBox el={el} notificationArray={notificationArray} key={key} setNotificationArray={setNotificationArray} title={el.title} time={el.time} primaryColor={primaryColor} />
              })}
            </div>
          )}
        </Popup>
      </>
    );
  };

export default PopUpNotification;
