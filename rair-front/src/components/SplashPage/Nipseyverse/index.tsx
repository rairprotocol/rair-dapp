import React, { useCallback, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  faFacebookF,
  faInstagram,
  faTwitter,
  faYoutube
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

import { teamNipseyverseArray } from './AboutUsTeam';

import { TProductResponseType } from '../../../axios.responseTypes';
import { erc721Abi } from '../../../contracts/index';
import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
import { setRealChain } from '../../../ducks/contracts/actions';
import { ContractsInitialType } from '../../../ducks/contracts/contracts.types';
import { setInfoSEO } from '../../../ducks/seo/actions';
import { InitialState } from '../../../ducks/seo/reducers';
import { TInfoSeo } from '../../../ducks/seo/seo.types';
import useSwal from '../../../hooks/useSwal';
import useWeb3Tx from '../../../hooks/useWeb3Tx';
/* importing images*/
import { discrodIconNoBorder, metaMaskIcon } from '../../../images';
import { rFetch } from '../../../utils/rFetch';
import MetaTags from '../../SeoTags/MetaTags';
import ExclusiveNft from '../ExclusiveNft/ExclusiveNft';
import { LogoAuthor } from '../images/commingSoon/commingSoonImages';
import {
  Bandana,
  Cepk,
  DigitalMobile,
  Nft_1,
  Nft_2,
  Nft_3,
  Nft_4,
  NftImage,
  NftMobile_1,
  NftMobile_2,
  NipseyBg,
  Pods,
  UnlockableVideo,
  VideoPresent
} from '../images/splashPageImages/splashPage';
import NipseyRelease from '../NipseyRelease/NipseyRelease';
import RoadMap from '../Roadmap/RoadMap';
import { ISplashPageProps, TSplashPageIsActive } from '../splashPage.types';
import TeamMeet from '../TeamMeet/TeamMeetList';
import { Countdown } from '../Timer/CountDown';
/* importing Components*/
import TokenLeft from '../TokenLeft/TokenLeft';
import UnlockVideos from '../UnlockVideos/UnlockVideos';

import './../SplashPage.css';

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

const SplashPage: React.FC<ISplashPageProps> = ({ setIsSplashPage }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dataNipsey, setDataNipsey] = useState<number>();
  const [copies, setCopies] = useState<number>();
  const [timerLeft, setTimerLeft] = useState<number>();
  const seo = useSelector<RootState, TInfoSeo>((store) => store.seoStore);
  useEffect(() => {
    dispatch(setInfoSEO(InitialState));
    //eslint-disable-next-line
  }, []);

  const reactSwal = useSwal();
  const { web3TxHandler, correctBlockchain, web3Switch } = useWeb3Tx();

  useEffect(() => {
    dispatch(setRealChain('0x1'));
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    setIsSplashPage?.(true);
  }, [setIsSplashPage]);

  // let params = `scrollbars=no,resizable=no,status=no,location=no,
  //               toolbar=no,menubar=no,width=700,height=800,left=100,top=100`;

  const { minterInstance, contractCreator } = useSelector<
    RootState,
    ContractsInitialType
  >((store) => store.contractStore);

  const targetBlockchain = '0x5';
  const nipseyAddress = '0xCB0252EeD5056De450Df4D8D291B4c5E8Af1D9A6';

  const buyNipsey = async () => {
    const { /*success*/ products } = await rFetch(
      `/api/contracts/${nipseyAddress}/products/offers`
    );
    const instance = contractCreator?.(nipseyAddress, erc721Abi);
    const nextToken = await instance?.getNextSequentialIndex(0, 50, 250);
    reactSwal.fire({
      title: 'Please wait...',
      html: `Buying token #${nextToken.toString()}`,
      icon: 'info',
      showConfirmButton: false
    });
    const [firstPressingOffer] = products[0].offers.filter(
      (item) => item.offerName === '1st Pressing'
    );
    if (!firstPressingOffer || !minterInstance) {
      reactSwal.fire('Error', 'An error has ocurred', 'error');
      return;
    }
    if (
      await web3TxHandler(
        minterInstance,
        'buyToken',
        [
          products[0].offerPool.marketplaceCatalogIndex,
          firstPressingOffer.offerIndex,
          nextToken,
          {
            value: firstPressingOffer.price
          }
        ],
        {
          intendedBlockchain: targetBlockchain,
          failureMessage:
            'Sorry your transaction failed! When several people try to buy at once - only one transaction can get to the blockchain first. Please try again!'
        }
      )
    ) {
      reactSwal.fire('Success', `Bought token #${nextToken}!`, 'success');
    }
  };

  let subtitle: Modal;
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const [active, setActive] = useState<TSplashPageIsActive>({
    policy: false,
    use: false
  });

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

  const { primaryColor, headerLogoMobile } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);

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
      <MetaTags seoMetaTags={seo} />
      <div className="home-splash--page">
        <div className="information-author">
          <div className="block-splash">
            <img
              className="block-img-mobile"
              src={NipseyBg}
              alt="Nipseyverse"
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
                      src={metaMaskIcon}
                      alt="metamask-logo"
                    />
                    Preorderwith ETH
                  </button>
                ) : (
                  <Countdown
                    setTimerLeft={setTimerLeft}
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
                            correctBlockchain(targetBlockchain)
                              ? buyNipsey
                              : () => web3Switch(targetBlockchain)
                          }
                          disabled={!Object.values(active).every((el) => el)}
                          className="modal-btn">
                          <img
                            className="metamask-logo modal-btn-logo"
                            src={metaMaskIcon}
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
                <img src={LogoAuthor} alt="Custom logo by Rair Tech" />
              </div>
            </div>
          </div>
        </div>
        <TokenLeft
          soldCopies={dataNipsey}
          copies={copies}
          primaryColor={primaryColor}
          DiscordIcon={discrodIconNoBorder}
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
          unlockableVideo={UnlockableVideo}
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
        <NipseyRelease DiscordIcon={discrodIconNoBorder} />
        <RoadMap />
        {/* <JoinCom
          Metamask={Metamask}
          JoinCommunity={JoinCommunity}
          primaryColor={primaryColor}
        /> */}
        <TeamMeet
          arraySplash={'nipsey'}
          titleHeadFirst={'Meet the'}
          titleHeadSecond={'Team'}
          classNameHeadSpan={'text-gradient'}
          teamArray={teamNipseyverseArray}
          classNameGap={true}
        />
        <div className="nipsey-img-masks">
          <img src={Bandana} alt="Bandana" />
          <img src={Pods} alt="headphones" />
          <img src={Cepk} alt="White Cap" />
          <img src={Bandana} alt="Bandana" />
        </div>
      </div>
      <div className="home-splash-mobile">
        <div
          className="wrapper-splash-mobile"
          style={{
            background: `${primaryColor === 'rhyno' ? '#dedede' : '#181717'}`
          }}>
          <div className="splash-header-mobile">
            <img src={DigitalMobile} alt="Digital photo" />
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
                <img src={NftMobile_1} alt="Exclusive Nipseyverse NFT" />
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
                <img src={NftMobile_2} alt="Exclusive Nipseyverse NFT" />
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
            <NipseyRelease DiscordIcon={discrodIconNoBorder} />
            <TeamMeet
              arraySplash={'nipsey'}
              titleHeadFirst={'Meet the'}
              titleHeadSecond={'Team'}
              classNameHeadSpan={'text-gradient'}
              teamArray={teamNipseyverseArray}
            />
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
                  <img src={headerLogoMobile} alt="Rair Tech" />
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
                  <FontAwesomeIcon icon={faInstagram} />
                </div>
                <div>
                  <FontAwesomeIcon icon={faFacebookF} />
                </div>
                <div>
                  <FontAwesomeIcon icon={faTwitter} />
                </div>
                <div>
                  <FontAwesomeIcon icon={faYoutube} />
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
