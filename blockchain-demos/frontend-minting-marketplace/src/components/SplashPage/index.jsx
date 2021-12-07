import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";

import "./SplashPage.css";

/* importing images*/
import Metamask from "./images/metamask_logo.png";
import logoAuthor from "./images/colab.png";
import Nft_1 from "./images/exclusive_1.jpeg";
import Nft_2 from "./images/exclusive_2.jpeg";
import Nft_3 from "./images/exclusive_3.jpeg";
import Nft_4 from "./images/image_3.png";
import NftImage from "./images/circle_nipsey.png";
import UnlockableVideo from "./images/unlockbleVideo.png";
import JoinCommunity from "./images/join_com.jpeg";
import DigitalMobile from './images/digital-mobile.png';
import NftMobile_1 from './images/nft-mobile_1.png';
import NftMobile_2 from './images/nft-mobile_2.png';
import VideoPresent from './images/video-present.png';
import RairTechMobile from './images/rair_tech_mobile.png';

/* importing Components*/
import TokenLeft from "./TokenLeft/TokenLeft";
import ExclusiveNft from "./ExclusiveNft/ExclusiveNft";
import UnlockVideos from "./UnlockVideos/UnlockVideos";
import TeamMeet from "./TeamMeet/TeamMeetList";
import JoinCom from "./JoinCom/JoinCom";

import Modal from "react-modal";

const customStyles = {
  overlay: {
    zIndex: "1",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    fontFamily: "Plus Jakarta Text",
    borderRadius: "16px",
  },
};

Modal.setAppElement("#root");

const SplashPage = () => {
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, [])

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#9013FE";
  }

  function closeModal() {
    setIsOpen(false);
  }


  const { primaryColor } = useSelector((store) => store.colorStore);

  return (
    <div className="wrapper-splash-page">
      <div className="home-splash--page">
        <div className="information-author">
          <div className="block-splash">
            <div className="text-splash">
              <div className="title-splash">
                <h3>Enter the</h3>
                <span>Nipseyverse</span>
              </div>
              <div className="text-description">
                <p>
                  1000 Unique NFTs unlock exlusive streaming for the final
                  Nipsey Hussle album. Proceeds directly benefit the Airmiess
                  Asghedom estate on chain.
                </p>
              </div>
              <div className="btn-buy-metamask">
                <button onClick={openModal}>
                  <img
                    className="metamask-logo"
                    src={Metamask}
                    alt="metamask-logo"
                  />{" "}
                  Preorder with ETH
                </button>
                <Modal
                  isOpen={modalIsOpen}
                  onAfterOpen={afterOpenModal}
                  onRequestClose={closeModal}
                  style={customStyles}
                  contentLabel="Example Modal"
                >
                  <h2
                    style={{
                      fontSize: "60px",
                      fontWeight: "bold",
                      paddingTop: "3rem",
                      cursor: 'default',
                    }}
                    ref={(_subtitle) => (subtitle = _subtitle)}
                  >
                    Terms of Service
                  </h2>
                  {/* <button onClick={closeModal}>close</button> */}
                  <div className="modal-content-wrapper">
                    <div className="modal-form">
                      <form>
                        <div className="form-group">
                          <input type="checkbox" id="policy" />
                          <label htmlFor="policy">
                            I agree to the{" "}
                            <span
                              style={{
                                color: "#9013FE",
                                fontSize: "24px",
                                paddingRight: "1rem",
                              }}
                            >
                              Privacy Policy
                            </span>
                          </label>
                        </div>
                        <div className="form-group">
                          <input type="checkbox" className="dgdfgd" id="use" />
                          <label htmlFor="use">
                            I accept the{" "}
                            <span
                              style={{
                                color: "#9013FE",
                                fontSize: "24px",
                                paddingRight: "2.3rem",
                              }}
                            >
                              Terms of Use
                            </span>
                          </label>
                        </div>
                      </form>
                    </div>
                    <div className="modal-content-np">
                      <div className="modal-text-wrapper">
                        <span className="modal-text">
                          I understand this is a prerelease NFT. Final artwork
                          and access to encrypted streams will be associated
                          with your NFT serial number at the time of launch.
                        </span>
                      </div>
                      <div className="modal-btn-wrapper">
                        <button className="modal-btn">
                          <img
                            className="metamask-logo modal-btn-logo"
                            src={Metamask}
                            alt="metamask-logo"
                          />{" "}
                          PURCHASE
                        </button>
                      </div>
                    </div>
                  </div>
                </Modal>
              </div>
              <div className="logo-author">
                {/* <img src={logoDigital} alt="southwest digital" /> */}
                <img src={logoAuthor} alt="logo-author" />
              </div>
            </div>
          </div>
        </div>
        <TokenLeft primaryColor={primaryColor} />
        <div className="special-offer">
          <div className="offer-desp">
            <div className="offer-title">
              <h3>
                <span className="text-gradient">Proud</span> to pay
              </h3>
            </div>

            <div className="text-offer">
              <p
                style={{
                  color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}`,
                }}
              >
                Nipsey invented Proud to Pay, a movement adopted and expanded by
                the NFT community. Your NFT is access and ownership in an
                eclusive community of like minded fans, artists, and industry
                veterans.
              </p>
              <p
                style={{
                  color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}`,
                }}
              >
                Now is your opportunity to own a unique piece of internet
                history. Mint today and receive unique streaming NFT artwork at
                launch.
              </p>
            </div>
            <div className="btn-buy-metamask">
              <button>
                <img
                  className="metamask-logo"
                  src={Metamask}
                  alt="metamask-logo"
                />{" "}
                Preorder with ETH
              </button>
            </div>
          </div>
          <div className="offer-fans">
            <div className="offer-1"></div>
            <div className="offer-2"></div>
            <div className="offer-3"></div>
          </div>
        </div>
        <ExclusiveNft
          Nft_1={Nft_1}
          Nft_2={Nft_2}
          Nft_3={Nft_3}
          Nft_4={Nft_4}
          NftImage={NftImage}
          amountTokens={1000}
        />
        <UnlockVideos
          primaryColor={primaryColor}
          UnlockableVideo={UnlockableVideo}
        />
        <JoinCom
          Metamask={Metamask}
          JoinCommunity={JoinCommunity}
          primaryColor={primaryColor}
        />
        <TeamMeet primaryColor={primaryColor} arraySplash={"nipsey"} />
      </div>
      <div className="home-splash-mobile">
        <div className="wrapper-splash-mobile">
          <div className="splash-header-mobile">
            <img src={DigitalMobile} alt="logo" />
          </div>
          <div className="splash-auth-mobile">
            <div className="auth-mobile-title">
              <h3>The <span>Nipsey Hussle</span> legacy</h3>
              <div className="auth-mobile-desc">
                1000 Unique NFTs unlock exlusive streaming<br /> for the final Nipsey Hussle album.
              </div>
            </div>
          </div>
          <div className="splash-minted-mobile">
            <div className="nft-minted-block">
              <div className="minted-title">
                <h3>Only <span>1000</span> NFTs will ever be minted</h3>

                <div className="minted-desc">
                  Nipsey invented Proud to Pay, a movement adopted and expanded by<br />
                  the NFT community. Your NFT is access and ownership in an eclusive<br />
                  community of like minded fans, artists, and industry veterans.
                </div>
                <div className="minted-btn">
                  <button>WELCOME TO THE NIPSEYVERSE</button>
                </div>
              </div>
            </div>
            <div className="streaming-nft-block">
              <div className="nft-box">
                <img src={NftMobile_1} alt="nft-logo" />
                <div className="nft-description">
                  <h4>Only  <span>1000</span> NFTs will ever be minted</h4>
                  <div className="nft-text">
                    Now is your opportunity to own a unique piece of<br />
                    internet history. Mint today and receive unique<br />
                    streaming NFT artwork at launch.
                  </div>
                  <div className="btn-claim">
                    <button>CLAIM ONE</button>
                  </div>
                </div>
              </div>
              <div className="nft-box">
                <img src={NftMobile_2} alt="nft-logo" />
                <div className="nft-description">
                  <h4>Only  <span>1000</span> NFTs will ever be minted</h4>
                  <div className="nft-text">
                    Now is your opportunity to own a unique piece of<br />
                    internet history. Mint today and receive unique<br />
                    streaming NFT artwork at launch.
                  </div>
                  <div className="btn-claim">
                    <button>CLAIM ONE</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="members-video-mobile">
              <div className="members-title-mobile">
                <h3>Members only <span>streaming</span></h3>
                <div className="members-desc">
                  Within 24 hours all 1000 were spoken for. With his next<br />
                  release Mailbox Money, Nipsey upped the ante to $1000<br />
                  for only 100 copies.
                </div>
              </div>
              <div className="video-pic">
                <img src={VideoPresent} alt="video-present-img" />
              </div>
              <div className="btn-learn-more">
                <button>Learn More</button>
              </div>
            </div>
            <div className="nft-score-mobile">
              <div className="box-score">
                <div className="score-num">1000</div>
                <div className="stats">Member Only  Nipseyverse</div>
              </div>
              <div className="box-score">
                <div className="score-num">1000</div>
                <div className="stats">Exclusive Streaming NFT</div>
              </div>
              <div className="box-score">
                <div className="score-num">1</div>
                <div className="stats">Exclusive Album </div>
              </div>
            </div>
            <div className="content-owners-mobile">
              <div className="owner-box">
                <div className="owner-img">
                  <img src={DigitalMobile} alt="digital" />
                </div>
                <div className="owner-title-mobile">
                  <h5>Southwest Digital</h5>
                </div>
                <div className="owner-desc">
                  For content owners, record labels, and distributors,
                  Southwest Digital offers a complete ecosystem for
                  the digital music cycle that optimizes your business
                  processes.
                </div>
                <div className="owner-btn-learn">
                  <button>Learn More</button>
                </div>
              </div>
              <div className="owner-box">
                <div className="owner-img">
                  <img src={RairTechMobile} alt="rair-tech-logo" />
                </div>
                <div className="owner-title-mobile">
                  <h5>RAIR Technologies</h5>
                </div>
                <div className="owner-desc">
                  RAIR, through its decentralized key management
                  node system, empowers anyone to create unique,
                  controllable, and transferable digital assets tied to
                  the actual underlying content.
                </div>
                <div className="owner-btn-learn">
                  <button>Learn More</button>
                </div>
              </div>
            </div>
            <div className="footer-nipsey-mobile">
              <img src={DigitalMobile} alt="digital" />
              <div className="nipsey-adress-mobile">
                Southwest Digital
              </div>
              <div className="nipsey-adress-mobile">
                Houston, Texax
              </div>
              <div className="social-media-nipsey">
                <div>
                  <i class="fab fa-instagram"></i>
                </div>
                <div>
                  <i class="fab fa-facebook-f"></i>
                </div>
                <div>
                  <i class="fab fa-twitter"></i>
                </div>
                <div>
                  <i class="fab fa-youtube"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;
