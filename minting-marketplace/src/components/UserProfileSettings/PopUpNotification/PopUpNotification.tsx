//@ts-nocheck
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Popup } from 'reactjs-popup';
import Swal from 'sweetalert2';

import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
import { BellIcon } from '../../../images';
import { SocialBox } from '../../../styled-components/SocialLinkIcons/SocialLinkIcons';
import { reactSwal } from '../../../utils/reactSwal';
import NotificationPage from '../NotificationPage/NotificationPage';

import NftImg from './images/image.png';

const PopUpNotification = () =>
  // props was - isNotification
  {
    const [openModal, setOpenModal] = useState(false);
    const { headerLogo, primaryColor, headerLogoMobile } = useSelector<
      RootState,
      ColorStoreType
    >((store) => store.colorStore);
    const { uploadVideo } = useSelector<RootState, any>(
      (store) => store.videoDemoStore
    );

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
          className="social-bell-icon"
          marginRight={'17px'}
          notification={true}>
          {uploadVideo && <span></span>}
          <BellIcon primaryColor={primaryColor} />
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
                  primaryColor === 'rhyno' ? '#acacac' : '#383637'
                }`,
                border: '1px solid #fff'
              }}
              onClick={() => {
                setOpenModal(false);
                reactSwal.fire({
                  html: (
                    <NotificationPage
                      NftImg={NftImg}
                      primaryColor={primaryColor}
                      headerLogo={headerLogo}
                    />
                  ),
                  width: '90vw',
                  customClass: {
                    popup: `bg-${primaryColor}`
                  },
                  onBeforeOpen: () => {
                    Swal.showLoading();
                  },
                  showConfirmButton: false,
                  showCloseButton: true
                  // cancelButtonText:
                  //     '<i class="fa fa-thumbs-down"></i>',
                  // cancelButtonAriaLabel: 'Thumbs down'
                });
              }}>
              <div className="notification-from-rair">
                <div className="box-notification">
                  <div className="dot-notification" />
                  <div className="notification-img">
                    <img src={headerLogoMobile} alt="Rair Tech" />
                  </div>
                  <div className="text-notification">
                    <div className="title-notif">
                      Notification from Rair.tech
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
              {/* <div className="notification-from-factory">
              <div className="box-notification">
                <div className="dot-notification" />
                <div className="notification-img">
                  <img src={NftImg} alt="Exclusive NFT token by RAIR" />
                </div>
                <div className="text-notification">
                  <div className="title-notif">Factory updates</div>
                  <div className="text-notif">
                    Your nft “<span>Pegayo</span>” has been listed
                  </div>
                </div>
                <div
                  className="time-notification"
                  style={{
                    color: `${primaryColor === 'rhyno' && '#000'}`
                  }}>
                  5 hours ago
                </div>
              </div>
            </div> */}
            </div>
          )}
        </Popup>
      </>
    );
  };

export default PopUpNotification;
