import React, { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
// import { useHistory } from "react-router-dom";

import "./SplashPage.css";
import "./GreymanSplashPageMobile.css";
import "./../AboutPage/AboutPageNew/AboutPageNew.css";
import Modal from "react-modal";

/* importing images*/
import Metamask from "../../images/metamask-fox.svg";
import DocumentIcon from "../../images/documentIcon.svg"
import GreyMan from "./images/greyman1.png";
import GreyManNotFun from "./images/not-fun.png";

/* importing Components*/
import TeamMeet from "./TeamMeet/TeamMeetList";
import AuthorBlock from "./AuthorBlock/AuthorBlock";

import { diamondFactoryAbi } from "../../contracts/index.js";
//import { rFetch } from "../../utils/rFetch.js";
import { metamaskCall } from "../../utils/metamaskUtils.js";
import { web3Switch } from "../../utils/switchBlockchain.js";
import Swal from "sweetalert2";
import NotCommercial from "./NotCommercial/NotCommercial";
import setTitle from '../../utils/setTitle';

//Google Analytics
import ReactGA from 'react-ga';

// Google Analytics
const TRACKING_ID = 'UA-209450870-5'; // YOUR_OWN_TRACKING_ID
ReactGA.initialize(TRACKING_ID);

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

const SplashPage = ({ loginDone }) => {
  const [active, setActive] = useState({ policy: false, use: false });
  const GraymanSplashPageTESTNET = "0xbA947797AA2f1De2cD101d97B1aE6b04182fF3e6";
  const GreymanChainId = '0x89';
  const offerIndexInMarketplace = 2;
  const { primaryColor } = useSelector((store) => store.colorStore);
  const [modalIsOpen, setIsOpen] = useState(false);
  //   const history = useHistory();
  const {
    diamondMarketplaceInstance,
    contractCreator,
    currentUserAddress,
  } = useSelector((store) => store.contractStore);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);



  function afterOpenModal() {
    subtitle.style.color = "#9013FE";
  }

  function closeModal() {
    setIsOpen(false);
    setActive((prev) => ({
      ...prev,
      policy: false,
      use: false,
    }));
  }

  const buyGrayman = async () => {
    if (window.ethereum.chainId !== GreymanChainId) {
      web3Switch(GreymanChainId);
      return;
    }
    if (!diamondMarketplaceInstance) {
      Swal.fire({
        title: "An error has ocurred",
        html: `Please try again later`,
        icon: "info",
      });
      return;
    }
    let greymanOffer = await metamaskCall(diamondMarketplaceInstance.getOfferInfo(offerIndexInMarketplace));
    if (greymanOffer) {
      let instance = contractCreator(GraymanSplashPageTESTNET, diamondFactoryAbi);
      let nextToken = await metamaskCall(instance.getNextSequentialIndex(
        greymanOffer.productIndex,
        greymanOffer.rangeData.rangeStart,
        greymanOffer.rangeData.rangeEnd
      ));
      Swal.fire({
        title: "Please wait...",
        html: `Buying Greyman #${nextToken.toString()}`,
        icon: "info",
        showConfirmButton: false,
      });
      if (await metamaskCall(
        diamondMarketplaceInstance.buyMintingOffer(
          offerIndexInMarketplace,
          nextToken,
          {
            value: greymanOffer.rangeData.rangePrice,
          }
        ),
        "Sorry your transaction failed! When several people try to buy at once - only one transaction can get to the blockchain first. Please try again!"
      )) {
        Swal.fire({
          // title : "Success", 
          imageUrl: GreyMan,
          imageHeight: "auto",
          imageWidth: "65%",
          imageAlt: 'GreyMan image',
          title: `You own #${nextToken}!`,
          icon: "success"
        });
      }
    }
  };

  let subtitle;

  useEffect(() => {
    setTitle(`#ImmersiVerse ATX`);
  }, [])

  return (
    <div className="wrapper-splash-page greyman-page">
      <div className="home-splash--page">
        <AuthorBlock mainClass="immersiverse-page-author">
          <div className="block-splash">
            <div className="text-splash">
              <div className="title-splash greyman-page">
                <h3
                  style={{
                    fontSize: "56px",
                    paddingBottom: "17px",
                    marginTop: "7rem",
                  }}
                  className="text-gradient-blue"
                >
                  #ImmersiVerse ATX
                </h3>
              </div>
              <div className="text-description" style={{ color: "#A7A6A6" }}>
                Connect your wallet to receive a free airdrop. Unlock exclusive encrypted streams on drop date
              </div>
              <div className="btn-claim-airdrop">
                <button onClick={() => openModal()}>
                  <img
                    className="metamask-logo"
                    src={Metamask}
                    alt="metamask-logo"
                  />{" "}
                  Claim Airdrop
                </button>
              </div>
              <div className="btn-submit-with-form">

                <button onClick={() => openModal()}>
                  <img
                    className="metamask-logo"
                    src={DocumentIcon}
                    alt="form-logo"
                  />{" "}
                  Submit with Form
                </button>
              </div>
              <div className="btn-timer-nipsey">
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
                          <label
                            onClick={() =>
                              setActive((prev) => ({
                                ...prev,
                                policy: !prev.policy,
                              }))
                            }
                            htmlFor="policy"
                          >
                            I agree to the{" "}
                          </label>
                          <span
                            onClick={() => window.open("/privacy", "_blank")}
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
                          <label
                            onClick={() =>
                              setActive((prev) => ({ ...prev, use: !prev.use }))
                            }
                            htmlFor="use"
                          >
                            I accept the{" "}
                          </label>
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
                        <span style={{ width: '287px' }} className="modal-text">
                          By accepting these terms, I agree <strong style={{ color: "rgb(136 132 132)", fontWeight: 'bolder' }}>not</strong> to have any fun with this greyman
                        </span>
                        <img src={GreyManNotFun} alt="not-fun" />

                      </div>
                      <div className="modal-btn-wrapper">
                        <button
                          onClick={buyGrayman}
                          disabled={
                            currentUserAddress === undefined ||
                            !Object.values(active).every((el) => el)
                          }
                          className="modal-btn"
                        >
                          <img
                            style={{ width: "100px", marginLeft: "-1rem" }}
                            className="metamask-logo modal-btn-logo"
                            src={Metamask}
                            alt="metamask-logo"
                          />{" "}
                          {window.ethereum?.chainId !== GreymanChainId
                            ? "Switch network"
                            : currentUserAddress
                              ? "PURCHASE"
                              : "Connect your wallet!"}
                        </button>
                      </div>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
        </AuthorBlock>
          <>
            <div className="video-grey-man-wrapper">
            </div>
            <div className="greyman-timeline-wrapper">
            </div>
            <TeamMeet primaryColor={primaryColor} arraySplash={"greyman"} />
            <NotCommercial primaryColor={primaryColor} />
          </>
      </div>
    </div>
  );
};

export default SplashPage;
