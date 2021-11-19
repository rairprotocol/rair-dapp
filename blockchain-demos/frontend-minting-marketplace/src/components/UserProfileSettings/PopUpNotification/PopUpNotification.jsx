import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Popup } from 'reactjs-popup';
import NftImg from './images/image.png';


const PopUpNotification = ({ primaryColor }) => {
    const [openModal, setOpenModal] = useState(false);
    const { headerLogo } = useSelector(store => store.colorStore);


    return (
        <Popup
            trigger={open => {
                setOpenModal(open);
                return <button style={{
                    color: primaryColor === "charcoal" ? "#fff" : "var(--royal-purple)",
                    marginRight: "15px",
                    border: `solid 1px ${primaryColor === "charcoal" ? "#fff" : "var(--royal-purple)"}`,
                    backgroundColor: primaryColor === "charcoal" ? "#222021" : "#D3D2D3",
                    borderRadius: '12px',
                    position: "relative",
                    width: 32,
                    height: 32,
                    fontSize: 18
                }}>
                    <div className="ellipse" />
                    <i className="far fa-bell"></i>
                </button>
            }}
            position="bottom center"
            closeOnDocumentClick
        >
            <div className="pop-up-notification">
                <div className="notification-from-rair">
                    <div className="box-notification">
                        <div className="dot-notification" />
                        <div className="notification-img">
                            <img src={headerLogo} alt="author" />
                        </div>
                        <div className="text-notification">
                            <div className="title-notif">
                                Notification from Rair.tech
                            </div>
                            <div className="text-notif">
                                New announcements coming next Friday
                            </div>
                        </div>
                        <div className="time-notification">
                            3 hours ago
                        </div>
                    </div>
                </div>
                <div className="notification-from-factory">
                    <div className="box-notification">
                        <div className="dot-notification" />
                        <div className="notification-img">
                            <img src={NftImg} alt="author" />
                        </div>
                        <div className="text-notification">
                            <div className="title-notif">
                                Factory updates
                            </div>
                            <div className="text-notif">
                                Your nft “<span>Pegayo</span>” has been listed
                            </div>
                        </div>
                        <div className="time-notification">
                            5 hours ago
                        </div>
                    </div>
                </div>
            </div>
        </Popup>
    )
}

export default PopUpNotification;
