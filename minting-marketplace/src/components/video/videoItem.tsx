// @ts-nocheck
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2';
import Modal from 'react-modal';
import { IVideoItem, TParticularProduct } from './video.types';
import { metamaskCall } from '../../utils/metamaskUtils';
import { SvgKey } from '../MockUpPage/NftList/SvgKey';
import { SvgLock } from '../MockUpPage/NftList/SvgLock';
import { UserType } from '../../ducks/users/users.types';
import { TUserResponse } from '../../axios.responseTypes';
import { useStateIfMounted } from 'use-state-if-mounted';
import chainData from '../../utils/blockchainData';
import CustomButton from '../MockUpPage/utils/button/CustomButton';
import playImages from '../SplashPage/images/playImg.png';
import NftVideoplayer from '../MockUpPage/NftList/NftData/NftVideoplayer/NftVideoplayer';
import { CheckEthereumChain } from '../../utils/CheckEthereumChain';
import { ModalContentCloseBtn } from '../MockUpPage/utils/button/ShowMoreItems';
// import { TChainItemData } from '../../utils/utils.types';

Modal.setAppElement('#root');

const VideoItem: React.FC<IVideoItem> = ({ mediaList, item }) => {
  const navigate = useNavigate();
  const { minterInstance } = useSelector((state) => state.contractStore);
  const { primaryColor } = useSelector((store) => store.colorStore);

  const customStyles = {
    overlay: {
      zIndex: '1'
    },
    content: {
      background: primaryColor === 'rhyno' ? '#F2F2F2' : '#383637',
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
      border: 'none',
      borderRadius: '16px'
    }
  };

  let availableToken = [];

  const [modalIsOpen, setModalIsOpen] = useState(false);
  // const [modalBuy, setModalBuy] = useState(false);
  const [modalHelp, setModalHelp] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [owned, setOwned] = useState(false);
  const [openVideoplayer, setOpenVideoplayer] = useState(false);
  const [data, setData] = useStateIfMounted<TParticularProduct | null>(null);
  const [dataUser, setDataUser] = useStateIfMounted<UserType | null>(null);

  // primaryColor === 'rhyno' ? '#F2F2F2' : '#383637'

  const buy = async (
    offerPool: String,
    offer: String,
    token: String,
    price: String,
    blockchain: String
  ) => {
    if (blockchain !== window?.ethereum?.chainId) {
      CheckEthereumChain(blockchain);
    } else {
      Swal.fire({
        title: 'Buying token',
        html: 'Awaiting transaction completion',
        icon: 'info',
        showConfirmButton: false
      });
      if (
        await metamaskCall(
          minterInstance.buyToken(offerPool, offer, token, {
            value: price
          }),
          `Not enough funds to buy, you need ${price} ${
            chainData[data?.contract.blockchain]?.symbol
          } `
        )
      ) {
        Swal.fire(
          'Success',
          `Now, you are the owner of ${token} token`,
          'success'
        );
        setOwned(true);
        setModalHelp(false);
      }
    }
  };

  const openModal = useCallback(() => {
    setModalIsOpen(true);
  }, [setModalIsOpen]);

  const openHelp = useCallback(() => {
    setModalHelp((prev) => !prev);
  }, []);

  const closeModal = useCallback(() => {
    setModalIsOpen(false);
    setOpenVideoplayer(false);
  }, [setModalIsOpen]);

  const goToCollectionView = () => {
    navigate(
      `/collection/${data?.contract.blockchain}/${data?.contract.contractAddress}/${mediaList[item]?.product}/0`
    );
  };

  const goToUnlockView = () => {
    navigate(
      `/unlockables/${data?.contract.blockchain}/${data?.contract.contractAddress}/${mediaList[item]?.product}/0`
    );
  };

  const getInfo = useCallback(async () => {
    if (mediaList && item) {
      const response = await axios.get(
        `/api/${mediaList[item].contract}/${mediaList[item].product}`
      );
      setData(response.data.result);
    }
  }, [mediaList, item, setData]);

  const getInfoUser = useCallback(async () => {
    if (mediaList && item && data) {
      const response = await axios.get<TUserResponse>(
        `/api/users/${mediaList[item].authorPublicAddress}`
        // `/api/users/${data.data.result.contract.user}`
      );
      setDataUser(response.data.user);
    }
  }, [mediaList, item, data, setDataUser]);

  const arrAllTokens = () => {
    if (data) {
      availableToken = data?.tokens
        .filter((availableToken) => availableToken.isMinted === false)
        .slice(0, 7);
      return availableToken;
    } else {
      return (
        <div className="ol">we do not have any tokens available for sale</div>
      );
    }
  };
  arrAllTokens();

  //TODO: use in a future
  // const sortRevers = () => {
  //   console.info(data?.tokens.reverse(), 'sort');
  // };

  useEffect(() => {
    getInfo();
  }, [getInfo]);

  useEffect(() => {
    getInfoUser();
  }, [getInfoUser]);

  useEffect(() => {
    closeModal();
  }, [closeModal]);

  return (
    <button
      className="col-12 col-sm-6 col-md-4 col-lg-3 px-1 text-start video-wrapper"
      style={{
        height: '215px',
        width: '384px',
        border: 'none',
        backgroundColor: 'transparent',
        marginBottom: '20px',
        marginRight: '24px'
      }}
      // onClick={() => {
      // setIsOpen(true);
      // openModal();
      // navigate(
      //   `/watch/${mediaList[item]._id}/${mediaList[item].mainManifest}`
      // );
      // }}
      onMouseEnter={() => setHovering(mediaList[item].animatedThumbnail !== '')}
      onMouseLeave={() => setHovering(false)}>
      <div
        onClick={() => openModal()}
        className="col-12 rounded"
        style={{
          top: 0,
          position: 'relative',
          height: '100%',
          width: 'inherit'
        }}>
        <img
          alt="thumbnail"
          src={`${mediaList[item].staticThumbnail}`}
          style={{
            position: 'absolute',
            bottom: 0,
            borderRadius: '16px',
            // objectFit: 'contain',
            background: 'black'
          }}
          className="col-12 h-100 w-100"
        />
        <img
          alt="Animated thumbnail"
          src={`${mediaList[item].animatedThumbnail}`}
          style={{
            position: 'absolute',
            display: hovering ? 'block' : 'none',
            bottom: 0,
            borderRadius: '16px',
            background: 'black'
          }}
          className="col-12  h-100 w-100"
        />
        {mediaList[item]?.isUnlocked ? (
          <SvgKey color={'#4E4D4D'} bgColor={'white'} />
        ) : (
          <SvgLock color={'white'} />
        )}
      </div>
      <div className="col description-wrapper-video">
        <span className="description-title">
          {mediaList[item].title.slice(0, 25)}
          {mediaList[item].title.length > 26 ? '...' : ''}
        </span>
        <div className="info-wrapper video-size">
          <div className="user-info">
            <div className="user-image">
              <img src={dataUser?.avatar ? dataUser?.avatar : ''} alt="user" />
            </div>
            <div className="user-name">
              <span>
                {dataUser?.nickName.slice(0, 25)}
                {dataUser?.nickName.length > 26 ? '...' : ''}
              </span>
            </div>
          </div>
          <div className="price-info">
            <div className="price-total">
              <span className="duration-for-video">
                {' '}
                {mediaList[item].duration}
              </span>
            </div>
          </div>
        </div>
        <br />
        <>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Video Modal">
            <div className="modal-content-wrapper-for-video">
              <div className="modal-content-video">
                {mediaList[item]?.isUnlocked === false && !owned ? (
                  <>
                    <i
                      data-title="You need to buy NFT"
                      className="fa fa-lock modal-content-video-lock"
                    />
                  </>
                ) : openVideoplayer ? (
                  <NftVideoplayer selectVideo={mediaList[item]} />
                ) : (
                  <>
                    <img
                      onClick={() => setOpenVideoplayer(true)}
                      className={'modal-content-play-image'}
                      src={playImages}
                      alt="Play"
                    />
                  </>
                )}
                {openVideoplayer ? (
                  <></>
                ) : (
                  <img
                    alt="modal-content-video-thumbnail"
                    src={`${mediaList[item].staticThumbnail}`}
                    className="modal-content-video-thumbnail"
                  />
                )}
              </div>
              <div className="modal-content-video-choice">
                <div className="modal-content-close-btn-wrapper">
                  {/* <button
                    className="modal-content-close-btn"
                    onClick={closeModal}>
                    <i className="fas fa-times"></i>
                  </button> */}
                  <ModalContentCloseBtn
                    primaryColor={primaryColor}
                    onClick={closeModal}>
                    <i className="fas fa-times" />
                  </ModalContentCloseBtn>
                </div>
                <div className="modal-content-block-btns">
                  {mediaList[item]?.isUnlocked === false && (
                    <div className="modal-content-block-buy">
                      <img src={data?.tokens[0].metadata.image} alt="fsf" />
                      <CustomButton
                        text={'Buy now'}
                        width={'232px'}
                        height={'48px'}
                        textColor={
                          primaryColor === 'rhyno' ? '#222021' : 'white'
                        }
                        onClick={openHelp}
                        margin={'0 45px 37px'}
                        custom={true}
                      />
                    </div>
                  )}
                  <CustomButton
                    text={'View more NFTs'}
                    width={'208px'}
                    height={'48px'}
                    textColor={primaryColor === 'rhyno' ? '#222021' : 'white'}
                    onClick={goToCollectionView}
                    margin={'0 45px 18px'}
                    custom={false}
                  />
                  <CustomButton
                    text={'More unlockables'}
                    width={'208px'}
                    height={'48px'}
                    textColor={primaryColor === 'rhyno' ? '#222021' : 'white'}
                    onClick={goToUnlockView}
                    margin={'0'}
                    custom={false}
                  />
                </div>
              </div>
            </div>
            {modalHelp && (
              <div className="more-info-wrapper">
                <span className="more-info-text">
                  These NFTs unlock this video
                </span>
                {/* <button onClick={() => sortRevers()}>Reverse displaying</button> */}
                <div className="more-info">
                  {availableToken.length > 0 ? (
                    availableToken.map((e) => {
                      return (
                        <div key={e._id} className="more-info-unlock-wrapper">
                          <img src={e.metadata.image} alt="fsf" />
                          <CustomButton
                            text={
                              data?.contract.products.offers[e.offer].price +
                              ' ' +
                              chainData[data?.contract.blockchain]?.symbol
                            }
                            width={'auto'}
                            height={'45px'}
                            textColor={'white'}
                            onClick={() =>
                              buy(
                                e.offerPool,
                                e.offer,
                                e.token,
                                data?.contract.products.offers[e.offer].price,
                                data?.contract.blockchain
                              )
                            }
                            margin={'0'}
                            custom={true}
                          />
                        </div>
                      );
                    })
                  ) : (
                    <span className="more-info-text">
                      In this collection we don&apos;t have any tokens available
                      for sale, sorry.
                    </span>
                  )}
                </div>
              </div>
            )}
          </Modal>
        </>
      </div>
    </button>
  );
};

export default VideoItem;
