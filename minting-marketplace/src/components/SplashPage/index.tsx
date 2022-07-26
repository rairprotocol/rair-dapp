//@ts-nocheck
import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { erc721Abi } from '../../contracts/index';
import { rFetch } from '../../utils/rFetch';
import { metamaskCall } from '../../utils/metamaskUtils';
import Swal from 'sweetalert2';

import './SplashPage.css';

/* importing images*/
import Metamask from './images/metamask_logo.png';
import NipseyBg from './images/nipsey.png';
import logoAuthor from './images/colab.png';
import Nft_1 from './images/exclusive_1.jpeg';
import Nft_2 from './images/exclusive_2.jpeg';
import Nft_3 from './images/exclusive_3.jpeg';
import Nft_4 from './images/image_3.png';
import NftImage from './images/main-nft-screen.png';
import UnlockableVideo from './images/nipsey1.png';
// import JoinCommunity from "./images/join_com.jpeg";
import DigitalMobile from './images/digital-mobile.png';
import NftMobile_1 from './images/nft-mobile_1.png';
import NftMobile_2 from './images/nft-mobile_2.png';
import VideoPresent from './images/video-present.png';
import RairTechMobile from './images/rair_tech_mobile.png';
import DiscordIcon from './images/discord-icon.png';
import Bandana from './images/bandana.png';
import Pods from './images/Pods.png';
import Cepk from './images/cepk.png';
// import Cepp from './images/cepp.png';

/* importing Components*/
import TokenLeft from './TokenLeft/TokenLeft';
import ExclusiveNft from './ExclusiveNft/ExclusiveNft';
import UnlockVideos from './UnlockVideos/UnlockVideos';
import TeamMeet from './TeamMeet/TeamMeetList';
// import JoinCom from "./JoinCom/JoinCom";

import Modal from 'react-modal';
import RoadMap from './Roadmap/RoadMap';
import NipseyRelease from './NipseyRelease/NipseyRelease';
import { Countdown } from './Timer/CountDown';
import { useNavigate } from 'react-router-dom';
import { setRealChain } from '../../ducks/contracts/actions';
import axios from 'axios';
import { TProductResponseType } from '../../axios.responseTypes';

const customStyles = {
  overlay: {
    zIndex: '1'
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    fontFamily: 'Plus Jakarta Text',
    borderRadius: '16px'
  }
};

// Modal.setAppElement("#root");

const SplashPage = ({ setIsSplashPage }) => {
  const [dataNipsey, setDataNipsey] = useState();
  const [copies, setCopies] = useState();
  const [timerLeft, setTimerLeft] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const switchEthereumChain = async (chainData) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainData.chainId }]
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [chainData]
          });
        } catch (addError) {
          console.error(addError);
        }
      } else {
        console.error(switchError);
      }
    }
  };

  useEffect(() => {
    dispatch(setRealChain('0x1'));
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    setIsSplashPage(true);
  }, [setIsSplashPage]);

  // let params = `scrollbars=no,resizable=no,status=no,location=no,
  //               toolbar=no,menubar=no,width=700,height=800,left=100,top=100`;

  const { minterInstance, contractCreator } = useSelector(
    (store) => store.contractStore
  );

  const nipseyAddress = '0xCB0252EeD5056De450Df4D8D291B4c5E8Af1D9A6';

  const buyNipsey = async () => {
    const { /*success*/ products } = await rFetch(
      `/api/contracts/${nipseyAddress}/products/offers`
    );
    const instance = contractCreator(nipseyAddress, erc721Abi);
    const nextToken = await instance.getNextSequentialIndex(0, 50, 250);
    Swal.fire({
      title: 'Please wait...',
      html: `Buying token #${nextToken.toString()}`,
      icon: 'info',
      showConfirmButton: false
    });
    const [firstPressingOffer] = products[0].offers.filter(
      (item) => item.offerName === '1st Pressing'
    );
    if (!firstPressingOffer) {
      Swal.fire('Error', 'An error has ocurred', 'error');
      return;
    }
    if (
      await metamaskCall(
        minterInstance.buyToken(
          products[0].offerPool.marketplaceCatalogIndex,
          firstPressingOffer.offerIndex,
          nextToken,
          {
            value: firstPressingOffer.price
          }
        ),
        'Sorry your transaction failed! When several people try to buy at once - only one transaction can get to the blockchain first. Please try again!'
      )
    ) {
      Swal.fire('Success', `Bought token #${nextToken}!`, 'success');
    }
  };

  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState({ policy: false, use: false });

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  function afterOpenModal() {
    subtitle.style.color = '#9013FE';
  }

  function closeModal() {
    setIsOpen(false);
    setActive((prev) => ({
      ...prev,
      policy: false,
      use: false
    }));
  }
  // console.log(Object.values(active).every(el => el));

  const { primaryColor } = useSelector((store) => store.colorStore);

  const getAllProduct = useCallback(async () => {
    const responseAllProduct = await axios.get<TProductResponseType>(
      '/api/nft/network/0x5/0xcb0252eed5056de450df4d8d291b4c5e8af1d9a6/0/offers'
    );
    const { product } = responseAllProduct.data;

    if (product && product.copies && product.soldCopies) {
      setCopies(product.copies);
      setDataNipsey(product.soldCopies);
    } else {
      setCopies(0);
      setDataNipsey(0);
    }
  }, [setDataNipsey]);

  useEffect(() => {
    getAllProduct();
  }, [getAllProduct]);

  return (
    <div className="wrapper-splash-page">
      <div className="home-splash--page">
        <div className="information-author">
          <div className="block-splash">
            <img
              className="block-img-mobile"
              src={NipseyBg}
              alt="nipsey-hussle"
            />
            <div className="text-splash">
              <div className="title-splash nipsey">
                <h3>Enter the</h3>
                <span>Nipseyverse</span>
              </div>
              <div className="text-description">
                <div>
                  1000 unique NFTs unlock exclusive streaming for the final
                  Nipsey Hussle album. Proceeds directly benefit the Airmiess
                  Asghedom estate{' '}
                  <a
                    href="https://etherscan.io/Oxcontract"
                    target="_blank"
                    rel="noreferrer">
                    onchain
                  </a>
                  .
                </div>
              </div>
              <div className="btn-timer-nipsey">
                {timerLeft === 0 ? (
                  <button onClick={openModal}>
                    <img
                      className="metamask-logo"
                      src={Metamask}
                      alt="metamask-logo"
                    />
                    Preorderwith ETH
                  </button>
                ) : (
                  <Countdown
                    setTimerLeft={setTimerLeft}
                    timerLeft={timerLeft}
                    time={'2022-01-06T19:00:00-08:00'}
                  />
                )}
                <Modal
                  isOpen={modalIsOpen}
                  onAfterOpen={afterOpenModal}
                  onRequestClose={closeModal}
                  style={customStyles}
                  contentLabel="Example Modal">
                  <h2
                    style={{
                      fontSize: '60px',
                      fontWeight: 'bold',
                      paddingTop: '3rem',
                      cursor: 'default'
                    }}
                    ref={(_subtitle) => (subtitle = _subtitle)}>
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
                                policy: !prev.policy
                              }))
                            }
                            htmlFor="policy">
                            I agree to the{' '}
                          </label>
                          <span
                            onClick={() => window.open('/privacy', '_blank')}
                            style={{
                              color: '#9013FE',
                              fontSize: '24px',
                              paddingRight: '1rem',
                              marginLeft: '-2.5rem'
                            }}>
                            Privacy Policy
                          </span>
                        </div>
                        <div className="form-group sec-group ">
                          <input type="checkbox" className="dgdfgd" id="use" />
                          <label
                            onClick={() =>
                              setActive((prev) => ({ ...prev, use: !prev.use }))
                            }
                            htmlFor="use">
                            I accept the{' '}
                          </label>
                          <span
                            onClick={() => window.open('/terms-use', '_blank')}
                            style={{
                              color: '#9013FE',
                              fontSize: '24px',
                              paddingRight: '2.3rem',
                              marginLeft: '-2.5rem'
                            }}>
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
                        <button
                          onClick={
                            window?.ethereum?.chainId === '0x5'
                              ? buyNipsey
                              : () =>
                                  switchEthereumChain({
                                    chainId: '0x5',
                                    chainName: 'Goerli (Ethereum)'
                                  })
                          }
                          disabled={!Object.values(active).every((el) => el)}
                          className="modal-btn">
                          <img
                            className="metamask-logo modal-btn-logo"
                            src={Metamask}
                            alt="metamask-logo"
                          />{' '}
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
        <TokenLeft
          soldCopies={dataNipsey}
          copies={copies}
          primaryColor={primaryColor}
          DiscordIcon={DiscordIcon}
        />
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
                  color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
                }}>
                Nipsey invented Proud to Pay, a movement adopted and expanded by
                the NFT community. Your NFT is access and ownership in an
                eclusive community of like minded fans, artists, and industry
                veterans.
              </p>
              <p
                style={{
                  color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
                }}>
                Now is your opportunity to own a unique piece of internet
                history. Mint today and receive unique streaming NFT artwork at
                launch.
              </p>
            </div>

            <Countdown />
            {/* <button onClick={() => navigate('/coming-soon')}>
                <img
                  className="metamask-logo"
                  src={Metamask}
                  alt="metamask-logo"
                />{" "}
                COMING SOON
              </button> */}
          </div>
          <div className="offer-fans">
            <div className="offer-fans-container">
              <div className="offer-1"></div>
              <div className="offer-2"></div>
              <div className="offer-3"></div>
            </div>
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
          amountTokens={Number(copies) - Number(dataNipsey)}
          linkComing={'/coming-soon'}
        />
        <NipseyRelease DiscordIcon={DiscordIcon} />
        <RoadMap />
        {/* <JoinCom
          Metamask={Metamask}
          JoinCommunity={JoinCommunity}
          primaryColor={primaryColor}
        /> */}
        <TeamMeet primaryColor={primaryColor} arraySplash={'nipsey'} />
        <div className="nipsey-img-masks">
          <img src={Bandana} alt="" />
          <img src={Pods} alt="" />
          <img src={Cepk} alt="" />
          <img src={Bandana} alt="" />
        </div>
      </div>
      <div className="home-splash-mobile">
        <div
          className="wrapper-splash-mobile"
          style={{
            background: `${primaryColor === 'rhyno' ? '#dedede' : '#181717'}`
          }}>
          <div className="splash-header-mobile">
            <img src={DigitalMobile} alt="logo" />
          </div>
          <div className="splash-auth-mobile">
            <div className="auth-mobile-title">
              <h3
                style={{
                  color: `${primaryColor === 'rhyno' ? '#fff' : '#fff'}`
                }}>
                The <span>Nipsey Hussle</span> legacy
              </h3>
              <div className="auth-mobile-desc">
                1000 Unique NFTs unlock exlusive streaming
                <br /> for the final Nipsey Hussle album.
              </div>
            </div>
          </div>
          <div className="splash-minted-mobile">
            <div className="nft-minted-block">
              <Countdown />
              <div className="minted-title">
                <h3>
                  Only <span>1000</span> NFTs will ever be minted
                </h3>

                <div
                  className="minted-desc"
                  style={{
                    color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
                  }}>
                  Nipsey invented Proud to Pay, a movement adopted and expanded
                  by
                  <br />
                  the NFT community. Your NFT is access and ownership in an
                  eclusive
                  <br />
                  community of like minded fans, artists, and industry veterans.
                </div>
                <div className="minted-btn">
                  <button onClick={() => navigate('/coming-soon')}>
                    WELCOME TO THE NIPSEYVERSE
                  </button>
                </div>
              </div>
            </div>
            <div className="streaming-nft-block">
              <div className="nft-box">
                <img src={NftMobile_1} alt="nft-logo" />
                <div className="nft-description">
                  <h4>
                    Only{' '}
                    <span
                      style={{
                        color: `${
                          primaryColor === 'rhyno' ? '#5D5FEF' : '#A5A6F6'
                        }`
                      }}>
                      1000
                    </span>{' '}
                    NFTs will ever be minted
                  </h4>
                  <div
                    className="nft-text"
                    style={{
                      color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
                    }}>
                    Now is your opportunity to own a unique piece of
                    <br />
                    internet history. Mint today and receive unique
                    <br />
                    streaming NFT artwork at launch.
                  </div>
                  <div className="btn-claim">
                    <button
                      onClick={() => navigate('/coming-soon')}
                      style={{
                        color: `${
                          primaryColor === 'rhyno' ? '#5D5FEF' : '#A5A6F6'
                        }`
                      }}>
                      CLAIM ONE
                    </button>
                  </div>
                </div>
              </div>
              <div className="nft-box">
                <img src={NftMobile_2} alt="nft-logo" />
                <div className="nft-description">
                  <h4>
                    Only{' '}
                    <span
                      style={{
                        color: `${
                          primaryColor === 'rhyno' ? '#5D5FEF' : '#A5A6F6'
                        }`
                      }}>
                      1000
                    </span>{' '}
                    NFTs will ever be minted
                  </h4>
                  <div
                    className="nft-text"
                    style={{
                      color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
                    }}>
                    Now is your opportunity to own a unique piece of
                    <br />
                    internet history. Mint today and receive unique
                    <br />
                    streaming NFT artwork at launch.
                  </div>
                  <div className="btn-claim">
                    <button
                      onClick={() => navigate('/coming-soon')}
                      style={{
                        color: `${
                          primaryColor === 'rhyno' ? '#5D5FEF' : '#A5A6F6'
                        }`
                      }}>
                      CLAIM ONE
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="members-video-mobile"
              style={{
                color: `${primaryColor === 'rhyno' ? '#383637' : '#000'}`
              }}>
              <div className="members-title-mobile">
                <h3>
                  Members only <span>streaming</span>
                </h3>
                <div
                  className="members-desc"
                  style={{
                    color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
                  }}>
                  Within 24 hours all 1000 were spoken for. With his next
                  <br />
                  release Mailbox Money, Nipsey upped the ante to $1000
                  <br />
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
            <div
              className="nft-score-mobile"
              style={{
                background: `${
                  primaryColor === 'rhyno' ? '#383637' : '#060606'
                }`
              }}>
              <div className="box-score">
                <div className="score-num">1000</div>
                <div
                  className="stats"
                  style={{
                    color: `${primaryColor === 'rhyno' ? '#5D5FEF' : '#A5A6F6'}`
                  }}>
                  Member Only Nipseyverse
                </div>
              </div>
              <div className="box-score">
                <div className="score-num">1000</div>
                <div
                  className="stats"
                  style={{
                    color: `${primaryColor === 'rhyno' ? '#5D5FEF' : '#A5A6F6'}`
                  }}>
                  Exclusive Streaming NFT
                </div>
              </div>
              <div className="box-score">
                <div className="score-num">1</div>
                <div
                  className="stats"
                  style={{
                    color: `${primaryColor === 'rhyno' ? '#5D5FEF' : '#A5A6F6'}`
                  }}>
                  Exclusive Album{' '}
                </div>
              </div>
            </div>
            <NipseyRelease DiscordIcon={DiscordIcon} />
            <TeamMeet primaryColor={primaryColor} arraySplash={'nipsey'} />
            <div className="content-owners-mobile">
              <div className="owner-box">
                <div className="owner-img">
                  <img src={DigitalMobile} alt="digital" />
                </div>
                <div className="owner-title-mobile">
                  <h5>Southwest Digital</h5>
                </div>
                <div className="owner-desc">
                  For content owners, record labels, and distributors, Southwest
                  Digital offers a complete ecosystem for the digital music
                  cycle that optimizes your business processes.
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
                  RAIR, through its decentralized key management node system,
                  empowers anyone to create unique, controllable, and
                  transferable digital assets tied to underlying content.
                </div>
                <div className="owner-btn-learn">
                  <button>Learn More</button>
                </div>
              </div>
            </div>
            <div className="footer-nipsey-mobile">
              <img src={DigitalMobile} alt="digital" />
              <div className="nipsey-adress-mobile">Southwest Digital</div>
              <div className="nipsey-adress-mobile">Houston, Texas</div>
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
