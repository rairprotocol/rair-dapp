//@ts-nocheck
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Popup } from 'reactjs-popup';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { SocialBox } from '../../../styled-components/SocialLinkIcons/SocialLinkIcons';
import { BellIcon } from '../../Header/DiscordIcon';
import NotificationPage from '../NotificationPage/NotificationPage';
import NftImg from './images/image.png';

const MySwal = withReactContent(Swal);

const PopUpNotification = () =>
  // props was - isNotification
  {
    const [openModal, setOpenModal] = useState(false);
    const { headerLogo, primaryColor } = useSelector(
      (store) => store.colorStore
    );

    return (
      <Popup
        trigger={() => {
          // props was - open
          return (
            <SocialBox className="social-bell-icon" marginRight={'17px'}>
              <BellIcon primaryColor={primaryColor} />
            </SocialBox>
            // <button
            //   className="btn-notification"
            //   style={{
            //     // color: primaryColor === "charcoal" ? "#fff" : "var(--royal-purple)",
            //     backgroundColor:
            //       primaryColor === 'charcoal' ? '#222021' : '#D3D2D3'
            //   }}>
            //   {isNotification && <div className="ellipse" />}
            //   <i className="far fa-bell"></i>
            // </button>
          );
        }}
        position="bottom center"
        closeOnDocumentClick>
        {openModal && (
          <div
            className="pop-up-notification"
            style={{
              backgroundColor: `${
                primaryColor === 'rhyno' ? '#acacac' : '#383637'
              }`
            }}
            onClick={() => {
              setOpenModal(false);
              MySwal.fire({
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
                  <img src={headerLogo} alt="Rair Tech" />
                </div>
                <div className="text-notification">
                  <div className="title-notif">Notification from Rair.tech</div>
                  <div className="text-notif">
                    New announcements coming next Friday
                  </div>
                </div>
                <div
                  className="time-notification"
                  style={{
                    color: `${primaryColor === 'rhyno' && '#000'}`
                  }}>
                  3 hours ago
                </div>
              </div>
            </div>
            <div className="notification-from-factory">
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
            </div>
          </div>
        )}
      </Popup>
    );
  };

export default PopUpNotification;
