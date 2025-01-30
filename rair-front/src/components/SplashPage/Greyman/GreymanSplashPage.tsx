import { FC, useCallback, useEffect, useState } from 'react';
//Google Analytics
import ReactGA from 'react-ga';
import Modal from 'react-modal';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { teamGreymanArray } from './AboutUsTeam';

import { diamondFactoryAbi } from '../../../contracts/index';
import useConnectUser from '../../../hooks/useConnectUser';
import useContracts from '../../../hooks/useContracts';
import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxHooks';
import useSwal from '../../../hooks/useSwal';
import useWeb3Tx from '../../../hooks/useWeb3Tx';
/* importing images*/
import { metaMaskIcon } from '../../../images';
import { setSEOInfo } from '../../../redux/seoSlice';
import { setRequestedChain } from '../../../redux/web3Slice';
import { CustomModalStyle, SplashPageProps } from '../../../types/commonTypes';
import MobileCarouselNfts from '../../AboutPage/AboutPageNew/ExclusiveNfts/MobileCarouselNfts';
import PurchaseTokenButton from '../../common/PurchaseToken';
import { ImageLazy } from '../../MockUpPage/ImageLazy/ImageLazy';
import MetaTags from '../../SeoTags/MetaTags';
import StandaloneVideoPlayer from '../../video/videoPlayerGenerall';
import AuthorBlock from '../AuthorBlock/AuthorBlock';
import {
  GreyMan,
  GreyManNotFun,
  playImagesColored
} from '../images/greyMan/grayMan';
import NotCommercial from '../NotCommercial/NotCommercial';
import ButtonHelp from '../PurchaseChecklist/ButtonHelp';
import PurchaseChecklist from '../PurchaseChecklist/PurchaseChecklist';
import { TSplashPageIsActive } from '../splashPage.types';
/* importing Components*/
import TeamMeet from '../TeamMeet/TeamMeetList';
import { Timeline } from '../Timeline/Timeline';
import { Countdown } from '../Timer/CountDown';
import TokenLeftGreyman from '../TokenLeft/TokenLeftGreyman';

import GreymanFavicon from './../images/favicons/greyman-favicon.ico';

import './../SplashPage.css';
import './GreymanSplashPageMobile.css';
import './../../AboutPage/AboutPageNew/AboutPageNew.css';

// Google Analytics
const TRACKING_ID = 'UA-209450870-5'; // YOUR_OWN_TRACKING_ID
ReactGA.initialize(TRACKING_ID);

const customStyles: CustomModalStyle = {
  overlay: {
    zIndex: '3'
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
const customStylesForVideo: CustomModalStyle = {
  overlay: {
    zIndex: '5'
  },
  content: {
    width: '90vw',
    height: '70vh',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    fontFamily: 'Plus Jakarta Text',
    borderRadius: '16px',
    background: '#4e4d4d'
  }
};
Modal.setAppElement('#root');

const GreymanSplashPage: FC<SplashPageProps> = ({ setIsSplashPage }) => {
  const dispatch = useAppDispatch();
  const seo = useAppSelector((store) => store.seo);
  const [timerLeft, setTimerLeft] = useState<number>();
  const [copies, setCopies] = useState<string>();
  const [soldCopies, setSoldCopies] = useState<string>();
  const [openCheckList, setOpenCheckList] = useState<boolean>(false);
  const [processDone, setProcessDone] = useState<boolean>(false);

  const reactSwal = useSwal();
  const { web3TxHandler, correctBlockchain, web3Switch } = useWeb3Tx();

  const [active, setActive] = useState<TSplashPageIsActive>({
    policy: false,
    use: false
  });
  const { connectUserData } = useConnectUser();
  const GraymanSplashPageTESTNET = '0xbA947797AA2f1De2cD101d97B1aE6b04182fF3e6';
  const GreymanChainId = '0x89';
  const offerIndexInMarketplace = '2';
  const { primaryColor } = useAppSelector((store) => store.colors);
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const [modalVideoIsOpen, setVideoIsOpen] = useState<boolean>(false);

  const { isLoggedIn } = useAppSelector((store) => store.user);
  const { provider } = useAppSelector((store) => store.web3);

  useEffect(() => {
    dispatch(
      setSEOInfo({
        title: '#Cryptogreyman',
        ogTitle: '#Cryptogreyman',
        twitterTitle: '#Cryptogreyman',
        contentName: 'author',
        content: 'Digital Ownership Encryption',
        description: '7.907.414.597 Non-Unique NFTs',
        ogDescription: '7.907.414.597 Non-Unique NFTs',
        twitterDescription: '7.907.414.597 Non-Unique NFTs',
        image: `${
          import.meta.env.VITE_IPFS_GATEWAY
        }/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW`,
        favicon: GreymanFavicon,
        faviconMobile: GreymanFavicon
      })
    );
  }, []);

  const { contractCreator, diamondMarketplaceInstance } = useContracts();
  const { currentUserAddress, connectedChain } = useAppSelector(
    (store) => store.web3
  );

  const toggleCheckList = () => {
    setOpenCheckList((prev) => !prev);
  };

  useEffect(() => {
    dispatch(setRequestedChain(GreymanChainId));
  }, [dispatch]);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const openModalForVideo = useCallback(() => {
    setVideoIsOpen(true);
  }, []);

  function afterOpenModal() {
    subtitle.style.color = '#9013FE';
  }

  function closeModal() {
    setIsOpen(false);
    setVideoIsOpen(false);
    setActive((prev) => ({
      ...prev,
      policy: false,
      use: false
    }));
  }

  const buyGrayman = async () => {
    if (!currentUserAddress) {
      connectUserData?.();
      return;
    }
    if (correctBlockchain(GreymanChainId)) {
      web3Switch(GreymanChainId);
      return;
    }
    if (!diamondMarketplaceInstance) {
      reactSwal.fire({
        title: 'An error has ocurred',
        html: 'Please try again later',
        icon: 'info'
      });
      return;
    }
    const greymanOffer = await web3TxHandler(
      diamondMarketplaceInstance,
      'getOfferInfo',
      [offerIndexInMarketplace]
    );
    if (!greymanOffer) {
      reactSwal.fire({
        title: 'An error has ocurred',
        html: 'Please try again later',
        icon: 'info'
      });
      return;
    }
    if (greymanOffer) {
      const instance = contractCreator?.(
        GraymanSplashPageTESTNET,
        diamondFactoryAbi
      );
      if (!instance) {
        return;
      }
      const nextToken = await web3TxHandler(
        instance,
        'getNextSequentialIndex',
        [
          greymanOffer.productIndex,
          greymanOffer.rangeData.rangeStart,
          greymanOffer.rangeData.rangeEnd
        ]
      );
      if (!nextToken) {
        reactSwal.fire({
          title: 'An error has ocurred',
          html: 'Please try again later',
          icon: 'info'
        });
        return;
      }
      reactSwal.fire({
        title: 'Please wait...',
        html: `Buying Greyman #${nextToken.toString()}`,
        icon: 'info',
        showConfirmButton: false
      });
      if (
        await web3TxHandler(
          diamondMarketplaceInstance,
          'buyMintingOffer',
          [
            offerIndexInMarketplace,
            nextToken,
            {
              value: greymanOffer.rangeData.rangePrice
            }
          ],
          {
            intendedBlockchain: GreymanChainId,
            failureMessage:
              'Sorry your transaction failed! When several people try to buy at once - only one transaction can get to the blockchain first. Please try again!'
          }
        )
      ) {
        reactSwal.fire({
          imageUrl: GreyMan,
          imageHeight: 'auto',
          imageWidth: '65%',
          imageAlt: 'GreyMan image',
          title: `You own #${nextToken}!`,
          icon: 'success'
        });
      }
    }
  };

  const openVideo = () => {
    openModalForVideo();
  };

  const showVideoToLogginedUsers = () => {
    if (isLoggedIn) {
      return (
        <>
          <ImageLazy
            className="video-grey-man-pic"
            src={GreyMan}
            alt="community-img"
          />
          <div className="video-grey-man-metamask-logo-wrapper">
            <button
              style={{
                border: 'none',
                background: 'none',
                display: `${processDone ? 'none' : 'block'}`
              }}
              className="video-grey-man-metamask-logo metamask-logo"
              onClick={() => openVideo()}>
              <img src={playImagesColored} alt="Play" />
            </button>
          </div>
          <Modal
            isOpen={modalVideoIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStylesForVideo}
            contentLabel="Example Modal">
            <h2
              className="video-grey-man-video-title"
              ref={(_subtitle) => (subtitle = _subtitle)}>
              Interview with artist Dadara.
            </h2>
            <StandaloneVideoPlayer
              setProcessDone={setProcessDone}
              baseURL={'https://storage.googleapis.com/rair-videos/'}
              mediaId={'QmU8iCk2eE2V9BV6Bo6QiXEgQqER1zf4fnsnStNxH77KH8'}
            />
          </Modal>
        </>
      );
    } else {
      return (
        <>
          <ImageLazy
            className="video-grey-man-pic"
            src={GreyMan}
            alt="community-img"
          />
          <div className="video-grey-man-metamask-logo-wrapper">
            <button
              style={{
                border: 'none',
                background: 'none',
                display: `${processDone ? 'none' : 'block'}`
              }}
              className="video-grey-man-metamask-logo metamask-logo"
              onClick={() => openVideo()}>
              <img src={playImagesColored} alt="Play" />
            </button>
          </div>
          <Modal
            isOpen={modalVideoIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStylesForVideo}
            contentLabel="Example Modal">
            <h2
              className="video-grey-man-video-title"
              ref={(_subtitle) => (subtitle = _subtitle)}>
              Interview with artist Dadara.
            </h2>
            <StandaloneVideoPlayer
              setProcessDone={setProcessDone}
              baseURL={'https://storage.googleapis.com/rair-videos/'}
              mediaId={'QmU8iCk2eE2V9BV6Bo6QiXEgQqER1zf4fnsnStNxH77KH8'}
            />
          </Modal>
        </>
      );
    }
  };

  let subtitle;

  const getAllProduct = useCallback(async () => {
    try {
      if (diamondMarketplaceInstance && connectedChain === GreymanChainId) {
        const responseAllProduct = await web3TxHandler(
          diamondMarketplaceInstance,
          'getOfferInfo',
          [offerIndexInMarketplace]
        );
        if (responseAllProduct) {
          const tokensInRange = responseAllProduct.rangeData.rangeEnd
            .sub(responseAllProduct.rangeData.rangeStart)
            .add(2222)
            .add(1);
          const soldTokens = tokensInRange.sub(
            responseAllProduct.rangeData.mintableTokens
          );
          setCopies(tokensInRange.toString());
          // setCopies(responseAllProduct.products[0].copies);
          // setSoldCopies(responseAllProduct.products[0].soldCopies);
          setSoldCopies(soldTokens.toString());
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [diamondMarketplaceInstance, connectedChain, web3TxHandler]);

  useEffect(() => {
    if (!diamondMarketplaceInstance) {
      return;
    }
    diamondMarketplaceInstance.on('MintedToken', getAllProduct);
    return () => {
      diamondMarketplaceInstance.off('MintedToken', getAllProduct);
    };
  }, [diamondMarketplaceInstance, getAllProduct]);

  useEffect(() => {
    getAllProduct();
  }, [getAllProduct]);

  useEffect(() => {
    setIsSplashPage?.(true);
  }, [setIsSplashPage]);

  return (
    <div className="wrapper-splash-page greyman-page">
      <MetaTags seoMetaTags={seo} />
      <div className="home-splash--page">
        <PurchaseChecklist
          openCheckList={openCheckList}
          toggleCheckList={toggleCheckList}
          nameSplash={'Cryptogreyman'}
          backgroundColor={{ darkTheme: '#676767', lightTheme: '#818181' }}
        />
        <AuthorBlock mainClass="greyman-page-author">
          <ButtonHelp
            backgroundButton={'var(--stimorol)'}
            toggleCheckList={toggleCheckList}
          />
          <div className="block-splash">
            <div className="text-splash">
              <div className="title-splash greyman-page">
                <h3>
                  {/* eslint-disable */}
                  "All greymen are grey, but some are more grey than others." -
                  Dadara
                  {/* eslint-enable */}
                </h3>
                <h3
                  style={{
                    fontSize: '56px',
                    paddingBottom: '17px',
                    marginTop: '7rem'
                  }}
                  className="text-gradient-grey">
                  #Cryptogreyman
                </h3>
              </div>
              {timerLeft === 0 && (
                <div className="text-description" style={{ color: '#A7A6A6' }}>
                  7.907.414.597 non-unique NFTs. All metadata is identical only
                  the serial number changes. Claim yours for <strong>1</strong>{' '}
                  MATIC
                </div>
              )}
              {timerLeft !== 0 && (
                <div className="greyman-">
                  <Countdown
                    setTimerLeft={setTimerLeft}
                    time={'2022-02-22T22:22:00-00:00'}
                  />
                </div>
              )}
              <div className="btn-buy-metamask">
                {false && timerLeft === 0 && (
                  <button onClick={() => openModal()}>
                    <img
                      className="metamask-logo"
                      src={metaMaskIcon}
                      alt="metamask-logo"
                    />{' '}
                    Mint with Matic
                  </button>
                )}
                {timerLeft === 0 && (
                  <PurchaseTokenButton
                    {...{
                      customWrapperClassName: '',
                      img: metaMaskIcon,
                      contractAddress: GraymanSplashPageTESTNET,
                      requiredBlockchain: GreymanChainId,
                      offerIndex: [offerIndexInMarketplace],
                      connectUserData,
                      buttonLabel: 'Mint with Matic',
                      presaleMessage: (
                        <div className="w-100 row">
                          <div className="col-12 col-md-3" />
                          <div className="col-12 col-md-4 ps-xl-5 h4">
                            By accepting these terms, I agree <b>not</b> to have
                            any fun with this greyman
                          </div>
                          <div className="col-12 col-md-3 text-center text-md-start text-xl-center">
                            <img
                              style={{ display: 'inline', maxHeight: '25vh' }}
                              src={GreyManNotFun}
                              alt="not-fun"
                            />
                          </div>
                          <div className="col-12 col-md-2" />
                        </div>
                      ),
                      diamond: true,
                      customSuccessAction: (nextToken) => {
                        reactSwal.fire({
                          imageUrl: GreyMan,
                          imageHeight: 'auto',
                          imageWidth: '65%',
                          imageAlt: 'GreyMan image',
                          title: `You own #${nextToken}!`,
                          icon: 'success'
                        });
                      }
                    }}
                  />
                )}
              </div>
              <div className="btn-timer-nipsey">
                {/**/}
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
                        <span style={{ width: '287px' }} className="modal-text">
                          By accepting these terms, I agree{' '}
                          <strong
                            style={{
                              color: 'rgb(136 132 132)',
                              fontWeight: 'bolder'
                            }}>
                            not
                          </strong>{' '}
                          to have any fun with this greyman
                        </span>
                        <ImageLazy src={GreyManNotFun} alt="not-fun" />
                      </div>
                      <div className="modal-btn-wrapper">
                        <button
                          onClick={buyGrayman}
                          disabled={!Object.values(active).every((el) => el)}
                          className="modal-btn">
                          <img
                            style={{ width: '100px', marginLeft: '-1rem' }}
                            className="metamask-logo modal-btn-logo"
                            src={metaMaskIcon}
                            alt="metamask-logo"
                          />{' '}
                          {provider?.chainId !== GreymanChainId
                            ? 'Switch network'
                            : currentUserAddress
                              ? 'PURCHASE'
                              : 'Connect your wallet!'}
                        </button>
                      </div>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
        </AuthorBlock>
        {timerLeft === 0 && (
          <TokenLeftGreyman soldCopies={soldCopies} copies={copies} />
        )}
        <div className="about-metadata-wrapper">
          {timerLeft === 0 && (
            <>
              <div className="about-metadata">
                <h1
                  style={{
                    color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
                  }}>
                  <span style={{ color: 'white' }}>What is </span>{' '}
                  <span style={{ color: 'grey' }}>Metadata</span>
                </h1>
                <p
                  style={{
                    color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
                  }}>
                  When a painting hangs on a wall, it’s always there for us to
                  enjoy. No electricity, no internet connection needed. No
                  distractions, pings, and notifications calling us while we try
                  to focus on the art. We can create our own bubble with the
                  physical piece of art. It’s always there for us. We can admire
                  the brush strokes from close by, and clearly see and feel that
                  not one of them is the same. And in a world where everything
                  is in flux and constant change, the painting is not changing,
                  inviting us to go deeper and deeper and discover more aspects
                  it all the time. The painting remains the same, but our
                  perception of it and relationship to it becomes deeper and
                  more intimate.
                </p>
                <p
                  style={{
                    color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
                  }}>
                  So why artificially limit our NFTs to a one of one? We can
                  create enough for everyone. There are 7.908.125.000 people on
                  this planet as of the time of writing. So, we created
                  7.908.125.000 NFTs. And all are identical. No rare traits or
                  characteristics which would artificially make one Greyman
                  worth more than another - each and every one of those Greymen
                  is exactly the same! The only thing that is different is their
                  numeric identification: you can obtain number 5, or number
                  1971, or number 3.427.903.612. And actually, that is exactly
                  what an NFT is about: it’s a number registered on the
                  blockchain. And isn’t that what nowadays is also identifying
                  us as human beings – just a number? After all, our social
                  number is what defines us increasingly in our current society.
                  Or our geographical location, or our Metamask address, or…..
                </p>
              </div>
              <div className="about-metadata-second-block-wrapper">
                <div className="about-metadata-second-block">
                  <p
                    style={{
                      color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
                    }}>
                    Metadata is how NFT serial numbers render information
                  </p>
                  <p
                    style={{
                      color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
                    }}>
                    The Greyman contract on the{' '}
                    <span
                      style={{
                        fontWeight: 'bolder',
                        fontSize: '18px',
                        color: `${
                          primaryColor === 'rhyno' ? '#000' : '#c1c1c1'
                        }`
                      }}>
                      MATIC blockchain
                    </span>{' '}
                    points to{' '}
                    <span
                      style={{
                        fontWeight: 'bolder',
                        fontSize: '18px',
                        color: `${
                          primaryColor === 'rhyno' ? '#000' : '#c1c1c1'
                        }`
                      }}>
                      {' '}
                      a metadata{' '}
                    </span>
                    JSON file with properties
                  </p>
                  <p
                    style={{
                      color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
                    }}>
                    MATIC works just like Ethereum, but is less expensive and
                    energy intense to point to metadata
                  </p>
                  <p
                    style={{
                      color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
                    }}>
                    The metadata files we point to are hosted on IPFS so they
                    don’t get lost, censored, or tampered with
                  </p>
                  <p
                    style={{
                      color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
                    }}>
                    Metadata is then rendered by any free browser
                  </p>
                </div>
                <div className="property-wrapper">
                  <div className="property-first-wrapper">
                    <div className="property-first">
                      <div
                        className="property"
                        style={{
                          background: `${
                            primaryColor === 'rhyno' ? '#cccccc' : 'none'
                          }`
                        }}>
                        <span className="property-desc">Background Color</span>
                        <span className="property-name-color">Grey</span>
                        <span className="property-color">100%</span>
                      </div>
                    </div>
                    <div className="property-second">
                      <div
                        className="property second"
                        style={{
                          background: `${
                            primaryColor === 'rhyno' ? '#cccccc' : 'none'
                          }`
                        }}>
                        <span className="property-desc">Pant Color</span>
                        <span className="property-name-color">Grey</span>
                        <span className="property-color">100%</span>
                      </div>
                    </div>
                  </div>
                  <div className="property-btn-wrapper">
                    <a
                      href={`${
                        import.meta.env.VITE_IPFS_GATEWAY
                      }/QmdJN6BzzYk5vJh1hQgGHGxT7GhVgrvNdArdFo9t9fgqLt`}
                      target="_blank"
                      rel="noreferrer">
                      <button className="property-btn">View on IPFS</button>
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="join-community">
          {timerLeft === 0 && (
            <>
              <div className="title-join">
                <h3>
                  <span>
                    Only <span className="text-gradient">7.907.414.597</span>{' '}
                    NFTs will ever be minted
                  </span>
                </h3>
              </div>
            </>
          )}
          <div className="main-greyman-pic-wrapper">
            {timerLeft === 0 && (
              <>
                <div className="main-greyman-pic">
                  <div className="join-pic-main">
                    <div className="show-more-wrap">
                      <span className="show-more" style={{ color: '#fff' }}>
                        Coming Soon <FontAwesomeIcon icon={faArrowRight} />
                      </span>
                    </div>
                    <ImageLazy
                      className="join-pic-main-img"
                      src={GreyMan}
                      alt="community-img"
                    />
                  </div>
                </div>
                <div className="list-of-greymans-pic">
                  <div className="join-pic">
                    <ImageLazy
                      className="join-pic-img"
                      src={GreyMan}
                      alt="community-img"
                    />
                  </div>
                  <div className="join-pic">
                    <ImageLazy
                      className="join-pic-img"
                      src={GreyMan}
                      alt="community-img"
                    />
                  </div>
                  <div className="join-pic">
                    <ImageLazy
                      className="join-pic-img"
                      src={GreyMan}
                      alt="community-img"
                    />
                  </div>
                  <div className="join-pic">
                    <ImageLazy
                      className="join-pic-img"
                      src={GreyMan}
                      alt="community-img"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          {timerLeft === 0 && (
            <>
              <div className="exclusive-nfts">
                <MobileCarouselNfts>
                  <ImageLazy
                    className="join-pic-img"
                    src={GreyMan}
                    alt="community-img"
                  />
                  <ImageLazy
                    className="join-pic-img"
                    src={GreyMan}
                    alt="community-img"
                  />
                  <ImageLazy
                    className="join-pic-img"
                    src={GreyMan}
                    alt="community-img"
                  />
                  <ImageLazy
                    className="join-pic-img"
                    src={GreyMan}
                    alt="community-img"
                  />
                </MobileCarouselNfts>
              </div>
            </>
          )}
        </div>
        {timerLeft === 0 && (
          <>
            <div className="video-grey-man-wrapper">
              <p
                className="video-grey-man-title"
                style={{
                  color: `${primaryColor === 'rhyno' ? '#000' : '#FFFFFF'}`
                }}>
                For Greymen Only
              </p>
              <div className="video-grey-man">{showVideoToLogginedUsers()}</div>
              <div className="video-grey-man-desc-wrapper">
                <span
                  style={{
                    color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
                  }}
                  className="video-grey-man-desc">
                  NFT owners can learn more about the project by signing with
                  metamask to unlock an encrypted stream{' '}
                </span>
              </div>
            </div>

            <div className="greyman-timeline-wrapper">
              <h1
                style={{ color: '#6C6C6C' }}
                className="greyman-timeline-title">
                Greyman <span style={{ color: 'white' }}>Timeline</span>
              </h1>
            </div>
            <Timeline />
            <TeamMeet
              arraySplash={'greyman'}
              titleHeadFirst={'About the'}
              titleHeadSecond={'Artist'}
              classNameHeadSpan={'text-gradient'}
              teamArray={teamGreymanArray}
            />
            <NotCommercial />
          </>
        )}
      </div>
    </div>
  );
};

export default GreymanSplashPage;
