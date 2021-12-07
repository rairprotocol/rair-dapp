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

// Modal.setAppElement("#root");

const SplashPage = () => {
  let params = `scrollbars=no,resizable=no,status=no,location=no,
                toolbar=no,menubar=no,width=700,height=800,left=100,top=100`;

  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState({ policy: false, use: false});

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  function afterOpenModal() {
    subtitle.style.color = "#9013FE";
  }

  function closeModal() {
    setIsOpen(false);
  }
  console.log(Object.values(active).every(el => el));

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
                      cursor: "default",
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
                          <label onClick={() => setActive(prev => ({...prev , policy: !prev.policy}))} htmlFor="policy">I agree to the </label>
                          <span
                            onClick={() =>
                              window.open("/privacy", "_blank")
                            }
                            style={{
                              color: "#9013FE",
                              fontSize: "24px",
                              paddingRight: "1rem",
                              marginLeft: "-2.5rem",
                            }}
                          >
                            Privacy Policy
                          </span>
                        </div>
                        <div className="form-group sec-group ">
                          <input type="checkbox" className="dgdfgd" id="use" />
                          <label onClick={() => setActive(prev => ({...prev , use:!prev.use}))} htmlFor="use">I accept the </label>
                          <span
                            onClick={() => window.open("/terms-use", "_blank")}
                            style={{
                              color: "#9013FE",
                              fontSize: "24px",
                              paddingRight: "2.3rem",
                              marginLeft: "-2.5rem",
                            }}
                          >
                            Terms of Use
                          </span>
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
                        <button disabled={!Object.values(active).every(el => el)} className="modal-btn">
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
    </div>
  );
};

export default SplashPage;
