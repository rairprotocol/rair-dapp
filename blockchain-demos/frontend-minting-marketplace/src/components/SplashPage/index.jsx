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
import NftImage from "./images/main-nft-screen.png";
import UnlockableVideo from "./images/nipsey1.png";
import JoinCommunity from "./images/join_com.jpeg";
import DigitalMobile from './images/digital-mobile.png';
import NftMobile_1 from './images/nft-mobile_1.png';
import NftMobile_2 from './images/nft-mobile_2.png';
import VideoPresent from './images/video-present.png';
import RairTechMobile from './images/rair_tech_mobile.png';
import DiscordIcon from './images/discord-icon.png';

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
  const [active, setActive] = useState({ policy: false, use: false });

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
              <div className="title-splash nipsey">
                <h3>Enter the</h3>
                <span>Nipseyverse</span>
              </div>
              <div className="text-description">
                <div>
                  1000 unique NFTs unlock exclusive streaming for the
                  final Nipsey Hussle album.
                  Proceeds directly benefit the Airmiess
                  Asghedom estate <a href="https://etherscan.io/error.html?404" target="_blank">onchain</a>.
                </div>
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
                          <label onClick={() => setActive(prev => ({ ...prev, policy: !prev.policy }))} htmlFor="policy">I agree to the </label>
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
                          <label onClick={() => setActive(prev => ({ ...prev, use: !prev.use }))} htmlFor="use">I accept the </label>
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
        <TokenLeft primaryColor={primaryColor} DiscordIcon={DiscordIcon} />
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
        <UnlockVideos
          primaryColor={primaryColor}
          UnlockableVideo={UnlockableVideo}
        />
        <ExclusiveNft
          Nft_1={Nft_1}
          Nft_2={Nft_2}
          Nft_3={Nft_3}
          Nft_4={Nft_4}
          NftImage={NftImage}
          amountTokens={1000}
        />
        <div className="nipsey-release">
          <div className="release-container">
            <div className="tabs-box">
              <div className="tab-title-box">
                Founders Tier
              </div>
              <div className="tab-text-box">
                <p>:0-49</p>
                <p>Airdrops</p>
              </div>
            </div>
            <div className="tabs-box">
              <div className="tab-title-box">
                Pressing 1
              </div>
              <div className="tab-text-box">
                <p>:49-250</p>
                <p>1 ETH</p>
              </div>
            </div>
            <div className="tabs-box">
              <div className="tab-title-box">
                Pressing 2
              </div>
              <div className="tab-text-box">
                <p>:49-250</p>
                <p>2 ETH</p>
              </div>
            </div>
            <div className="tabs-box">
              <div className="tab-title-box">
                Pressing 3
              </div>
              <div className="tab-text-box">
                <p>:501-999</p>
                <p>3 ETH</p>
              </div>
            </div>
          </div>
          <div className="release-container">
            <div className="release-container-title">Release</div>
            <div className="release-desc-nipsey">
              <div className="release-desc-nipsey-box">
                All royalties are onchain, with resales royalties set at 20%.
                All 1000 NFTs will receive equal access to the exclusive final Nipsey album.
                Rarities are distributed at random. Unique attributes are hand-painted & uniquely generated.
              </div>
              <div className="release-desc-nipsey-box">
                Founders tiers is reserved for Nipsey collaborators and production team.
                Fair use initial distribution. All pricing is pre-programmed into the smart contract.
                Hold your NFT to receive exclusive future drops.
              </div>
            </div>
            <div className="release-artwork-desc">
              <div className="release-artwork-desc-title">
                Want to see the tracklist & artwork before anyone else?
              </div>
              <div className="release-artwork-desc-text">
                Sign up for our newsletter, then join our private Discord
                group for first access to NFT drops, events, and merchandise
                before anyone else.
              </div>
            </div>
            <div className="release-join-discord">
              <div className="input-box-email">
                <div className="mailchimp">
                  <form action="https://tech.us16.list-manage.com/subscribe/post?u=4740c76c171ce33ffa0edd3e6&amp;id=1f95f6ad8c" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
                    <div className="signup_scroll">
                      <div className="email-box">
                        <input
                          // onChange={onChangeEmail}
                          // value={emailField}
                          type="email" name="EMAIL"
                          className="email"
                          id="mce-EMAIL"
                          placeholder="Sign up for our newsletter.."
                          required />
                        <button required type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe"><i class="fas fa-chevron-right"></i></button>
                      </div>
                      <div style={{
                        position: "absolute", left: "-5000px"
                      }} aria-hidden="true">
                        <input type="text" name="b_4740c76c171ce33ffa0edd3e6_1f95f6ad8c" tabIndex="-1" />
                      </div>
                      <div className="btn-subscribe">
                        {/* <input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" className="button" required /> */}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="btn-discord">
                <a href="https://discord.gg/NFeGnPkbfd" target="_blank"><img src={DiscordIcon} alt="discord icon" /> Join our Discord</a>
              </div>
            </div>
          </div>
        </div>
        <div className="nipsey-roadmap">
          <div className="nipsey-roadmap-title">Roadmap</div>
          <div className="roadmap-container">
            <div className="roadmap-box">
              <div className="roadmap-box-desc">
                Own an original ETH main net NFT on snapshot date & receive the following drops:
              </div>
            </div>
            <div className="roadmap-box">
              <div className="roadmap-list">
                <p>Official MATIC drop</p>
                <p>Official Binance Smart Chain drop</p>
              </div>
              <div className="roadmap-list">
                <p>
                  Official Avalanche drop
                </p>
                <p>
                  Official Klatyn drop
                </p>
                <p>
                  Official Skale drop
                </p>
              </div>
              <div className="roadmap-list">
                <p>Priority access for future</p>
                <p>drops and releases</p>
              </div>
            </div>
            <div className="roadmap-box">
              <div className="roadmap-progress">
                <div className="progress-line-pink"></div>
                <div className="progress-line-grey"></div>
                <div className="roadmap-progress-circle">Q1</div>
                <div className="roadmap-progress-circle">Q2</div>
                <div className="roadmap-progress-circle">Q3</div>
              </div>
              <div className="roadmap-progress-text">
                <div className="progress-li">
                  Album release
                </div>
                <div className="progress-li">
                  Fresh tracks
                </div>
                <div className="progress-li">
                  Feature documentary
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*<JoinCom
          Metamask={Metamask}
          JoinCommunity={JoinCommunity}
          primaryColor={primaryColor}
        /> */}
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
                Houston, Texas
              </div>
              <div className="social-media-nipsey">
                <div>
                  <i className="fab fa-instagram"></i>
                </div>
                <div>
                  <i className="fab fa-facebook-f"></i>
                </div>
                <div>
                  <i className="fab fa-twitter"></i>
                </div>
                <div>
                  <i className="fab fa-youtube"></i>
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
