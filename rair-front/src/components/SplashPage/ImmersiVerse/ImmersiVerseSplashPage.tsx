import { FC, useEffect, useState } from 'react';
import Modal from 'react-modal';

import { teamImmersiverseArray } from './AboutUsTeam';

import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxHooks';
import { DocumentIcon, metaMaskIcon } from '../../../images';
import { setSEOInfo } from '../../../redux/seoSlice';
import { CustomModalStyle, SplashPageProps } from '../../../types/commonTypes';
import MobileCarouselNfts from '../../AboutPage/AboutPageNew/ExclusiveNfts/MobileCarouselNfts';
import { ImageLazy } from '../../MockUpPage/ImageLazy/ImageLazy';
import MetaTags from '../../SeoTags/MetaTags';
import AuthorBlock from '../AuthorBlock/AuthorBlock';
import { SXSW1, SXSW2, SXSW3 } from '../images/SxSw/sxSw';
import NotCommercialGeneric from '../NotCommercial/NotCommercialGeneric';
import { TSplashPageIsActive } from '../splashPage.types';
import TeamMeet from '../TeamMeet/TeamMeetList';

import favion_Immersil from './../images/favicons/ImmersiverseATX.ico';

/* importing Components*/
import './../SplashPage.css';
import './../Greyman/./GreymanSplashPageMobile.css';
import './../../AboutPage/AboutPageNew/AboutPageNew.css';

const customStyles: CustomModalStyle = {
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

Modal.setAppElement('#root');

const ImmersiVerseSplashPage: FC<SplashPageProps> = ({ setIsSplashPage }) => {
  const dispatch = useAppDispatch();
  const seo = useAppSelector((store) => store.seo);
  const [, /*active*/ setActive] = useState<TSplashPageIsActive>({
    policy: false,
    use: false
  });
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const { currentUserAddress } = useAppSelector((store) => store.web3);

  useEffect(() => {
    dispatch(
      setSEOInfo({
        title: '#ImmersiverseATX',
        ogTitle: '#ImmersiverseATX',
        twitterTitle: '#ImmersiverseATX',
        contentName: 'author',
        content: 'Digital Ownership Encryption',
        description:
          'Claim your NFT to unlock encrypted streams from the ImmersiverseATX event',
        ogDescription:
          'Claim your NFT to unlock encrypted streams from the ImmersiverseATX event',
        twitterDescription:
          'Claim your NFT to unlock encrypted streams from the ImmersiverseATX event',
        image: `${
          import.meta.env.VITE_IPFS_GATEWAY
        }/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW`,
        favicon: favion_Immersil,
        faviconMobile: favion_Immersil
      })
    );
    //eslint-disable-next-line
  }, []);

  const carousel_match = window.matchMedia('(min-width: 600px)');
  const [carousel, setCarousel] = useState<boolean>(carousel_match.matches);
  window.addEventListener('resize', () => setCarousel(carousel_match.matches));

  let subtitle: Modal;

  function afterOpenModal() {
    if (subtitle?.props?.style?.content) {
      return (subtitle.props.style.content.color = '#9013FE');
    }
  }

  function closeModal() {
    setIsOpen(false);
    setActive((prev) => ({
      ...prev,
      policy: false,
      use: false
    }));
  }

  const formHyperlink = () => {
    window.open(
      'https://docs.google.com/forms/d/e/1FAIpQLSeSoeMejqA_DntWIJTcJQA4UbWSSUaYfXrj4hFKPPkyzDuByw/viewform',
      '_blank'
    );
  };

  useEffect(() => {
    setIsSplashPage?.(true);
  }, [setIsSplashPage]);

  return (
    <div className="wrapper-splash-page greyman-page">
      <MetaTags seoMetaTags={seo} />
      <div className="home-splash--page">
        <AuthorBlock mainClass="immersiverse-page-author">
          <div className="block-splash">
            <div className="text-splash">
              <div className="title-splash greyman-page">
                <h3
                  style={{
                    fontSize: '56px',
                    paddingBottom: '17px',
                    marginTop: '1rem'
                  }}
                  className="text-gradient-blue">
                  #ImmersiVerse ATX
                </h3>
              </div>
              <div className="text-description" style={{ color: '#A7A6A6' }}>
                {/* eslint-disable */}
                Let us know you're coming! Click the "Connect Wallet" button in
                the top right corner of the page, then click the button below to
                fill out the form to receive a free airdrop to unlock encrypted
                streams on the drop date!
                {/* eslint-enable */}
              </div>
              <div className="btn-submit-with-form">
                <button onClick={() => formHyperlink()}>
                  <img
                    className="metamask-logo"
                    src={DocumentIcon}
                    alt="metamask-logo"
                  />{' '}
                  Form
                </button>
              </div>
              <div className="btn-timer-nipsey">
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
                    }}>
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
                      <div className="modal-btn-wrapper">
                        <div className="modal-btn">
                          <img
                            style={{ width: '100px', marginLeft: '-1rem' }}
                            className="metamask-logo modal-btn-logo"
                            src={metaMaskIcon}
                            alt="metamask-logo"
                          />{' '}
                          {currentUserAddress
                            ? "You're connected!"
                            : 'Connect your wallet!'}
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
        </AuthorBlock>
        <div className="exclusive-nfts" style={{ marginTop: '80px' }}>
          <h2 className="carousel-title"> 3 Unique Styles </h2>
          {carousel ? (
            <div className="list-of-immersiverse-pic">
              <div className="join-pic-list">
                <h4 className="carousel-items"> Bubblegum </h4>
                <ImageLazy
                  className="join-pic-img-list"
                  src={SXSW1}
                  alt="ImmersiVerse ATX Bubblegum"
                />
              </div>
              <div className="join-pic-list">
                <h4 className="carousel-items"> Gold </h4>
                <ImageLazy
                  className="join-pic-img-list"
                  src={SXSW2}
                  alt="ImmersiVerse ATX Gold"
                />
              </div>
              <div className="join-pic-list">
                <h4 className="carousel-items"> Seabreeze</h4>
                <ImageLazy
                  className="join-pic-img-list"
                  src={SXSW3}
                  alt="ImmersiVerse ATX Seabreeze"
                />
              </div>
            </div>
          ) : (
            <MobileCarouselNfts>
              <div className="join-pic-carousel">
                <h4 className="carousel-items"> Bubblegum </h4>
                <ImageLazy
                  className="join-pic-img"
                  src={SXSW1}
                  alt="ImmersiVerse ATX Bubblegum"
                />
              </div>
              <div className="join-pic-carousel">
                <h4 className="carousel-items"> Gold</h4>
                <ImageLazy
                  className="join-pic-img"
                  src={SXSW2}
                  alt="ImmersiVerse ATX Gold"
                />
              </div>
              <div className="join-pic-carousel">
                <h4 className="carousel-items"> Seabreeze </h4>
                <ImageLazy
                  className="join-pic-img"
                  src={SXSW3}
                  alt="ImmersiVerse ATX Seabreeze"
                />
              </div>
            </MobileCarouselNfts>
          )}
        </div>
        <TeamMeet
          teamArray={teamImmersiverseArray}
          arraySplash={'immersiverse'}
          titleHeadFirst={'About'}
        />
        <NotCommercialGeneric />
      </div>
    </div>
  );
};

export default ImmersiVerseSplashPage;
