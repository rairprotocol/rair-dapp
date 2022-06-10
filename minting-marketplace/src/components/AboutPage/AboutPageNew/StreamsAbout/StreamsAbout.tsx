
// import { useState } from 'react';
import VideoBg_1 from './../../assets/video-bg_1.png';
import VideoBg_2 from './../../assets/video-bg_2.png';
// import ArrowUp from './../../assets/arrow-up-about.png';
// import MetamaskTutorial from './../../assets/matamaskTutorial.png';
// import JoinCom from '../../../SplashPage/JoinCom/JoinCom';
// import Modal from "react-modal";
import { useSelector, Provider, useStore } from 'react-redux';
import StandaloneVideoPlayer from "../../../video/videoPlayerGenerall";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { IStreamsAbout } from '../aboutPage.types';
import { RootState } from '../../../../ducks';
import { ColorStoreType } from '../../../../ducks/colors/colorStore.types';
import { useState } from 'react';

const reactSwal = withReactContent(Swal);

const StreamsAbout: React.FC<IStreamsAbout> = ({ Metamask, purchaseButton }) => {

    // const [showVideo, setShowVideo] = useState(false);

    // const { currentUserAddress } = useSelector(store => store.contractStore);
    const { primaryColor, textColor } = useSelector<RootState, ColorStoreType>(store => store.colorStore);
    const [process, setProcessDone] = useState(false);
    const urlVideo = "https://storage.googleapis.com/rair-videos/";
    const mediaIdVideo = "pxlXm5vHD6KE3nVarq5HygBuKA54wqWsBoYf4vci_hp0Tc";

    const store = useStore();

    const openVideo = (baseURL, mediaId) => {
        reactSwal.fire({
            title: 'How RAIR works',
            html: <Provider store={store}>
                <StandaloneVideoPlayer
                    {...{ baseURL, mediaId, setProcessDone }}
                />
            </Provider>,
            width: '90vw',
            // height: '90vh',
            customClass: {
                popup: `bg-${primaryColor}`,
                title: `text-${textColor}`,
            },
            showConfirmButton: false
        })
    }

    const handleOpenVideo = (baseURL, mediaId) => {
        if (!process) {
            openVideo(baseURL, mediaId)
        }
    }

    return (
        <div className="about-streams-video">
            <div className="about-streams-video-title">How it  <span className="change-color-text">works</span></div>
            <div className="about-video-tutorial-text">
                Watch our tutorial video on Web2 to learn how to watch encrypted videos on Web3
            </div>
            <div className="box-video-player">
                <iframe title="unique-box-video" src="https://www.youtube.com/embed/ju4aohAfXEs">
                </iframe>
            </div>
            {/* <div className="about-video-tutorial-text">
                You’ll need Metamask and a watch token to  play our encrypted streams. No middleman necessary.
            </div> */}
            <div className="join-community">
                <div className="title-join">
                    <h3>Test our  <span className="text-gradient">streams</span></h3>
                </div>
                <div
                    className="community-description"
                    style={{ background: `${primaryColor === "rhyno" ? "#fff" : "#383637"}` }}
                >
                    <div className="community-text">
                        <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>
                            You’ll need <span>Metamask</span> and a watch token to  play our encrypted streams.
                            To stream the videos below you’ll need to mint a watch token for .1 MATIC
                        </p>

                        {purchaseButton}
                    </div>
                </div>
            </div>
            <div className="tutorial-with-metamask">
                <div className="container-content-metamask">
                    {/* <div className="content-show-arrow">
                        <img src={ArrowUp} alt="cursor" />
                    </div>
                    <div className="metamask-box">
                        <img src={MetamaskTutorial} alt="img-metamask" />
                        <div className="btn-buy-metamask">
                            <button>
                                <img
                                    className="metamask-logo"
                                    src={Metamask}
                                    alt="metamask-logo"
                                />{" "}
                                Mint a token
                            </button>
                        </div>
                    </div> */}
                    <div className="container-block-video">
                        <div className="block-videos">
                            <div className="box-video">
                                <div
                                    onClick={() => handleOpenVideo(urlVideo, mediaIdVideo)}
                                    className="video-locked"
                                    style={{
                                        background: `${primaryColor === "rhyno" ? "#fff" : "#4E4D4DCC"}`,
                                        cursor: `${process ? "default" : "pointer"}`
                                    }}
                                >
                                    <div style={{ position: "relative" }}>
                                        <div className="video-icon">
                                            <i className="fa fa-lock"></i>
                                            <p>RAIR  Exclusive</p>
                                        </div>
                                        <img src={VideoBg_2} alt="unlockble video" />
                                    </div>
                                    <div className="video-description">
                                        <div className="video-title">
                                            <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#fff"}` }}>How RAIR Works</p>
                                        </div>
                                        <div className="video-timer">
                                            <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>00:05:33</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="box-video">
                                <div
                                    className="video-locked"
                                    style={{ background: `${primaryColor === "rhyno" ? "#fff" : "#4E4D4DCC"}` }}
                                >
                                    <div style={{ position: "relative" }}>
                                        <div className="video-icon">
                                            <i className="fa fa-lock"></i>
                                            <p>RAIR  Exclusive</p>
                                        </div>
                                        <img src={VideoBg_1} alt="unlockble video" />
                                    </div>
                                    <div className="video-description">
                                        <div className="video-title">
                                            <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#fff"}` }}>Coming soon</p>
                                        </div>
                                        {/* <div className="video-timer">
                                            <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>00:05:27</p>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                            <div className="box-video">
                                <div
                                    className="video-locked"
                                    style={{ background: `${primaryColor === "rhyno" ? "#fff" : "#4E4D4DCC"}` }}
                                >
                                    <div style={{ position: "relative" }}>
                                        <div className="video-icon">
                                            <i className="fa fa-lock"></i>
                                            <p>RAIR  Exclusive</p>
                                        </div>
                                        <img src={VideoBg_2} alt="unlockble video" />
                                    </div>
                                    <div className="video-description">
                                        <div className="video-title">
                                            <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#fff"}` }}>Coming soon</p>
                                        </div>
                                        {/* <div className="video-timer">
                                            <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>00:09:33</p>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                            <div className="box-video">
                                <div
                                    className="video-locked"
                                    style={{ background: `${primaryColor === "rhyno" ? "#fff" : "#4E4D4DCC"}` }}
                                >
                                    <div style={{ position: "relative" }}>
                                        <div className="video-icon">
                                            <i className="fa fa-lock"></i>
                                            <p>RAIR  Exclusive</p>
                                        </div>
                                        <img src={VideoBg_1} alt="unlockble video" />
                                    </div>
                                    <div className="video-description">
                                        <div className="video-title">
                                            <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#fff"}` }}>Coming soon</p>
                                        </div>
                                        {/* <div className="video-timer">
                                            <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>00:05:27</p>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="text-watch-token">
                            To stream the videos above you’ll need to mint<br />
                            a watch token for .1 MATIC
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StreamsAbout
